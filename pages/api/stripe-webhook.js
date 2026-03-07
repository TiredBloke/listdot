import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { buffer } from 'micro'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  const getUid = (obj) => obj?.metadata?.supabase_uid

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object
      const uid = getUid(sub)
      if (!uid) break
      await supabase.from('profiles').upsert({
        id: uid,
        is_pro: sub.status === 'active' || sub.status === 'trialing',
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer,
      })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const uid = getUid(sub)
      if (!uid) break
      await supabase.from('profiles').update({ is_pro: false }).eq('id', uid)
      break
    }
  }

  res.status(200).json({ received: true })
}
