# PRD: Arabic Name-Decoration Site (زخرفة اسماء)

**Audience:** our developer (building in Cursor).
**Primary keyword:** زخرفة اسماء. **Target markets:** Algeria (DZ), Egypt (EG), Saudi Arabia (SA), Iraq (IQ), Morocco (MA).
**Languages:** Arabic (primary, RTL) and English (secondary, LTR).
**Research date:** 2026-10-14 (Asia/Karachi, PKT).
**Status:** v1. Built from evidence collected on 2026-10-14.

> **How to read this document**
> - **VERIFIED**: we observed it directly, either in hands-on browser tests or in a scan of the page source. The evidence is cited.
> - **NOT VERIFIED**: we couldn't confirm it. Don't build on it as if it were true.
> - **RECOMMENDATION (ours)** / **[PREMIUM]**: a design choice we're proposing. No competitor evidence backs it.
> - **[MATCH]**: a competitor strength we have to equal at minimum.
> - We didn't copy proprietary competitor text into our UI or content. Competitor strings appear only as quoted evidence. All our UI strings are written fresh. We didn't record any ad, analytics or tag IDs.

---

## ⚠️ Engineering Must-Haves (non-negotiable, set by the site owner)

These rules apply to every part of the build. They override any conflicting suggestion later in this PRD. Sections 6–8 are written to follow them.

| # | Must-have | What it means in practice |
|---|---|---|
| EM-1 | **High-quality, scalable, maintainable code** | Clear module boundaries: decoration engine, UI components, content and pages. No copy-pasted logic. Strict linting and formatting. The engine gets unit tests (6.10). Style definitions are data, so adding a style means one entry plus its test. |
| EM-2 | **Security in mind** | User text is never injected as HTML. Render it as text nodes only, with no `innerHTML`/`dangerouslySetInnerHTML` for user input. Strict Content-Security-Policy and security headers. Sanitize and cap any reflected URL parameter. Dependency audit in CI. No secrets in the repo. If a backend exists: parameterized queries, rate limiting, and validation at every boundary. |
| EM-3 | **Commit after every meaningful change** | Small, focused commits with descriptive messages, for example "engine: add tatweel style with joining-rule guard". Never batch unrelated work into one commit. |
| EM-4 | **Latest stable packages and frameworks** | At project start, pin the then-current **stable** releases (no alpha, beta or RC) of the framework, TypeScript, tooling and libraries. Keep a lockfile. Automate updates (Renovate or Dependabot). |
| EM-5 | **Mobile-friendly web app** | Mobile-first layouts. Touch targets ≥ 44×44 px. **No hover-only controls** (see the openl failure mode in 5.4). Must work well on low-end Android. Installable PWA recommended (6.8). |
| EM-6 | **Inter font for Latin text**, paired with an Arabic font | Inter for Latin UI text. The paired Arabic UI font is an **open question for the owner** (Q-O1). **Decorated outputs must NOT be forced into Inter or the Arabic web font.** Render them in system fonts so the preview matches what users see after pasting (6.6). |
| EM-7 | **TypeScript** | All code is TypeScript in `strict` mode. No `any` in the decoration engine. |
| EM-8 | **Reusable components wherever possible** | One `GeneratorTool` component powers every generator page (home, Arabic, English, each game and social page), configured by props or data. One `ResultCard`, `CopyButton`, `Toast`, `FilterChips` and so on. No per-page forks. |
| EM-9 | **PostgreSQL if a database is required** | The v1 core needs **no database** (Section 7). If a DB is introduced later (accounts, synced favorites, CMS content, collections, telemetry), it must be PostgreSQL (relational). No other engine. |

---

## 0. How this PRD was made (methodology)

### 0.1 SERP collection
- **Goal:** Google top-10 results for `زخرفة اسماء` in 5 countries × 2 interface languages, which is 10 searches (DZ, EG, SA, IQ, MA × `hl=ar` / `hl=en`).
- **First attempt:** a scripted headless-Chrome fetch (`serp/g.py`, params `gl`/`hl`/`pws=0`). **All 10 failed** with a Google CAPTCHA / "unusual traffic" block from the box IP (`serp/serp_raw.csv`).
- **Second collection:** **5 of 10 searches succeeded**: DZ-ar, DZ-en, EG-ar, EG-en, SA-ar. **SA-en, IQ-ar, IQ-en, MA-ar and MA-en were blocked by Google, so there's no data for them.** The source files don't document how the successful collection was made. Only its output exists (`serp/serp_domains.csv`).
- **Result:** 11 unique domains (1.3), including 2 Google Play Store apps and pinterest.com. For Pinterest, only the ranking itself was considered. It wasn't analyzed in depth.
- **Caveat:** Iraq and Morocco rankings are unknown. Assuming they resemble DZ/EG/SA is an assumption, not a fact.

### 0.2 Static source scan
- `curl -sL` with a desktop Chrome user agent, then a BeautifulSoup parse (`prd/an.py`). Raw output is in `prd/raw.txt` and the HTML in `prd/html/`. The summary is `prd/tech_seo.md`.
- Extracted: title, meta description, `lang`/`dir`, hreflang, H1/H2, FAQ presence, approximate word count, internal links, framework signals, third-party script **presence only** (no IDs), and counts of styled Unicode characters in scripts (evidence of client-side decoration).
- An extra pass for this PRD (2026-10-14) pulled JSON-LD `@type`s, canonical tags and viewport from the same saved HTML (Section 7).
- **Limit:** static HTML only. Nothing injected after load (ads, consent banners, lazy chunks) is covered.

### 0.3 Hands-on browser testing (two rounds)
- **Round 1** (`prd/teardown_part1.md`): scripted interaction (`fill()`, selectors). Results were thin: SPA re-renders caused stale locators and timeouts on openl.io and zakhrafa.name, and zakhrafatasmaa.com wasn't reached. **zakhrafaengleezy.com was fully tested in Round 1 only.**
- **Round 2** (`prd/teardown_part2.md`): visual interaction (click into the field, then type). Covered zakhraafatasma, openl, charactercalculator, zakhrafa.name, zakhrafatasmaa, convertpilot, dev-point1 and zakhrfahh.
- **Test battery per site:** `محمد 123` (Arabic + digits), `Ahmed 123` (Latin + digits), `😎🎉` (emoji only), and a ~420–432 character string (length handling). We clicked 2 copy controls and checked feedback before, immediately after, and +400–1500 ms after each click. We also checked live vs. button generation, variant count, labels, extra features, ads (element counts only), login/paywall and sibling navigation.
- **Conflict resolved:** Round 1 recorded zakhraafatasma.com as "button click required". In Round 2 we typed without clicking, waited 2.5 s, and the results updated. **We go with Round 2: live (debounced) generation plus an optional button.**

### 0.4 What couldn't be tested
- SERPs for SA-en, IQ (ar/en) and MA (ar/en), because Google blocked them.
- **Mobile viewports.** Every test used a desktop viewport, so mobile feel is NOT VERIFIED for every site.
- Page speed and Core Web Vitals, and network calls per keystroke (no network capture).
- Actual clipboard contents after copy. The visual feedback was verified, the pasted string wasn't.
- Whether decorated names are actually accepted by PUBG, Free Fire, Instagram, TikTok and so on. Competitor "accepted everywhere" claims are untested.
- Exact ad slot positions (only element counts were taken).
- Competitor inner hub pages (game and social pages). We saw the links but didn't test the pages, except zakhrfahh `/arabic` and `/english`.
- The Play Store apps (listing metadata only) and Pinterest (not analyzed).
- zakhrafaengleezy.com in Round 2.

---

## 1. Project overview

### 1.1 What we're building
A free, no-sign-up, Arabic-first web app. A user types a name (Arabic, English, mixed, with digits or emoji) and instantly gets a large, organized, **labeled** set of decorated versions. One tap copies a result with unmistakable confirmation, and they paste it into a game nickname, social profile or chat. Around the core generator we add platform hubs (games, social), a symbol picker, invisible characters, ready-made name collections, a build-your-own decoration keyboard and SEO content. There's a full Arabic site plus an English edition.

