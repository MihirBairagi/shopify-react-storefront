# React Shopify Storefront

A Vite + React storefront that reads products and carts from the Shopify Storefront API and is ready for Vercel deployment.

## Project Structure

- `src/components/common` - reusable page/state components.
- `src/components/layout` - layout-level UI such as the header.
- `src/components/products` - product listing UI.
- `src/context` - cart provider and cart hook.
- `src/hooks` - data-loading hooks for pages.
- `src/services` - Shopify and cart API access.
- `src/utils` - formatting, storage, URL, and validation helpers.

## Environment

Create `.env` locally and configure the same variables in Vercel:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
VITE_SHOPIFY_API_VERSION=2026-07
```

Only use a Shopify Storefront access token in this client app. Shopify Admin API tokens must stay server-side and must never be exposed through `VITE_` variables.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run check
```

## Deployment Notes

The app includes `vercel.json` for client-side route rewrites and conservative security headers. Keep Vercel environment variables in sync with `.env.example` before promoting a deployment.
