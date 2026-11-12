# ZAKI FX — public academy website

React 19, TypeScript, Vite and Tailwind 4. The build prerenders the homepage and all three programme pages into `dist/`, so public copy, curricula and native disclosures are available before JavaScript.

## Development

Requires Node.js 22. Install dependencies with `npm ci`, then run the commands below from this repository root.

- `npm run dev` — local development (default port 5173).
- `npm run check` — TypeScript.
- `npm test` — programme/enrolment journeys, motion behaviour and chart-study data invariants.
- `npm run build` — type check, client build and four prerendered routes.
- `npm run check:static` — verify built routes, anchors, assets and accessibility metadata.
- `npm run preview` — serve the production build locally.

## Design and interactions

Warm ivory, forest green and muted bronze, with self-hosted Manrope typography. Zaki's supplied portrait appears once on the homepage. The approach section is a chart lesson, with candle-anchored swing labels, a structure-break line, a retest zone and an example 2:1 position drawing. Drawings share the chart's pan/zoom transform. All market prices are constructed teaching data, shown with hindsight, not live quotes or trade recommendations.

Desktop scrolling develops the chart lesson. Phones and reduced-motion settings use direct chapter controls without scroll pinning. Reveals enhance already-visible markup. The chart has keyboard controls, an accessible data table and an SVG fallback.

Programme details remain on this site. Enrol buttons open a native dialog with the selected programme and listed price. Enquiry forms validate locally and prepare an email draft; visitors must send it in their email app. No message-delivery service, payments, accounts, student dashboard, video hosting, tracking or database is included.

## Business information

Listed prices are £300, £499 and £599 GBP. Subjects, contact details, referral destinations and the over-six-years trading-experience statement came from the supplied screenshots and existing academy pages inspected in November 2026. Exact lesson counts, access periods, session allocations and refund policies were not supplied and have not been invented. Payment frequency and terms must be confirmed with the academy (the original advanced/mentorship products expose subscription options).

The independent original-site audit is in [AUDIT.md](AUDIT.md). The existing zakifx.com domain has not been changed.

## Vercel deployment

Import this GitHub repository into Vercel with the root directory left at `.`. The committed `vercel.json` selects Vite, installs with `npm ci`, builds with `npm run build` and serves `dist/`. Node.js 22 is declared in `package.json`.

The build emits real HTML files for the homepage and all three `/programmes/.../` routes, so direct course links and refreshes work without a catch-all SPA rewrite. URL cleanup and trailing slashes are configured in `vercel.json`.

Canonical and social URLs use `SITE_URL` when provided, otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, with `https://www.zakifx.com` as the local fallback. Set `SITE_URL` to the approved public domain if needed. For local production builds, copy `.env.example` to `.env.local` and edit the origin. No credentials are required for the website build.

## Assets and references

- Authentic portrait: supplied by the user as `public/assets/image.png`; `zaki-portrait.webp` is an optimised copy.
- Manrope and IBM Plex Mono: self-hosted SIL Open Font License assets; licences accompany the fonts.
- Interactive candlestick component: Isaiah Bjork's component supplied by the user through 21st.dev; support files from [the author's registry](https://ui.isaiahbjork.com/candlestick-chart.json). Academy-specific data and drawings are in `src/lib/market-study.ts` and `src/components/ui/candlestick-chart-utils/drawings.ts`.
- Chart conventions checked against [TradingView's position-tool documentation](https://www.tradingview.com/support/solutions/43000517002-long-position-drawing-tool/) and [OANDA's explanation of market structure](https://ftmo.oanda.com/blog/how-to-read-market-structure-and-price-action-patterns/).

## Verification

Automated checks cover all programme routes, matching enquiry prices, form validation, email encoding, stale-draft reset, readable prerendered content, one portrait, reduced-motion behaviour, scroll chapter state and internally consistent chart annotations. Browser review includes the desktop hero/chart, a 375 × 667 phone viewport, the mobile enrolment dialog and Chrome's reduced-motion emulation. This is a website preview, not verification of the academy's educational or financial claims.