### 1.2 User intent
1. **"Decorate my name, now."** Type, see results instantly, copy. Every tested web tool is free and works without sign-up (VERIFIED).
2. **For a specific destination.** Games (PUBG, Free Fire, Roblox and others) and social apps (Instagram, TikTok, WhatsApp, Facebook) dominate competitor titles, descriptions and hub links (VERIFIED, `tech_seo.md`).
3. **Arabic and English names.** Top sites advertise both (titles of zakhraafatasma, zakhrafatasmaa and convertpilot).
4. **Confidence that it worked:** that the copy succeeded and the result won't show as boxes (□). zakhraafatasma has a section on why boxes appear and how to fix it (VERIFIED H2), so this is a known concern. Our *interpretation*: users need reassurance.
5. **Browsing for inspiration:** ready-made names, symbols and categories (zakhrafa.name "latest decorations", convertpilot ready names, zakhraafatasma collections). Pinterest ranking also hints at visual inspiration intent (inference).

### 1.3 Competitive landscape (5 SERPs, single snapshot 2026-10-14)
| Domain | Best rank | Seen in | Type |
|---|---|---|---|
| zakhraafatasma.com | **1** | all 5 | Arabic-first multi-hub site |
| openl.io (`/ar/fancy-text-generator`) | 2 | all 5 | Large multi-tool / translation platform |
| charactercalculator.com (`/ar/font-changer/`) | 2 | all 5 | Text-utility site |
| convertpilot.net (`/ar/tools/text/name-decorator-pro`) | 3 | EG-ar, EG-en, SA-ar | Multi-tool site |
| zakhrafa.name | 4 | DZ-ar, DZ-en | Arabic name-decoration site |
| play.google.com (com.venox.cool_symbols) | 5 | all 5 | Android app |
| zakhrafaengleezy.com | 5 | all 5 | English-letter decorator (WordPress) |
| zakhrafatasmaa.com | 6 | DZ-ar, DZ-en, SA-ar | Arabic name decorator (WordPress) |
| dev-point1.01.ma | 7 | EG-ar, EG-en | Arabic decorator with server-rendered result URLs |
| pinterest.com | 8 | DZ-ar, DZ-en | Not analyzed |
| zakhrfahh.com | 8 | SA-ar | Hub + per-category tool pages |

The Play Store listing of a second app (com.jorabox.fancynamegenerator) was also scanned (`tech_seo.md`).

### 1.4 Success criteria (RECOMMENDATION; owner to confirm)
- Parity with every [MATCH] item in Sections 3–4 at launch.
- Copy confirmation visible in **under 100 ms** on every copy action. Competitors took ~400–600 ms (VERIFIED), and two were silent.
- Arabic, Latin, mixed and emoji input all produce results on every generator page.
- Lighthouse mobile Performance and Accessibility ≥ 90 on generator pages. These are our targets. Competitor speed is NOT VERIFIED.

---

## 2. Verified mechanism (confirmed facts only)

1. **Decoration is Unicode text, not images or fonts.** We observed these outputs:
   - **Mathematical Alphanumeric Symbols** for Latin letters and digits: `𝓐𝔂𝓪𝓪𝓷`, `𝕬𝖍𝖒𝖊𝖉`, `𝐀𝐡𝐦𝐞𝐝`, `𝟭𝟮𝟯`. charactercalculator's bundle contains 732 characters from U+1D400–1D7FF, and zakhrafa.name's contains 525 (static scan).
   - **Symbol frames and wrappers:** `꧁༒ محمد 123 ༒꧀`, `★彡[ محمد 𝟭𝟮𝟯 ]彡★`, `『 محمد 』`.
   - **Arabic tatweel (kashida, U+0640):** `مـــحـــمـــد` (convertpilot). Labels such as `تطويل` (zakhraafatasma) and `مدّ وتطويل` (zakhrfahh).
   - **Combining marks:** `a̯͡h̯͡m̯͡e̯͡d̯͡`, `(̲̅a̲̅)(̲̅h̲̅)…` (dev-point1). Labels such as `تشكيل سفلي`, `خط تحت الحروف`, `خط وسط الحروف` (zakhrfahh) and `Glitch (Zalgo)` (openl).
   - **Letter-substitution sets:** small caps, upside-down, circled/squared, full-width, runic/Cherokee look-alikes, leet (charactercalculator and openl labels).
   - **Symbols inserted between letters:** hearts, stars, flowers (zakhrfahh labels `قلوب في الحروف`, `نجوم بين الحروف`, `ورود بين الحروف`).
   - **"Gamer" templates** combining prefix and suffix symbols with styled letters: `Sᴋ᭄محمد 123ᴮᴼˢˢ亗` (zakhrafatasmaa).
2. **Arabic letters stay standard Arabic code points** in every Arabic output we saw. Decoration comes from tatweel, marks, inserted symbols and frames. Digits in the same string may be math-styled (`محمد 𝟭𝟮𝟯`). Seen at zakhraafatasma, zakhrafatasmaa, convertpilot and zakhrfahh.
3. **Generation is client-side at most sites.** Evidence is strong for charactercalculator, zakhrafa.name and zakhrafatasmaa (style tables plus clipboard code in shipped JS), moderate for zakhrafaengleezy, and only "likely" for convertpilot. It's NOT VERIFIED for openl, zakhraafatasma and zakhrfahh. **dev-point1 is the exception:** its landing form navigates to the result URL `/زخرفة_{input}` (browser-verified), and edits on that page update live afterward.
4. **Copy writes the decorated string to the clipboard.** It's triggered by a button or by clicking the card. Clipboard code is present at charactercalculator, zakhrafa.name, zakhrafatasmaa and zakhraafatasma. Byte-exact pasted output is NOT VERIFIED.
5. **Style sets can depend on script.** convertpilot gives 126 variants for Arabic input and 48 for Latin or emoji. zakhrfahh `/arabic` shows `لا توجد نتائج` for Latin or emoji. zakhrafaengleezy rejects Arabic (Round 1).
6. **Unicode reference facts** (from the standard, not competitor observations): U+1D400–1D7FF has no Arabic letters. A separate Arabic Mathematical Alphabetic Symbols block (U+1EE00–1EEFF) exists, but how well target apps and fonts render it is NOT VERIFIED. Tatweel connects visually only after dual-joining letters. After right-joining-only letters (ا د ذ ر ز و) and after ء/ة it appears as a detached line.

---

## 3. Common features ([MATCH], written once)

| # | Feature | Who has it (VERIFIED) |
|---|---|---|
| C-1 | Free, no login needed to use the tool | All tested sites. openl and zakhrafa.name show *optional* login. |
| C-2 | RTL Arabic UI (`lang="ar"`, `dir="rtl"`) | All 9 web sites |
| C-3 | Single input with an Arabic "type your name" placeholder | All except openl (English placeholder) |
| C-4 | **Live update while typing** | zakhraafatasma (debounced ~1–2 s), openl, charactercalculator, zakhrafa.name, zakhrafatasmaa, zakhrafaengleezy, convertpilot, zakhrfahh (~0.9 s). dev-point1 is live only after the first submit. |
| C-5 | Many variants at once (27–813) | All (table 4.0) |
| C-6 | One-click copy per variant | All |
| C-7 | Emoji input survives | All tested, except zakhrfahh `/arabic` |
| C-8 | No input length cap (≥ 420 chars accepted) | All except zakhrafa.name (`maxlength=100`, silent truncation) |
| C-9 | Category or filter tabs | zakhrafa.name (5), zakhrafatasmaa (36), convertpilot (pills), zakhrfahh (4). zakhraafatasma uses category tags on cards. |
| C-10 | Theme toggle (dark/light) | zakhraafatasma, charactercalculator, zakhrafa.name, convertpilot. zakhrafatasmaa has 8 color themes. |
| C-11 | Internal links to platform pages (PUBG, Free Fire, Instagram, TikTok…) | zakhraafatasma, zakhrafa.name, zakhrafaengleezy, dev-point1, zakhrfahh |
| C-12 | Long SEO content below the tool (what / how / where / FAQ) | zakhraafatasma, openl, zakhrafatasmaa, convertpilot, zakhrfahh. Thin at dev-point1 (~136 words) and charactercalculator (~470). |
| C-13 | Footer legal pages | zakhraafatasma, charactercalculator, zakhrafatasmaa, convertpilot, zakhrfahh |
| C-14 | Ads | zakhraafatasma, openl, charactercalculator, zakhrafaengleezy, convertpilot (heavy), dev-point1, zakhrfahh (light). **None** at zakhrafa.name or zakhrafatasmaa. |

