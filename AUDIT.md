# ZAKI FX independent audit

Reviewed 11 November 2026: all six supplied desktop screenshots, the public homepage HTML and HTTP headers, and all three existing course destinations and the registration destination. Browser automation was unavailable. This is a redesign of the public marketing experience; accounts, lesson hosting and payment implementation are excluded.

## What works

- Three identifiable offers with upfront prices (£300 / £499 / £599) reduce initial uncertainty.
- Specific curriculum subjects, particularly risk management and psychology, provide a substantive educational foundation.
- A named mentor and direct WhatsApp/email routes make personal contact possible.
- The original markup contains a viewport declaration, skip link, canonical URL, social metadata and HTTPS response. Preserve these useful foundations.
- Existing course product destinations allow the redesign to retain the academy's established purchase route.

## Visible in the six screenshots

1. **Hierarchy and navigation:** An exceptionally tall header devotes little space to readable navigation. The hero combines a generic welcome headline with small, dense text and no visible primary course action. Registration appears before the visitor has understood the offer.
2. **Visual system:** Italic uppercase headings, mismatched text sizes, inconsistent baselines and abrupt white/grey/black changes prevent a coherent identity. Whitespace itself is useful; its unbalanced allocation is the problem. Maintain generous space where it helps grouping and scanning.
3. **Course selection:** Large, nearly identical promotional images outweigh the course information. Prices are useful but suitability, differences and learning focus are not presented together. A separate description section repeats information instead of completing the comparison. There is no visible account of lesson access, duration, prerequisites, support or refund terms.
4. **Content:** A welcome message explains less than a clear educational proposition would. Repeated brand names and acronym lists increase effort. Explain terms such as fair value gaps rather than assume prior understanding. Do not promise trading success.
5. **Mentorship:** The screenshot shows scheduling explicitly unavailable, an owner-account action and extensive empty space. Replace this blocked journey with an honest enquiry route until a working calendar is available. The current live calendar state is unverified.
6. **Broker referrals:** Dense posters, tiny embedded text, generic “click here” labels and repeated headings distract from courses. “Trusted”/“secure and regulated” statements are not substantiated by the supplied evidence. No adjacent affiliate compensation or trading-risk explanation is visible. Avoid blanket regulatory or geographic-availability claims.
7. **Contact:** The required phone number adds effort to an initial question. A tiny submit button is disproportionately weak. There is no visible privacy explanation, delivery expectation or submission feedback in the screenshots.
8. **Credibility:** Luxury imagery is a visual theme, not evidence of teaching quality or trading results. There are no substantiated learner reviews, sample lessons, instructor credentials or outcomes in the supplied material. Do not invent them. Trading signals and personalised support require clear educational boundaries. No risk, privacy, purchase-terms or refund information is visible in the supplied footer.
9. **Accessibility concerns:** Small text and tiny controls are visible. Exact contrast failures, touch-target measurements, keyboard behaviour and mobile layout require measurement; desktop screenshots alone do not establish them.

## Verified through live source / HTTP inspection

- The apex redirects to `https://www.zakifx.com/`, which returned HTTP 200. All three course-product URLs and the unusual `/https/zakifxcom/student-registration` URL returned 200; the unusual path is not proof of a broken link.
- The homepage's meta description is empty. It uses more than one H1, weakening the intended heading hierarchy, although multiple H1s alone do not establish an SEO penalty.
- Meaningful course and broker promotional images have empty alternative text. Decorative backgrounds can legitimately use empty alt text; informative images need equivalent accessible content.
- Source confirms the prices, curriculum, instructor experience claim, contact details and outbound product/referral destinations used in the redesign.
- The existing scheduling integration loads Acuity. Its browser rendering and booking completion have not been tested.
- HTTP headers include HSTS and `X-Content-Type-Options`. No security defect has been established.

## Not verified

Core Web Vitals, real-user loading speed, rendered mobile layout, keyboard/focus behaviour on the original site, cart/checkout completion, registration completion, form delivery, current scheduling availability, broker suitability, geographic eligibility and actual purchase/refund/access policies. These require browser testing and/or business confirmation. Source size and third-party scripts alone do not prove poor performance.

## Priorities and disposition

**First:** Put a clear educational proposition and course action above the fold. Combine suitability, price and curriculum. Restore mentorship contact. Show plain-language trading risk and referral context.

**Next:** Establish a consistent responsive grid and type system, semantic navigation, accessible controls, self-hosted lightweight assets, meaningful metadata and a clear contact handoff.

**Retain:** The three offers and prices, verified subject matter, personal mentorship, the existing contact and product destinations, and the emphasis on risk management.

**Redesign:** Information architecture, brand expression, course comparison/details, mentor presentation, FAQs, broker referrals, enquiry experience and footer.

**Remove:** The unavailable scheduler, repeated pitches, oversized broker posters, unsupported prestige/success claims and navigation into out-of-scope student functionality.

## Proposed visual direction

An editorial academy in warm ivory and deep ink, with copper accents, generous upright typography and carefully drawn educational charts. The chart is explicitly illustrative, not a live feed or performance claim. Pair a clear course grid with a quieter mentor section, explain the learning process, then handle questions and contact. Broker referrals are subordinate to education. Existing academy desk artwork is reused as artwork, without passing an unverified synthetic portrait off as an authentic instructor photo.

## Implementation boundaries

The redesign links to existing hosted course pages. The enquiry form prepares a mailto draft and explicitly requires the visitor to send it; it does not claim to deliver or store messages. WhatsApp uses the verified academy number. No accounts, learning dashboard, custom checkout, invented testimonials, promised returns or unverified accreditation are added. Before replacing the client's domain, confirm current prices, course delivery/access/refund terms, privacy requirements and the academy's affiliate arrangements.
