import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // service role so we can update share records server-side
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { token, userId, userEmail } = req.body

  if (!token || !userId || !userEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 1. Look up the pending invite by token (security definer function bypasses RLS)
    const { data: shares, error: lookupError } = await supabase
      .rpc('get_share_by_token', { invite_token: token })

    if (lookupError) throw lookupError

    const share = shares?.[0]

    if (!share) {
      return res.status(404).json({ error: 'Invite not found or already used' })
    }

    // 2. Verify the email matches
    if (share.shared_with_email.toLowerCase() !== userEmail.toLowerCase()) {
      return res.status(403).json({
        error: `This invite was sent to ${share.shared_with_email}. Please log in with that email address.`
      })
    }

    // 3. Accept the share — link the user's ID and mark as accepted
    const { error: updateError } = await supabase
      .from('list_shares')
      .update({
        shared_with_id: userId,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', share.id)

    if (updateError) throw updateError

    // 4. Return the list details so the app can redirect straight to it
    return res.status(200).json({
      success: true,
      listId: share.list_id,
      listName: share.list_name,
      permission: share.permission,
    })

  } catch (err) {
    console.error('accept-invite error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