---

## 4. Per-site unique features (attributed)

### 4.0 Comparison snapshot (VERIFIED, Round 2 unless noted)
| Site | Live? | Variants (محمد 123 / Ahmed 123) | Labeled? | Copy feedback | Max length |
|---|---|---|---|---|---|
| zakhraafatasma | Live, debounced ~1–2 s, + optional button | 60 / 54 | Yes (pattern + category tag) | Button → `تم النسخ` + status naming the pattern, ~400 ms delay | None |
| openl | Live | 156 (50 + load more) / 156 | Yes (English names) | Button → `تم النسخ` (≤ 600 ms). **Hover-revealed buttons.** | None |
| charactercalculator | Live | 60 / 60 (fixed) | Yes (Arabic h2, repeated labels) | Icon button swap + tooltip `تم النسخ!` | None |
| zakhrafa.name | Live | 1 main + 26 "all styles" + category previews | Yes | Separate message `تم النسخ بنجاح` | **100 (silent truncation)** |
| zakhrafatasmaa | Live | 813 / 813 | **No** | **Silent** | None |
| zakhrafaengleezy (R1) | Live | **0 (Arabic rejected)** / 182 | **No** (182 identical "نسخ") | **Silent** | None |
| convertpilot | Live | 126 / 48 | Yes (visible + aria) | Card turns green + `تم النسخ إلى الحافظة!` + status | None |
| dev-point1 | Button on landing, then live | 99 | **No** | `role=status` `تم النسخ ✓` | None |
| zakhrfahh | Live ~0.9 s | 27 (`/arabic`) / 39 (`/english`) | Yes, + result counter | Copy icon → check icon only | None |

### 4.1 zakhraafatasma.com (rank 1 in all 5 SERPs, the primary benchmark)
- **Demo name pre-filled** on load, so results show before the user types.
- Each result **is labeled with a pattern name plus a usage tag** (games / social).
- **Copy feedback names the pattern** in a status message, and the button text also changes.
- **Per-variant favorites (☆).** A **"copy all patterns"** button. An **"insert a symbol into your name"** button. **Site search.** Dark/light toggle.
- **Richest hub structure.** Header: Generator, Games, Social, Fonts, Symbols, Collections, Tools, Blog. Footer: name generator, game names, social, fancy fonts, usernames, PUBG, Free Fire, symbol picker, invisible characters, emoji, ready collections, text tools, guides, FAQ, about, privacy, terms, contact. Static scan also found Roblox, Valorant, Minecraft, clans, Instagram, TikTok and WhatsApp pages.
- **Content depth:** ~2,159 words. H2s include what/how/why/where it works, **why boxes appear and how to fix it**, tips, features, FAQ and about. JSON-LD: FAQPage (14 Q&As), SoftwareApplication, WebPage, Organization. Uses the Cairo web font. hreflang `ar` + `x-default`.
- **Weakness to avoid:** an Etsy product carousel **inside the results area between variant cards**, and 37 iframes.

### 4.2 openl.io
- **Largest labeled set:** 156 styles, including Zalgo, Braille, Barcode, Vaporwave, Upside-down, Backwards, Currency, Hieroglyphs and Neon Sign.
- Progressive loading (50, then load more). **Share row:** X, Facebook, WhatsApp, copy page link. Breadcrumbs.
- Large related-tool network: symbols, invisible character, Instagram and cursive fonts, text divider, rune converter, keyboards. ~28 hreflang locales.
- **Weaknesses:** English placeholder and English style names on the Arabic page. **Copy buttons only appear on hover**, which is risky on touch devices (mobile NOT VERIFIED). Ad between the input and the results. Login and upgrade prompts in the header.

### 4.3 charactercalculator.com
- A fixed set of **60 labeled cards** with Arabic labels.
- Copy is an **icon-button state swap plus a tooltip** (`تم النسخ!`), also exposed through `aria-label`.
- Settings with a theme toggle. Hamburger drawer. Sibling utilities: invisible character, word counter, text repeater, numbers-to-words, abjad calculator, Morse, binary, alphabetizer. 24 locales.
- **Weaknesses:** labels repeat (one label appears 4×). Every card label is an `<h2>`, which dilutes the heading outline. Thin content (~470 words, 3 FAQs).

### 4.4 zakhrafa.name
- **"Primary result" UX:** one big result with a main copy button, plus "show all styles" and "clear".
- **5 category tabs:** English fonts, Arabic decorations, side decoration, rare decoration (paginated 1–6), symbols and frames.
- **A one-click symbol palette of ~130 symbols** that insert into the name. This is the strongest symbol tool we saw.
- **Zero ads.** Optional account. "Decorate by platform" links: Free Fire, PUBG, TikTok, Instagram, Facebook, Roblox, English, Arabic, bio, bold letters, Discord. A "latest decorations" content feed.
- **Weaknesses:** **`maxlength=100` silently truncates input.** No canonical tag. No hreflang. `/?p=N` links.

### 4.5 zakhrafatasmaa.com
- **Volume:** 813 variants and **36 mood/theme filters** (best, FF + PUBG, love, sad, cute, anime, weapons, birthday…).
- In-tool **Arabic/English toggle**. **8 color themes.**
- **"Decoration keyboard" (build your own)** with its own input and copy, backspace and clear buttons.
- Zero ads.
- **Weaknesses:** **no labels**, **completely silent copy**, no H1, no sibling tool pages.

### 4.6 zakhrafaengleezy.com (Round 1 only)
- A dedicated English-letters decorator: 182 variants for Latin input, 135 for emoji.
- **Critical weaknesses:** **rejects Arabic input** with a warning, on an Arabic-language page (0 results). 182 identical unlabeled `نسخ` buttons. **Silent copy.** No H1. 6 ad iframes. AdSense, Ezoic and a consent manager detected.

### 4.7 convertpilot.net
- **Script-aware style sets:** 126 for Arabic, 48 for Latin.
- **Labels are both visible and in aria** (`نسخ زخرفة <style>`).
- **Best copy feedback we observed:** the card turns green, with inline text and a status message.
- **The placeholder suggests example names.** Filter pills plus "back to top". A **ready-made decorated names** section, plus "plain vs decorated", "works on all devices" and "important notes" sections.
- Tool search with a keyboard shortcut, language switcher, theme toggle, donation link.
- JSON-LD: FAQPage, BreadcrumbList, Organization, UseAction. hreflang in 7 languages + x-default.
- **Weaknesses:** the heaviest ads (10 ad units, 11 iframes). **Tatweel inserted between digits** (`1ـــ2ـــ3`), which is an Arabic-correctness bug (6.7).

### 4.8 dev-point1.01.ma
- **Shareable, indexable result URLs** `/زخرفة_{name}`, each with its own H1 and title.
- **Per-letter and per-digit pages.** Islamic decorations, "Facebook-accepted" decorations, a "decorate it yourself" page, romantic decorations.
- Accessible copy status `تم النسخ ✓` in `role="status"`.
- **Weaknesses:** a page navigation is needed for the first result. Unlabeled textboxes. Thin landing page (~136 words). Ads labeled `إعلان`.

### 4.9 zakhrfahh.com
- **Hub homepage without a tool**, with dedicated tool pages: `/arabic`, `/english`, `/pubg`, `/freefire`, `/letters`, `/text`.
- **Live result counter** ("N results – tap to copy"). Filter tabs (All, Fonts, Frames, Games). A 3-step how-to. A 7-question FAQ accordion with FAQPage schema. Light ads.
- **Weaknesses:** `/arabic` rejects Latin and emoji. The only copy feedback is an icon change. The homepage needs an extra click to reach a tool.

