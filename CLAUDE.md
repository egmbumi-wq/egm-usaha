# EGM Usaha Website

Static company website for EGM Usaha (Miri, Sarawak, Malaysia), a provider of fire & lifesaving systems, construction & engineering, energy & safety systems, and logistics, marine & trading across Sarawak, Sabah, Brunei and Indonesia.

Live at https://egmusaha.com

## How to run
No build step, no frameworks. Plain HTML, CSS and JavaScript. Open index.html in a browser, or use VS Code Live Server.

## Structure
- index.html: one-page homepage (hero, about, our business, coverage, contact, footer). The About section holds the intro, "What We Do" / "Local Roots, Regional Reach" blocks and the industry icons. There is no separate About page any more.
- pages/construction.html, safety-system.html, marine.html: one page per business
- css/style.css: the single stylesheet shared by every page
- js/script.js: hero slideshow, contact form (sends via Web3Forms), Leaflet coverage map, active nav link, header shadow, business card toggles, mobile menu
- images/: logo, photos, favicon.png (square flame icon) and og-image.png (1200x630 link preview)
- CNAME: contains `egmusaha.com`. Never delete it, or the domain stops working.

## Conventions
- Pages inside pages/ use ../ paths (e.g. ../css/style.css, ../images/...). Links between business pages have no `pages/` prefix (e.g. `marine.html`).
- Header, nav and footer are copied into every page. When you change one, update index.html and all files in pages/.
- The nav has an "Our Business" dropdown (`.has-dropdown` / `.dropdown`) listing the 3 business pages. On business pages, "Our Business" keeps `class="active"`.
- CSS and JS links use ?v=N for cache-busting. Bump the number on every page after editing style.css or script.js.
- Brand colours: green #1d4a2c, red #c8202b (CSS variables --green, --red)
- Fonts: Montserrat (headings), Open Sans (body), from Google Fonts
- Icons: Font Awesome 6.5.1 from cdnjs
- SEO: every page has its own `<title>` and meta description. index.html also has Open Graph tags (og:image must be a full https:// URL) and a favicon link.

## Contact details (keep these consistent everywhere)
- Nigel Goh, Business Development Executive (named in the homepage contact section)
- admin@egmusaha.com | +60 17-217 9899
- Lot 2911, Boulevard Commercial Centre, 98000 Miri, Sarawak, Malaysia
- Footer company name: EGM Usaha Sdn. Bhd. (202201047063 / 1492760-U)

## Contact form
- Uses Web3Forms. Enquiries go to the inbox linked to the hidden `access_key` in index.html, which should be a key created for admin@egmusaha.com.
- To change the inbox: create a new key at web3forms.com with the new email and replace the `access_key` value.

## Hosting and domain
- GitHub Pages, built from the `main` branch (root) of github.com/egmbumi-wq/egm-usaha. Pushing to main updates the site in 1-2 minutes.
- The "Protect main" ruleset blocks deleting main and force pushes.
- DNS is managed in cPanel → Zone Editor (hosting bought through Shinjiru; nameservers ns1/ns2.awedns.com).
  - egmusaha.com: A records to GitHub (185.199.108.153, .109.153, .110.153, .111.153)
  - www: CNAME to the GitHub Pages account
- Email stays on the hosting server (101.99.77.142) via mail.egmusaha.com. Don't change the mail, MX, SRV, SPF/DKIM/DMARC TXT or cpanel/webmail records.
- cPanel login: through Shinjiru → Login to cPanel, or https://cpanel.egmusaha.com
- Google Search Console is verified with a google-site-verification TXT record. Keep that record.

## Preferences
- Keep it simple: no frameworks or build tools unless I ask
- Make sure every change works on mobile
- I like to make code changes myself: give exact file, line, old text and new text
- Don't commit or push unless I ask
