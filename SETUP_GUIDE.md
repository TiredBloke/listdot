# 🚀 List. — Setup Guide
### Get your app live in ~30 minutes. No coding experience needed.

---

## What you'll need to create (all free to start)
- A **Supabase** account — your database and login system
- A **Stripe** account — handles payments
- A **Vercel** account — hosts your website
- A **GitHub** account — stores your code

---

## STEP 1 — Get the code onto GitHub

1. Go to **github.com** and create a free account
2. Click the **+** button (top right) → **New repository**
3. Name it `list-app`, set it to **Private**, click **Create repository**
4. Download the `list-app.zip` file I gave you and unzip it on your computer
5. Follow GitHub's instructions to upload ("push") the folder to your new repository
   - If you're on Mac/Windows, download **GitHub Desktop** (desktop.github.com) — it makes this much easier
   - In GitHub Desktop: File → Add Local Repository → select the unzipped folder → Publish

---

## STEP 2 — Set up Supabase (your database)

1. Go to **supabase.com** → **Start your project** → sign up free
2. Click **New Project**, give it a name like `list-app`, choose a region close to Australia, set a database password (save this somewhere)
3. Wait ~2 minutes for it to set up
4. In the left sidebar click **SQL Editor**
5. Click **New query**, paste the entire contents of `supabase-schema.sql` into the box, click **Run**
   - You should see "Success" — this creates all your database tables
6. Now go to **Settings** → **API** in the left sidebar
7. Copy and save these 3 values (you'll need them soon):
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role secret** key (another long string — keep this private!)
8. Enable Google login (optional but recommended):
   - Go to **Authentication** → **Providers** → **Google** → enable it
   - Follow the instructions to connect your Google account

---

## STEP 3 — Set up Stripe (payments)

1. Go to **stripe.com** → create a free account
2. Once in your dashboard, make sure you're in **Test mode** first (toggle top right) to test before going live
3. Go to **Products** → **Add product**
   - Name: `List. Pro`
   - Price: `$7.00` AUD, **Recurring**, **Monthly**
   - Click **Save product**
4. Click on the product you just made, find the **Price ID** (looks like `price_abc123`) — copy and save it
5. Go to **Developers** → **API Keys** → copy your **Secret key** (starts with `sk_test_...`)
6. Go to **Developers** → **Webhooks** → **Add endpoint**
   - You'll fill in the URL after Vercel deployment — come back to this in Step 5

---

## STEP 4 — Deploy to Vercel

1. Go to **vercel.com** → sign up free (use your GitHub account to sign up — easier)
2. Click **Add New Project** → **Import** your `list-app` GitHub repository
3. Before clicking Deploy, click **Environment Variables** and add all of these:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL from Step 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key from Step 2 |
| `STRIPE_SECRET_KEY` | Your Stripe secret key from Step 3 |
| `STRIPE_PRO_PRICE_ID` | Your Stripe price ID from Step 3 |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://list-app.vercel.app`) — you can update this after deployment |

4. Click **Deploy** — takes about 2 minutes
5. Once done, copy your Vercel URL (e.g. `https://list-app.vercel.app`)

---

## STEP 5 — Finish Stripe webhook setup

1. Go back to Stripe → **Developers** → **Webhooks**
2. Click **Add endpoint**
   - Endpoint URL: `https://YOUR-VERCEL-URL.vercel.app/api/stripe-webhook`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Click **Add endpoint**
3. Click on the webhook you just created → copy the **Signing secret** (starts with `whsec_...`)
4. Go back to Vercel → your project → **Settings** → **Environment Variables**
   - Add `STRIPE_WEBHOOK_SECRET` = the signing secret you just copied
5. Go to Vercel → your project → **Deployments** → click the three dots on the latest deployment → **Redeploy**

---

## STEP 6 — Test everything

1. Visit your Vercel URL
2. Click **Get started free** and create an account with your email
3. Check your email for a confirmation link — click it
4. Log in and try creating lists and tasks
5. Click **Upgrade to Pro** — use Stripe's test card number `4242 4242 4242 4242` (any future expiry, any CVC)
6. You should be redirected back to the app with a Pro badge

---

## STEP 7 — Go live (when ready)

1. In Stripe, toggle from **Test mode** to **Live mode** (top right)
2. Create a new product/price in Live mode (same $7/mo setup)
3. Update `STRIPE_SECRET_KEY` and `STRIPE_PRO_PRICE_ID` in Vercel with your Live mode keys
4. Repeat Step 5 with a new webhook for Live mode
5. Redeploy on Vercel

---

## Custom domain (optional)

Want `listapp.com` instead of `list-app.vercel.app`?

1. Buy a domain on **Namecheap** or **Google Domains** (~$15/year)
2. In Vercel → your project → **Settings** → **Domains** → add your domain
3. Follow Vercel's DNS instructions (copy two records into your domain registrar)
4. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to your new domain
5. Redeploy

---

## Need help?

Every step above has official documentation:
- Supabase docs: **supabase.com/docs**
- Stripe docs: **stripe.com/docs**
- Vercel docs: **vercel.com/docs**
- GitHub Desktop: **docs.github.com/en/desktop**

If you get stuck on any step, just come back and ask me — describe which step and what error you're seeing.