### 4.10 Play Store apps (listing data only, not tested)
- **Stylish Text & Characters** (Ozte, com.venox.cool_symbols): 4.0★, 4,619 ratings, 1M+ installs. **A floating bubble over other apps and a text-selection context menu**, so users decorate without leaving the app they're in.
- **زخرفة الاسماء باحترافية** (Jorabox, com.jorabox.fancynamegenerator): 4.1★, 371 ratings, 100K+ installs. Arabic and English styles and symbols, with copy/share.
- What this means for us (inference): some users want app-like convenience. Our answer is a PWA plus Web Share Target (6.8, [PREMIUM]).

### 4.11 pinterest.com
Ranks #8 in DZ-ar and DZ-en. Only the ranking was considered. Not analyzed.

---

## 5. Complete user interaction

### 5.1 Primary flow: decorate and copy (every generator page)
1. **Land.** Results are already visible using a sample name [MATCH zakhraafatasma, zakhrfahh, convertpilot]. The input shows only a placeholder, with no pre-filled value the user must delete [PREMIUM, our recommendation].
2. **Tap the input.** On mobile the keyboard opens, and the input plus the first 1–2 result cards stay in view.
3. **Type.** Results update on every keystroke, within one frame, with no artificial debounce up to 100 graphemes [PREMIUM; beats zakhraafatasma's ~1–2 s and zakhrfahh's ~0.9 s]. IME composition is respected.
4. **Scan.** Category chips, platform selector, favorites filter, result counter.
5. **Copy.** Tap the card or its button. Feedback is **instant (< 100 ms)**: the card highlights, the button reads "copied", and a toast names the style. On Android a short haptic tick where supported [PREMIUM].
6. **Optional:** favorite, share, copy all, insert a symbol, open in the decoration keyboard.

### 5.2 Secondary flows
- **Platform flow:** Home → Games hub → PUBG page. The same tool, with styles reordered and pre-filtered for that platform, plus platform tips. A character counter shows the platform limit only once that limit is verified (Q-D3).
- **Symbols flow:** the symbols page, or the "insert symbol" sheet inside the tool. Tapping a symbol inserts it at the caret [MATCH zakhrafa.name palette, zakhraafatasma insert].
- **Build-your-own flow:** the decoration keyboard, to compose with symbols, frames and letters, with backspace, clear and copy [MATCH zakhrafatasmaa].
- **Invisible character flow:** one-tap copy of blank characters [MATCH zakhraafatasma, openl, charactercalculator].
- **Ready names flow:** browse curated names (boys, girls, gamer, clan), tap to copy, or "apply this style to my name" [MATCH convertpilot, zakhraafatasma, dev-point1; the "apply" part is PREMIUM].
- **Share flow:** share the decorated name with a link that re-renders it [MATCH dev-point1 URLs, openl share row].
- **Return visit:** the last-typed name and favorites are restored from localStorage [PREMIUM].

### 5.3 Comfort notes
- **Never reject input.** Mixed scripts, digits and emoji always produce results. A style that can't apply passes characters through or hides itself. The page is never empty.
- Every result has a clear human label in the page's language.
- The input stays sticky while scrolling results [PREMIUM].
- Clear (×) button inside the input. Counter visible.
- Nothing blocks the tool: no interstitials, no pop-ups, and no inserts between the input and the first results or inside the results grid [PREMIUM; owner confirms in Q-O3].

### 5.4 Competitor failure modes to avoid (each VERIFIED)
| Failure | Where seen | Our rule |
|---|---|---|
| **No copy feedback at all** | zakhrafatasmaa (cards + keyboard), zakhrafaengleezy (182 buttons) | Every copy shows visual feedback plus an aria-live announcement in < 100 ms |
| Delayed feedback (~400–600 ms) | zakhraafatasma, openl | Optimistic instant feedback. Switch to an error state if the write fails. |
| Icon-only feedback | zakhrfahh | Text + icon + toast |
| **Arabic input rejected on an English-only page** | zakhrafaengleezy | Every generator accepts all scripts. The English page still decorates Arabic (frames, symbols, tatweel) and shows a hint chip linking to the Arabic styles. |
| Latin and emoji rejected on the Arabic page | zakhrfahh `/arabic` | Same rule in reverse |
| **Silent truncation at 100 chars** | zakhrafa.name | No silent truncation. Visible counter. Soft warning at platform limits. Hard cap at 500 with a visible message. |
| Unlabeled results | zakhrafatasmaa, zakhrafaengleezy, dev-point1 | Every card is labeled |
| Duplicate labels | charactercalculator | Labels are unique per page |
| Hover-only copy buttons | openl | The copy affordance is always visible, and the whole card is tappable |
| English placeholder and labels on the Arabic page | openl | Fully localized UI per locale |
| Commerce or ad blocks in or above the results | zakhraafatasma (Etsy carousel), openl (ad above results) | No inserts in the results grid (Q-O3) |
| Tatweel between digits | convertpilot `1ـــ2ـــ3` | Joining-aware tatweel engine (6.7) |
| Homepage without a tool | zakhrfahh | Tool above the fold on the homepage |
| Missing H1 | zakhrafatasmaa, zakhrafaengleezy | Exactly one H1 per page |
| Page navigation to get results | dev-point1 landing | Instant client-side results. URL updates without a reload. |

---

## 6. Frontend specification

> Tags: **[MATCH]** means a competitor has it, so we equal or beat it. **[PREMIUM]** is our recommendation, with no competitor evidence. Engineering Must-Haves EM-1 to EM-9 apply throughout: TypeScript strict, reusable components, mobile-first, Inter for Latin UI plus an Arabic font (TBD), latest stable framework, security headers, small commits.

### 6.1 Page inventory
The slug language (Latin or Arabic) is an owner decision (Q-O4). Latin slugs below are placeholders. The English edition lives under `/en/` with mirrored pages.

| # | Arabic page | English equivalent | Purpose | Tag | Competitor reference |
|---|---|---|---|---|---|
| P1 | `/` Home: main generator (all scripts) | `/en/` | Primary keyword, tool above the fold | MATCH | all |
| P2 | `/arabic` Arabic name decoration | `/en/arabic-name-styles` | Arabic-first ordering | MATCH | zakhrfahh, zakhrafa.name, zakhraafatasma |
| P3 | `/english` English name decoration | `/en/fancy-name-generator` | Latin-first ordering, **still accepts Arabic** | MATCH + fix | zakhrafaengleezy, charactercalculator, openl, zakhrfahh |
| P4 | `/games` Games hub | `/en/games` | Hub + game-ordered tool | MATCH | zakhraafatasma, zakhrafa.name |
| P4.x | `/games/pubg`, `/games/free-fire`, `/games/roblox`, `/games/valorant`, `/games/minecraft`, `/games/clans` | mirrored | Same `GeneratorTool` with a platform preset | MATCH | zakhraafatasma (all 6), zakhrafa.name (FF, PUBG, Roblox), zakhrfahh (PUBG, FF), dev-point1, zakhrafaengleezy |
| P5 | `/social` Social hub | `/en/social` | Hub + tool | MATCH | zakhraafatasma |
| P5.x | `/social/instagram`, `/tiktok`, `/whatsapp`, `/facebook`, `/discord`, `/telegram`, `/bio` | mirrored | Platform preset | MATCH | zakhraafatasma (IG, TikTok, WA), zakhrafa.name (TikTok, IG, FB, Discord, bio; Telegram in its content feed), zakhrafaengleezy (FB, IG, TikTok), dev-point1 (FB) |
| P6 | `/symbols` Symbol picker | `/en/symbols` | Searchable categorized symbols, copy or insert | MATCH (beat) | zakhrafa.name, zakhraafatasma, openl, dev-point1 |
| P7 | `/invisible-characters` | `/en/invisible-characters` | Copy blank characters, with explanations | MATCH | zakhraafatasma, openl, charactercalculator |
| P8 | `/emoji` Emoji for names | `/en/emoji` | Curated emoji | MATCH | zakhraafatasma |
| P9 | `/fonts` Fancy fonts (bold, italic, script…) | `/en/fonts` | Latin font styles | MATCH | zakhraafatasma, openl, charactercalculator |
| P10 | `/letters` + `/letters/{letter}` | `/en/letters` | Single-letter and digit decorations | MATCH | dev-point1, zakhrfahh |
| P11 | `/text` Sentences and text decoration | `/en/text` | Multi-line text | MATCH | zakhrfahh |
| P12 | `/keyboard` Decoration keyboard | `/en/keyboard` | Build your own | MATCH | zakhrafatasmaa |
| P13 | `/names` Ready decorated names (boys, girls, gamer, clan) | `/en/names` | Browse and copy | MATCH | convertpilot, zakhraafatasma, dev-point1 |
| P14 | `/usernames` Username ideas | `/en/usernames` | Ideas + decorate | MATCH | zakhraafatasma, convertpilot |
| P15 | `/islamic` Islamic decorations | `/en/islamic` | Respectful frames and symbols | MATCH | dev-point1 |
| P16 | `/favorites` (local) | `/en/favorites` | Saved styles and names | PREMIUM | extends zakhraafatasma ☆ |
| P17 | `/guides` Guides (including why boxes appear) | `/en/guides` | Support + SEO | MATCH | zakhraafatasma, zakhrafatasmaa, zakhrafaengleezy |
| P18 | `/faq`, `/about`, `/privacy`, `/terms`, `/contact` | mirrored | Trust and legal | MATCH | many |
| P19 | 404 with the tool embedded | mirrored | Recovery | PREMIUM | — |

