# زخرفة أسماء — locked build spec

This file is the build contract. `PRD.md` stays the research notes and is not overwritten.

## Product

Arabic-first static site. Head query: زخرفة اسماء. One MSA site. English is a translation under `/en/`. No country copies, accounts, ads, database, or third-party scripts.

Brand: gold crown, زخرفة أسماء, tagline زخارف أسماء عربية وإنجليزية. Gold `#C9A227` / `#E8C872` / `#F5E6A8`, navy `#0B1F3A` / `#102A4C`, cream `#F7F1E3`, cards `#FFFBF2`, footer `#071525`. Cairo for Arabic UI, Inter for Latin UI. Decorated results use a system font stack, never Cairo or Inter.

## Stack

Astro static, trailing slashes, stylesheets not inlined, assets not inlined. TypeScript strict. Security headers and a self-only content security policy in `vercel.json`. Theme key `za-theme`. Favorites key `za-favorites`. User text is written with `textContent`. JSON-LD escapes `<`.

`SITE_URL` is empty until the domain exists. Sitemap, canonical, and hreflang appear only when it is set. `x-default` is Arabic.

## Pages

One URL per keyword cluster. A keyword group becomes an H2 only when it is a real job (acceptance, length, language, device, script, mood, bot, download). Typos, years, and personal names stay in body copy.

Extra URLs: `/hidden-characters/` and `/usernames/`.

PUBG and Free Fire have their own pages. Fortnite, Ludo, Call of Duty, Roblox, Epic, and Clash of Clans are sections on `/game-names/`. Games with no volume share one section. BGMI, Valorant, and Minecraft have no section.

## Generator

Updates on each keystroke. Decorate scrolls to the results. Copy, copy-all, and clear. Chips: الكل، مفضلة، عربي، إنجليزي، ألعاب، تواصل، رموز، قلوب، نجوم، إطارات، فخم، كيوت. Favorites in localStorage. Insert a symbol at the caret. The “يغيّر الحروف” badge is only on harakat and glitch. Grapheme counter. Hard cap 500 with a visible message. PUBG warns past 7 as a search note, not an official game limit.

A card hides when the style does not change the text. An empty field shows the page sample and a sample note. Arabic tatweel follows joining rules and leaves lam-alef as a ligature. Glitch uses at most two combining marks. Emoji stay one grapheme.

## Honesty

Facebook, PUBG, TikTok, Instagram, Free Fire, Snapchat, WhatsApp, Telegram, and Discord pages explain what usually remains and how to test it. They never say a game or Facebook will accept the result.

Calligraphy explains that ruqaa, Kufi, and Thuluth are not a font file or an image. Colored and gold answers photos, logos, 3D, and gold as emoji sparkle, not a file shop. Tools answers website, app, bot, download, and AI with “use this page.” The Islamic page is a quiet frame for personal names and does not decorate أسماء الله الحسنى or Quran text.

## Out of v1

Shops, PNG/SVG, wallpapers, APKs, AI images, font-file download, per-name or per-year or per-country URLs, Morse and similar utilities, a full decoration keyboard, fake reviews, WhatsApp Gold, login, extra UI languages, and any acceptance guarantee.
