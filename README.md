# 11ty Demo Shop

Static Eleventy (11ty) storefront for GTM / GA4 training scenarios.

## Features

- Home page with 6 products
- Product detail pages at `/products/{id}/`
- Cart modal (no separate cart page)
- Cart persisted in `localStorage`
- Fake checkout (`Promise` + `setTimeout(500ms)`) redirecting to `/success/`
- GTM container snippet (configurable ID)

## Project structure

```
src/
  _data/products.json
  _includes/
    layouts/base.njk
    partials/header.njk
    partials/cart-modal.njk
  index.njk
  products/
    product.njk
  success.njk
  assets/
    main.js
    styles.css
    products/ (6 images)
```

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Formatting

```bash
npm run format
npm run format:check
```

## GTM config

Set your GTM container ID in `src/_data/site.json`:

```json
{
  "gtmId": "GTM-XXXXXXX"
}
```