Share links: `/?name=…` by default, rendered client-side. Whether per-name pages should be indexable (dev-point1 style) is owner question Q-O5.

### 6.2 ASCII wireframe: Home, Arabic, RTL, mobile (~360 px). Read right to left.
```
┌────────────────────────────────────────────────┐
│ EN  ◐  🔍  ☰                       [شعار الموقع] │ ← RTL: logo at the start (right); controls at the end (left)
├────────────────────────────────────────────────┤
│                زخرفة اسماء عربي وإنجليزي         │ ← H1
│     اكتب اسمك وانسخ الزخرفة بلمسة واحدة — مجاناً   │ ← subline
│ ┌────────────────────────────────────────────┐ │
│ │ ✕  ١٢/٥٠٠                 اكتب اسمك هنا…    │ │ ← sticky input; text starts right; clear + counter at left
│ └────────────────────────────────────────────┘ │
│   المنصة: [الكل ▾]     [⌨ لوحة الزخرفة] [✦ إدراج رمز] │
│ ‹ [♡ مفضلتي] [رموز] [إطارات] [ألعاب] [إنجليزي] [عربي] [الأفضل] [الكل] › │ ← chips scroll; first chip at right
│            ١٨٤ نتيجة — اضغط على أي زخرفة لنسخها  │ ← live counter (aria-live)
│ ┌────────────────────────────────────────────┐ │
│ │ عريض فاخر · ألعاب                         ☆ │ │ ← label at start (right), favorite at end
│ │                ꧁ 𝐀𝐡𝐦𝐞𝐝 ꧂                    │ │ ← output: dir=auto, system font, large
│ │ [ ⧉ نسخ ]                          [مشاركة] │ │
│ └────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────┐ │
│ │ تطويل ملكي · تواصل                        ★ │ │
│ │                ♕ أحـــمـــد ♕               │ │
│ │ [ ✓ تم النسخ ]  ← green 2 s                 │ │ ← copied state
│ └────────────────────────────────────────────┘ │
│   … virtualized list (no “load more” click) …   │
│                         [ نسخ كل الزخارف ]      │
├────────────────────────────────────────────────┤
│ زخرفة حسب المنصة: [ببجي] [فري فاير] [روبلوكس] … │ ← hub links
│ ما هي زخرفة الأسماء؟ · كيف تستخدمها · لماذا تظهر مربعات؟ │ ← SEO content (6.9)
│ الأسئلة الشائعة ▾                               │ ← accordion
├────────────────────────────────────────────────┤
│ الأدوات · الألعاب · التواصل · الرموز · الخصوصية · الشروط │ ← footer
└────────────────────────────────────────────────┘
            ╭──────────────────────────────╮
            │ ✓ تم نسخ زخرفة «عريض فاخر»     │ ← toast (role=status), bottom-center
            ╰──────────────────────────────╯
```
- **Tablet and desktop (≥ 768 / ≥ 1024 px):** a 2–3 column card grid. The input stays sticky under the header. Hub links can move to a side rail on the start (right) side.
- **English pages:** the same layout mirrored LTR.

### 6.3 Component specs and states (all reusable, EM-8)
| Component | Inputs / data | States | Behavior |
|---|---|---|---|
| **GeneratorTool** | `preset` (all, arabic, english, pubg…), `sampleName`, `styleOrder`, `filters` | ssr-sample, idle-sample, typing, results, filtered-empty, over-soft-limit, at-hard-cap | One component for every generator page. SSR renders sample results, so there's no empty flash. Never shows an empty page. [MATCH + PREMIUM] |
| **NameInput** | `value`, `softMax` (platform), `hardMax` = 500 | empty (placeholder), focused, filled, composing (IME), over-soft (amber counter + hint), at-hard (red message, visibly blocks extra input), pasted multi-line (→ spaces on name pages, kept on `/text`) | `dir="auto"`, `autocomplete="off"`, `autocapitalize="off"`, `spellcheck="false"`, `enterkeyhint="done"`. The counter counts **grapheme clusters** (`Intl.Segmenter`). Never uses `maxlength` for silent truncation. |
| **ResultCard** | `styleId`, `label`, `category`, `output`, `support` | default, hover (cosmetic, desktop only), focus-visible (2 px ring), pressed, **copied** (green border + ✓ + text for 2 s), copy-error (red, output selected for manual copy), favorited, unsupported-glyph (dimmed/flagged, 6.6) | The whole card is a tap target. Accessible name: "نسخ زخرفة {label}". The output is in a `<bdi dir="auto">` with the system font stack. Minimum height 64 px. [MATCH convertpilot + PREMIUM] |
| **CopyButton** | `text`, `label` | idle "نسخ", success "تم النسخ ✓", error "تعذّر النسخ" | `navigator.clipboard.writeText`, then hidden-textarea `execCommand('copy')`, then select-and-instruct. Feedback is optimistic and reverts if the write is rejected. |
| **Toast + LiveRegion** | message | hidden, visible (2.5 s), replaced | One global `role="status"` `aria-live="polite"` region. The message names the style [MATCH zakhraafatasma]. |
| **FilterChips** | categories with counts | default, selected, disabled (0) | Scroll horizontally in RTL order. State goes in the URL hash. [MATCH zakhrafatasmaa / convertpilot / zakhrfahh] |
| **ResultCounter** | count | — | "{n} نتيجة — اضغط على أي زخرفة لنسخها" [MATCH zakhrfahh] |
| **PlatformSelector** | platform list | all / specific | Reorders and flags styles. Shows a length limit only once it's verified (Q-D3). [PREMIUM] |
| **SymbolPalette** (sheet + page) | categorized sets, search | closed, open, searching, inserted (caret flash) | Inserts at the caret. Recently-used row. Target ≥ 300 symbols [PREMIUM; beats zakhrafa.name's ~130]. |
| **DecorationKeyboard** | key sets | — | Own buffer. Backspace removes a whole grapheme. Clear, copy, "decorate this". [MATCH zakhrafatasmaa] |
| **FavoriteToggle** | styleId / name | off ☆ / on ★ | localStorage. ♡ chip filters to favorites. [MATCH zakhraafatasma + PREMIUM persistence] |
| **CopyAll** | visible results | idle, copied | Copies `label: output` lines. [MATCH zakhraafatasma] |
| **ShareButton** | name, styleId | — | Web Share API. Fallback: X, Facebook, WhatsApp, Telegram, copy link. [MATCH openl / charactercalculator] |
| **ThemeToggle** | — | light / dark / system | Defaults to `prefers-color-scheme`, persisted. [MATCH] |
| **LanguageSwitch** | — | AR ⇄ EN | Goes to the equivalent page (hreflang pair). [MATCH convertpilot] |
| **SiteSearch** | client index of pages, tools and symbols | closed, open, results, no-results | `/` or Ctrl/⌘K shortcut on desktop. [MATCH zakhraafatasma, convertpilot] |
| **FAQAccordion** | Q&A data | collapsed / expanded | `<details>/<summary>`. Content is in the server HTML. [MATCH] |
| **HubGrid** | platform links | — | Icon cards. [MATCH] |
| **ReadyNameList** | curated data | — | Tap to copy, plus "apply to my name". [MATCH + PREMIUM] |
| **Breadcrumbs** | route | — | All inner pages. [MATCH openl, convertpilot] |

### 6.4 UI string table (Arabic UI; written fresh, not copied)
| Key | Arabic | English (EN edition) |
|---|---|---|
| input.placeholder | اكتب اسمك هنا… | Type your name… |
| input.label | الاسم أو النص المراد زخرفته | Name or text to decorate |
| input.clear | مسح النص | Clear text |
| input.softLimit | قد يتجاوز هذا الطول الحد المسموح في {platform} | This may be longer than {platform} allows |
| input.hardLimit | وصلت إلى الحد الأقصى ({max} حرفاً) | Maximum length reached ({max}) |
| results.count | {n} نتيجة — اضغط على أي زخرفة لنسخها | {n} results — tap any style to copy |
| results.sampleNote | هذه أمثلة — اكتب اسمك لترى زخرفته | These are examples — type your name |
| results.mixedHint | اسمك يحتوي على حروف عربية — جرّب أيضاً الزخارف العربية | Your name has Arabic letters — try Arabic styles too |
| card.copy | نسخ | Copy |
| card.copied | تم النسخ ✓ | Copied ✓ |
| card.copyError | تعذّر النسخ — حدّد النص وانسخه يدوياً | Couldn't copy — select it and copy manually |
| card.copyAria | نسخ زخرفة {label} | Copy the {label} style |
| toast.copied | تم نسخ زخرفة «{label}» | Copied "{label}" |
| card.fav.add / remove | إضافة إلى المفضلة / إزالة من المفضلة | Add to / Remove from favorites |
| card.share | مشاركة | Share |
| card.unsupported | قد لا تظهر هذه الزخرفة بشكل صحيح على جهازك | May not display correctly on your device |
| tool.copyAll | نسخ كل الزخارف | Copy all styles |
| tool.insertSymbol | إدراج رمز | Insert symbol |
| tool.keyboard | لوحة الزخرفة | Decoration keyboard |
| tool.platform / all | المنصة / الكل | Platform / All |
| filter.* | الكل · الأفضل · عربي · إنجليزي · ألعاب · إطارات · رموز · مفضلتي | All · Best · Arabic · English · Games · Frames · Symbols · Favorites |
| filter.empty | لا توجد زخارف في هذا التصنيف لهذا الاسم — جرّب تصنيفاً آخر | No styles in this category for this name — try another |
| filter.hiddenUnsupported | عرض الزخارف المخفية ({n}) | Show hidden styles ({n}) |
| keyboard.* | حذف · مسح الكل · نسخ · زخرف هذا النص | Delete · Clear all · Copy · Decorate this |
| symbols.search / recent | ابحث عن رمز… / المستخدمة مؤخراً | Search symbols… / Recently used |
| theme.toggle | تبديل الوضع الليلي | Toggle dark mode |
| lang.switch | English | العربية |
| search.placeholder | ابحث عن أداة أو صفحة… | Search tools and pages… |
| share.title / copyLink | شارك اسمك المزخرف / نسخ الرابط | Share your decorated name / Copy link |
| hub.games / social | زخرفة أسماء الألعاب / زخرفة أسماء التواصل الاجتماعي | Gaming name styles / Social media name styles |
| hint.boxes | ترى مربعات بدل الرموز؟ جهازك أو التطبيق لا يدعم هذه الرموز — اختر زخرفة أخرى | Seeing boxes? Your device or app lacks these symbols — pick another style |
| error.generic | حدث خطأ غير متوقع — أعد تحميل الصفحة | Something went wrong — please reload |
| offline.ready | الأداة جاهزة للعمل بدون إنترنت | Ready to work offline |
| noscript | فعّل JavaScript لاستخدام أداة الزخرفة | Enable JavaScript to use the tool |

Style labels such as عريض، مائل، خط يد، قوطي، مزدوج، تطويل، إطار ملكي، قلوب، نجوم are content data in the engine. Generic typographic terms are fine. Don't copy any competitor's full label list or custom names.

### 6.5 Interaction details
- **Ordering:** a curated "best" order by default. A platform preset overrides it. Favorites are pinned when the ♡ chip is on.
- **Large lists:** render the first ~40 immediately, then virtualize or use `content-visibility:auto`. No "load more" click [PREMIUM; beats openl].
- **Keyboard (desktop):** Tab between cards, Enter/Space copies, `f` toggles favorite, `/` opens search, Esc closes sheets.
- **URL state:** filter in `#filter=`. `?name=` is written only when the user shares (privacy).

### 6.6 Edge cases and rendering (critical)
| Case | Required behavior |
|---|---|
| Arabic only (`محمد`) | Arabic set (tatweel, marks, insertion, frames) plus all frame/wrapper styles. Latin-only styles are hidden or pass Arabic through, decided per style in data. |
| Latin only (`Ahmed`) | Full Latin set plus frames |
| Mixed (`Ahmed محمد 123`) | Map per character by script. **Never reject.** |
| Digits | Math digits (𝟭𝟮𝟯) are allowed. **Never tatweel between or after digits.** |
| Emoji / ZWJ sequences / skin tones / flags | Grapheme clusters via `Intl.Segmenter`. Never split a cluster. No marks or tatweel inside one. |
| Existing harakat | Keep them on their base letter |
| Lam-alef (لا) | Insertion breaks the ligature. Allowed only in styles meant to do that. Test the rendering. |
| Non-joining letters (ا د ذ ر ز و ء ة) and word-final letters | No tatweel after them (6.7) |
| Bidi | Each output sits in an isolated `dir="auto"` container. **Don't add hidden bidi control characters to copied text** unless a style explicitly needs them, and label those styles. |
| Whitespace | Name pages: collapse runs, trim the ends. `/text`: keep newlines. |
| Paste | Plain text only. Strip control characters except ZWJ, ZWNJ and VS16. |
| > 500 graphemes | Visible message, never a silent cut |
| Empty input | Sample results plus `results.sampleNote` |
| **Unsupported glyphs (tofu □)** | [PREMIUM] Detect per device (canvas width compared against a known-missing glyph). Flag or hide unsupported cards behind "show hidden (n)". Cache per device. No competitor does this (none observed). |
| Output fonts | System font stack for outputs, never Inter or the Arabic web font (EM-6) |
| Clipboard denied / insecure context / in-app WebView | Error state with the text auto-selected for manual copy |
| JS disabled | SSR samples and content render. `noscript` notice. |
| Dark mode | Outputs keep contrast ≥ 4.5:1. Colored emoji are unaffected. |

### 6.7 Decoration engine (frontend module, TypeScript)
- Pure TypeScript package (for example `src/engine/`) with no DOM access [EM-1, EM-7].
- `Style = { id, labelAr, labelEn, categories[], scripts: ('arab'|'latn'|'digit'|'any')[], bestFor[], transform(graphemes: string[]) => string }`. Styles are defined as data tables plus a few combinators: `mapChars`, `insertBetween`, `wrap`, `combineMarks`, `compose`.
- **Joining-aware tatweel** [PREMIUM; fixes the convertpilot bug]: insert U+0640 only after a letter with Unicode Joining_Type = Dual_Joining that isn't word-final. Never after digits, Latin, spaces or punctuation.
- Mark styles add marks only to base letters of the intended script, with a cap on stacking.
- **Tests:** golden outputs per style for `محمد 123`, `Ahmed 123`, `😎🎉`, `Ahmed محمد`, `لا`, `زيد`, `👨‍👩‍👧`. Property tests: no lone surrogates, no broken clusters, output length ≤ k × input.
- **Style-count targets** [PREMIUM; numbers are ours]: ≥ 150 labeled styles that apply to Arabic input (beats convertpilot's 126) and ≥ 160 for Latin (beats openl's 156). Plus an "all templates" category with ≥ 800 framed templates to match zakhrafatasmaa's volume. **All labeled and categorized.**
- Main-thread generation for short input. Move to a Web Worker only if profiling shows jank (Q-D7).

### 6.8 Responsive, accessibility, performance, PWA
- **Mobile-first (EM-5):** one column below 640 px, targets ≥ 44 px, nothing hover-dependent, sticky input, safe-area insets. Test on low-end Android plus in-app WebViews (Instagram, TikTok, Facebook).
- **Fonts (EM-6):** Inter (self-hosted variable, Latin subset, `font-display: swap`) for Latin UI. Arabic UI font TBD (Q-O1), also self-hosted and subset. For reference only, zakhraafatasma loads Cairo from Google Fonts (VERIFIED).
- **Accessibility:** WCAG 2.2 AA. A single aria-live status region. Each card's accessible name is its label (decorated Unicode reads poorly in screen readers, so the output is `aria-hidden` inside the labeled control). Visible focus. `prefers-reduced-motion` respected. Correct `lang`/`dir` per page. The EN page wraps Arabic snippets in `lang="ar"`.
- **Performance targets** [PREMIUM; competitor speed NOT VERIFIED]: LCP < 2.0 s on mid-range Android over 4G. Generator initial JS < 100 KB gzipped (style tables split per category). CLS < 0.05. INP < 100 ms while typing.
- **PWA** [PREMIUM]: installable, works offline (the engine is client-side), and a **Web Share Target** so Android users can share text from any app into the decorator. This is our web answer to the Ozte app's floating bubble and selection menu (Q-D8).

### 6.9 SEO content specification
- **Every page:** one H1 containing its keyword (home: زخرفة اسماء), a unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars) written fresh, a self-referencing canonical, and `lang`/`dir`. **hreflang** `ar`, `en`, `x-default` on paired pages [MATCH zakhraafatasma, openl, convertpilot]. Country variants are an owner question (Q-O6).
- **Home content blocks** (union of competitor topics; target ~1,800–2,500 words. The rank-1 site has ~2,159, which is correlation, not proof):
  1. Two-line intro under the H1
  2. The tool
  3. Decorate by platform (hub links)
  4. What name decoration is (honest: Unicode characters)
  5. How to use it (3 steps)
  6. Where it works. **Never claim "accepted everywhere"**, because that's unverified. Explain that acceptance depends on the platform and app version.
  7. Why boxes appear and how to fix them [MATCH zakhraafatasma]
  8. Tips for a readable name
  9. Arabic vs English decoration
  10. Plain vs decorated examples [MATCH convertpilot]
  11. Original ready examples
  12. FAQ (8–12 Q&As)
  13. Related tools
- **Platform pages:** ≥ 600 words each of unique, platform-specific guidance. No templated spinning [PREMIUM].
- **Structured data:** `WebApplication` with a free `Offer`, `BreadcrumbList` on inner pages, and `FAQPage` where a visible FAQ exists. Competitors use FAQPage (zakhraafatasma, convertpilot, zakhrfahh; VERIFIED). Whether Google shows FAQ rich results for this niche is NOT VERIFIED, so it's added for semantics only.
- **Internal links:** every generator page links to its hub, its siblings, symbols, invisible characters and guides. Breadcrumbs everywhere except home.
- **Rendering:** content and sample results are static or SSR. Output for user input is client-only.
- `sitemap.xml` with hreflang alternates, `robots.txt`, and an OG image per page. `?name=` URLs are `noindex` (pending Q-O5).

### 6.10 Frontend quality gates (EM-1, EM-3, EM-4, EM-7)
- TypeScript strict, ESLint and Prettier. Engine unit and property tests. Component tests covering GeneratorTool states. A Playwright E2E per generator page that runs the 0.3 test battery **on a mobile viewport** and asserts copy feedback appears in < 100 ms and clipboard content is exact.
- CI: lint, type-check, tests, dependency audit and Lighthouse budget. Commit after every meaningful change.

---

## 7. Backend and technical

### 7.1 Verified competitor technical facts (evidence: static scan + browser)
| Site | Stack (static scan) | Where decoration runs | Evidence |
|---|---|---|---|
| zakhraafatasma | Custom static + `/js/main.js` | NOT VERIFIED (clipboard code, no literal style characters) | tech_seo.md |
| openl | Nuxt (Vue) | NOT VERIFIED (only 4 math chars in a 1.2 MB bundle) | tech_seo.md |
| charactercalculator | Vite-style bundle | **Client** (732 math-alnum chars + clipboard) | tech_seo.md |
| zakhrafa.name | Next.js (Turbopack) | **Client** (525 chars + clipboard) | tech_seo.md |
| zakhrafatasmaa | WordPress + Elementor + jQuery | **Client**, inline JS (232 styled chars) | tech_seo.md |
| zakhrafaengleezy | WordPress + Elementor + jQuery | Likely client (49 chars in 109 KB inline) | tech_seo.md |
| convertpilot | Next.js App Router + React + Tailwind | Likely client, NOT VERIFIED | tech_seo.md |
| dev-point1 | Custom + Cloudflare Rocket Loader | **Server on first submit** (GET → `/زخرفة_{input}`), then live | tech_seo.md + teardown_part2 §7 |
| zakhrfahh | Next.js (Turbopack) | NOT VERIFIED | tech_seo.md |

More static-scan facts (saved HTML in `prd/html/`, 2026-10-14):
- **Canonical tags** on every scanned page except zakhrafa.name, which has none.
- **JSON-LD @types:**
  - zakhraafatasma: FAQPage, SoftwareApplication, WebPage, Organization
  - convertpilot: FAQPage, BreadcrumbList, Organization, UseAction
  - zakhrfahh: FAQPage, WebApplication
  - openl (fancy-text): Question/Answer, BreadcrumbList, Organization
  - zakhrafatasmaa: Article, WebSite, WebPage
  - zakhrafaengleezy: WebSite, WebPage
  - dev-point1 and zakhrafa.name: WebSite only
- **hreflang:** zakhraafatasma has `ar` + `x-default`. openl has ~28 locales, charactercalculator 24, and convertpilot 8 (en, es, ar, tr, de, id, pt, x-default). The others have none.
- **Third parties (presence only, no IDs):**
  - GA: zakhraafatasma, zakhrafaengleezy
  - AdSense: zakhrafaengleezy, convertpilot, dev-point1, zakhrfahh
  - Other ad engines: zakhraafatasma (an external wrapper), charactercalculator (Snigel), zakhrafaengleezy (Ezoic)
  - Consent/CMP: zakhrafaengleezy, dev-point1
  - None detected: zakhrafa.name, zakhrafatasmaa
- **Not measured:** network calls while typing, server timings, and hosting/CDN beyond Cloudflare signals.

### 7.2 Our backend requirements (RECOMMENDATION, constrained by the Engineering Must-Haves)
- **v1 needs no application backend and no database.** The engine, favorites, history and tofu cache all run client-side (localStorage). Pages are statically generated or SSR'd with the chosen TypeScript framework at its latest stable release (EM-4, EM-7), served from a CDN with good edge coverage for DZ, EG, SA, IQ and MA (Q-D2).
- **If a database becomes necessary** (CMS for guides or ready-name collections, accounts, synced favorites, a share-link shortener, anonymous aggregated "popular styles"), it's **PostgreSQL** (EM-9). Use a typed query layer or ORM, keep migrations in the repo, and use only parameterized queries.
- **Security (EM-2):**
  - HTTPS + HSTS.
  - CSP without `unsafe-inline` scripts (nonces or hashes). Any third-party script (ads or analytics, if the owner approves them) is explicitly allowlisted.
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (clipboard-write limited to self), `frame-ancestors 'self'`.
  - A reflected `?name=` is rendered as text only and capped at 500 graphemes.
  - Rate limiting on any API.
  - Don't log user-typed names server-side.
  - Dependency and secret scanning in CI.
- **Ads and analytics:** none specified, and no IDs. Owner decision (Q-O3, Q-O7). If added, they load after the tool is interactive, reserve space (no layout shift), and never sit inside the results grid.
- **Observability:** client error tracking (clipboard failures, engine exceptions) with no PII.

---

## 8. Open questions for the developer
*The Engineering Must-Haves already settle the following, so they're not asked here: TypeScript, PostgreSQL if a DB is needed, Inter for Latin, mobile-first, latest stable versions, reusable components, commit cadence.*

- **Q-D1:** Share URLs: a query param (`/?name=`) or a path (`/n/{name}`)? Which caches better with the chosen framework? Indexing is owner question Q-O5.
- **Q-D2:** Which TypeScript web framework (latest stable) and which host/CDN best fit static generation, AR/EN i18n routing and edge coverage for DZ, EG, SA, IQ and MA? Propose one with a short justification before scaffolding.
- **Q-D3:** Name-length and character rules for PUBG, Free Fire, Roblox, Valorant, Minecraft, Instagram, TikTok, WhatsApp, Facebook, Discord and Telegram are **NOT VERIFIED**. Please source them (official docs or a hands-on test) and record the source and date for each before the UI shows any limit.
- **Q-D4:** Is device-side tofu detection reliable and cheap across Chrome Android, Samsung Internet, Android WebView and iOS Safari? Should it run eagerly or lazily per category?
- **Q-D5:** Should style tables ship as split per-category JSON (lazy) or be compiled into the bundle? Profile both against the 100 KB budget.
- **Q-D6:** Clipboard behavior inside the Instagram, TikTok and Facebook in-app browsers. Please test, then report which fallbacks are needed.
- **Q-D7:** Main thread or Web Worker for generating 800+ templates on low-end Android?
- **Q-D8:** Web Share Target support on our target browsers. Ship it in v1 or v1.1?

---

## 9. Verification log
| Item | Status | Source |
|---|---|---|
| SERP domains DZ-ar, DZ-en, EG-ar, EG-en, SA-ar | VERIFIED (single snapshot) | serp/serp_domains.csv |
| SERP SA-en, IQ-ar, IQ-en, MA-ar, MA-en | **NOT VERIFIED** (Google blocked) | serp/serp_raw.csv, brief |
| How the successful SERP collection was run | **NOT DOCUMENTED** in the source files | — |
| zakhraafatasma: live debounced + optional button; 60/54; labels + tags; feedback text and ~400 ms delay; favorites; copy-all; insert symbol; theme; Etsy carousel in results; 37 iframes | VERIFIED (R2) | teardown_part2 §1 |
| zakhraafatasma "button required" | **Superseded** by R2 | teardown_part1 §1 |
| zakhraafatasma Arabic-letter decoration mechanism | **NOT VERIFIED** | tech_seo.md |
| openl: live; 50 → 156; English labels and placeholder; hover-only copy; `تم النسخ`; share row; ad above results; optional login and upgrade | VERIFIED (R2) | teardown_part2 §2 |
| charactercalculator: 60 fixed labeled cards; tooltip `تم النسخ!`; theme; client-side map | VERIFIED | teardown_part2 §3, tech_seo |
| zakhrafa.name: live; 26 cards + 5 tabs; ~130 symbols; `maxlength=100`; `تم النسخ بنجاح`; no ads; no canonical | VERIFIED | teardown_part2 §4, static scan |
| zakhrafa.name total style count | **NOT VERIFIED** (estimate only) | teardown_part2 §4 |
| zakhrafa.name header menu contents | **NOT VERIFIED** | teardown_part2 §4 |
| zakhrafatasmaa: 813 unlabeled; 36 filters; silent copy; keyboard; AR/EN toggle; 8 themes; no H1; no ads | VERIFIED (R2) | teardown_part2 §5 |
| zakhrafaengleezy: Arabic rejected; 182/135; silent copy; no H1; 6 iframes | VERIFIED (R1 only) | teardown_part1 §6 |
| zakhrafaengleezy: why the count stays fixed with a 400-char input | **NOT VERIFIED** | teardown_part1 §6 |
| convertpilot: 126/48 script-aware; green card + status; heavy ads; tatweel between digits | VERIFIED | teardown_part2 §6 |
| dev-point1: GET → result URL; 99 unlabeled; `تم النسخ ✓` status | VERIFIED | teardown_part2 §7 |
| dev-point1 landing H1 | **NOT VERIFIED** | teardown_part2 §7 |
| zakhrfahh: hub + category pages; 27/39; `/arabic` rejects Latin and emoji; icon-only feedback | VERIFIED | teardown_part2 §8 |
| zakhrfahh per-filter counts; `/pubg`, `/freefire`, `/letters`, `/text` behavior | **NOT VERIFIED** | teardown_part2 §8 |
| Play Store ratings and installs | VERIFIED from listing text (installs via regex) | tech_seo.md |
| Play Store app behavior | **NOT VERIFIED** (not installed) | — |
| Pinterest ranking page content | **NOT VERIFIED** (not analyzed) | — |
| Mobile layout and feel of every competitor | **NOT VERIFIED** | — |
| Competitor page speed and CWV | **NOT VERIFIED** | — |
| Network calls while typing | **NOT VERIFIED** | — |
| Ads or CMP injected after load; exact ad positions | **NOT VERIFIED** (counts only) | — |
| Byte-exact clipboard content after copy | **NOT VERIFIED** | — |
| Decorated names accepted by games and social apps | **NOT VERIFIED** | — |
| Platform name-length limits | **NOT VERIFIED** (Q-D3) | — |
| Google FAQ rich-result eligibility for this niche | **NOT VERIFIED** | — |
| Where decoration runs for openl, zakhraafatasma, zakhrfahh | **NOT VERIFIED** | tech_seo.md |
| JSON-LD types, canonical, viewport | VERIFIED (static scan 2026-10-14) | prd/html/ |

---

## 10. Non-goals (v1)
- Native Android or iOS apps (a PWA instead; revisit later).
- User accounts, logins, paid tiers or upgrade prompts (unlike openl). The tool is fully free with no sign-up.
- Image or graphic name art and downloadable design packs (zakhraafatasma's Etsy shop, dev-point1's photo-text link).
- Unrelated multi-tools such as PDF, image, translation and unit converters (openl, convertpilot). Only text-decoration-adjacent tools are in scope.
- Locales other than Arabic and English.
- Server-side processing or storage of typed names.
- Any guarantee that a decoration will be accepted by a specific platform.

---

## 11. Open questions for the site owner
- **Q-O1:** Which **Arabic UI font** pairs with Inter (EM-6)? Candidates to evaluate: Cairo (also used by zakhraafatasma), IBM Plex Sans Arabic, Noto Sans Arabic / Noto Kufi Arabic, Tajawal, Readex Pro. What brand feel do you want?
- **Q-O2:** Brand name, domain, logo and color palette? Multiple color themes (like zakhrafatasmaa's 8) or just light and dark?
- **Q-O3:** Monetization. Ads, yes or no? If yes, what density and which placements? Our recommendation is none between the input and the first results and none inside the grid. Is a donation link (like convertpilot) acceptable?
- **Q-O4:** URL slugs in Latin (`/games/pubg`) or Arabic (`/زخرفة-اسماء-ببجي`)? Competitors use both.
- **Q-O5:** Should per-name result pages (dev-point1 style) be indexable for long-tail traffic, or `noindex` to avoid thin and duplicate content?
- **Q-O6:** One `ar` version, or country variants (ar-DZ, ar-EG, ar-SA, ar-IQ, ar-MA) with localized examples?
- **Q-O7:** Analytics: which tool, if any? Do you need a cookie-consent banner for your audiences?
- **Q-O8:** Launch priority for platform pages: all 6 games and 7 social pages, or a subset first?
- **Q-O9:** Who writes the Arabic content and the ready-name collections? What tone (MSA or dialect-friendly)? Do you want a CMS? A CMS implies PostgreSQL under EM-9.
- **Q-O10:** Should we re-run the blocked SERPs (SA-en, IQ, MA) from an in-region connection before launch?
- **Q-O11:** Islamic decorations page: any editorial guidelines on which phrases and symbols are appropriate?
