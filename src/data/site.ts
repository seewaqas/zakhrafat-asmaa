import type { Locale } from "../lib/styles.ts";

export type Phrase = { label: string; text: string };

export type Section = { heading: string; paragraphs: readonly string[] };

export type Faq = { q: string; a: string };

export type ToolKind = "generator" | "blanks" | "usernames" | "none";

export type PageCopy = {
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lede: readonly string[];
  steps: readonly string[];
  sections: readonly Section[];
  faq: readonly Faq[];
};

export type PageDef = {
  slug: string;
  category: string;
  sample: string;
  phrases: readonly Phrase[];
  limit?: number;
  limitHintAr?: string;
  limitHintEn?: string;
  tool: ToolKind;
  stripTashkeel?: boolean;
  symbols?: boolean;
  alphabet?: boolean;
  names?: "ready" | "people" | "clans";
  home?: boolean;
  related: readonly string[];
  ar: PageCopy;
  en: PageCopy;
};

export const PUBLISHED = "2026-10-14";

export const INSERT_SYMBOLS = ["♛", "★", "✦", "♡", "✿", "⚔", "꧁", "꧂", "『", "』", "✨", "🦋", "♫", "◆", "☾", "🔥"] as const;

export function hrefFor(slug: string, locale: Locale): string {
  if (locale === "en") return slug ? `/en/${slug}/` : "/en/";
  return slug ? `/${slug}/` : "/";
}

export function alternateHref(slug: string, locale: Locale): string {
  return hrefFor(slug, locale === "ar" ? "en" : "ar");
}

export const UI = {
  ar: {
    skip: "تخطَّ إلى المحتوى",
    brand: "زخرفة أسماء",
    tagline: "زخارف أسماء عربية وإنجليزية",
    lang: "EN",
    langLabel: "English",
    theme: "تبديل المظهر",
    menu: "القائمة",
    search: "بحث",
    searchPlaceholder: "ابحث عن صفحة…",
    inputLabel: "الاسم أو النص المراد زخرفته",
    placeholder: "اكتب اسمك هنا…",
    decorate: "زخرف الاسم",
    copyAll: "نسخ الكل",
    clear: "مسح",
    copied: "تم النسخ ✓",
    copy: "نسخ",
    copyError: "تعذّر النسخ — حدّد النص وانسخه يدوياً",
    copyAria: "نسخ زخرفة",
    favAdd: "إضافة إلى المفضلة",
    favRemove: "إزالة من المفضلة",
    changes: "يغيّر الحروف",
    unsupported: "قد لا تظهر هذه الزخرفة بشكل صحيح على جهازك",
    showHidden: "عرض الزخارف المخفية ({n})",
    hideHidden: "إخفاء الزخارف غير المدعومة",
    sampleNote: "هذه أمثلة. اكتب اسمك لترى زخرفته.",
    count: "حرفاً",
    hardCap: "وصلت إلى الحد الأقصى (500 حرفاً)",
    insert: "إدراج رمز",
    strip: "إزالة التشكيل",
    emptyFilter: "لا توجد زخارف في هذا التصنيف لهذا الاسم. جرّب تصنيفاً آخر.",
    toast: "تم نسخ زخرفة",
    how: "كيف تستخدم الأداة",
    related: "صفحات ذات صلة",
    popular: "عمليات بحث شائعة",
    featured: "أنماط يمكن تجربتها",
    gamesTitle: "زخرفة اسماء الالعاب",
    socialTitle: "زخرفة اسماء حسابات التواصل",
    toolsTitle: "خطوط ورموز وأحرف مخفية",
    footerAbout: "أداة مجانية لنسخ أسماء مزخرفة بالعربية والإنجليزية. النتيجة نص يونيكود، والمعالجة تتم في متصفحك.",
    rights: "زخرفة أسماء",
    home: "الرئيسية",
    namesTitle: "أسماء جاهزة للنسخ",
    symbolsTitle: "رموز للنسخ",
    blanksTitle: "أحرف مخفية للنسخ",
    alphabetTitle: "من A إلى Z",
    userTitle: "اقتراحات اسم المستخدم",
    userHint: "اسم المستخدم (@) يقبل الحروف اللاتينية والأرقام والنقطة والشرطة السفلية. الزخرفة مكانها اسم العرض والنبذة.",
    userArabic: "النص فيه حروف عربية. حقل اليوزر لا يقبلها. اكتب الاسم باللاتينية ليظهر الاقتراح.",
    noscript: "فعّل JavaScript لاستخدام أداة الزخرفة. الأمثلة أعلاه ظاهرة بدونها.",
  },
  en: {
    skip: "Skip to content",
    brand: "Zakhrafat Asmaa",
    tagline: "Arabic and English name styles",
    lang: "عربي",
    langLabel: "العربية",
    theme: "Toggle theme",
    menu: "Menu",
    search: "Search",
    searchPlaceholder: "Search pages…",
    inputLabel: "Name or text to decorate",
    placeholder: "Type your name…",
    decorate: "Decorate",
    copyAll: "Copy all",
    clear: "Clear",
    copied: "Copied ✓",
    copy: "Copy",
    copyError: "Couldn't copy. Select the text and copy it manually.",
    copyAria: "Copy style",
    favAdd: "Add to favorites",
    favRemove: "Remove from favorites",
    changes: "Changes the letters",
    unsupported: "May not display correctly on your device",
    showHidden: "Show hidden styles ({n})",
    hideHidden: "Hide unsupported styles",
    sampleNote: "These are examples. Type your name to decorate it.",
    count: "characters",
    hardCap: "Maximum length reached (500)",
    insert: "Insert symbol",
    strip: "Remove vowel marks",
    emptyFilter: "No styles in this category for this name. Try another.",
    toast: "Copied style",
    how: "How to use it",
    related: "Related pages",
    popular: "Popular searches",
    featured: "Styles to try",
    gamesTitle: "Game name styles",
    socialTitle: "Social profile styles",
    toolsTitle: "Fonts, symbols, and hidden characters",
    footerAbout: "A free tool for copying decorated Arabic and English names. The result is Unicode text, processed in your browser.",
    rights: "Zakhrafat Asmaa",
    home: "Home",
    namesTitle: "Ready names to copy",
    symbolsTitle: "Symbols to copy",
    blanksTitle: "Hidden characters to copy",
    alphabetTitle: "A to Z",
    userTitle: "Username ideas",
    userHint: "A @username accepts Latin letters, digits, a dot, and an underscore. Decoration belongs on the display name and the bio.",
    userArabic: "This text contains Arabic letters. A username field will not accept them. Type the name in Latin letters to see ideas.",
    noscript: "Enable JavaScript to use the decorator. The examples above still show without it.",
  },
} as const;

export const NAV = {
  ar: [
    { href: "/", label: "الرئيسية" },
    {
      label: "زخرفة الأسماء",
      links: [
        ["arabic-names", "عربي"],
        ["english-names", "إنجليزي"],
        ["arabic-english-names", "عربي وإنجليزي"],
        ["fancy-names", "فخم"],
        ["name-font-styles", "خط صغير وعريض"],
        ["arabic-calligraphy-names", "خط عربي"],
        ["decorated-names-copy", "جاهزة للنسخ"],
        ["girls-boys-names", "بنات وشباب"],
        ["how-to-decorate-names", "طريقة الزخرفة"],
      ],
    },
    {
      label: "الألعاب",
      links: [
        ["pubg-names", "ببجي"],
        ["free-fire-names", "فري فاير"],
        ["game-names", "ألعاب أخرى"],
      ],
    },
    {
      label: "وسائل التواصل",
      links: [
        ["facebook-names", "فيسبوك"],
        ["tiktok-names", "تيك توك"],
        ["instagram-names", "انستقرام"],
        ["social-chat-names", "سناب وواتساب"],
      ],
    },
    { href: "/name-font-styles/", label: "الخطوط" },
    { href: "/names-with-symbols/", label: "الرموز" },
    { href: "/decorated-names-copy/", label: "المجموعات" },
    {
      label: "الأدوات",
      links: [
        ["", "المولّد"],
        ["names-with-symbols", "الرموز"],
        ["hidden-characters", "أحرف مخفية"],
        ["usernames", "اسم المستخدم"],
        ["iphone-names", "آيفون"],
        ["how-to-decorate-names", "الطريقة"],
      ],
    },
    { href: "/how-to-decorate-names/", label: "المدونة" },
  ],
  en: [
    { href: "/en/", label: "Home" },
    {
      label: "Names",
      links: [
        ["arabic-names", "Arabic"],
        ["english-names", "English"],
        ["arabic-english-names", "Mixed"],
        ["fancy-names", "Fancy"],
        ["name-font-styles", "Font styles"],
        ["arabic-calligraphy-names", "Calligraphy"],
        ["decorated-names-copy", "Ready to copy"],
        ["girls-boys-names", "Girls and boys"],
        ["how-to-decorate-names", "How to"],
      ],
    },
    {
      label: "Games",
      links: [
        ["pubg-names", "PUBG"],
        ["free-fire-names", "Free Fire"],
        ["game-names", "Other games"],
      ],
    },
    {
      label: "Social",
      links: [
        ["facebook-names", "Facebook"],
        ["tiktok-names", "TikTok"],
        ["instagram-names", "Instagram"],
        ["social-chat-names", "Snapchat and WhatsApp"],
      ],
    },
    { href: "/en/name-font-styles/", label: "Fonts" },
    { href: "/en/names-with-symbols/", label: "Symbols" },
    { href: "/en/decorated-names-copy/", label: "Collections" },
    {
      label: "Tools",
      links: [
        ["", "Generator"],
        ["names-with-symbols", "Symbols"],
        ["hidden-characters", "Hidden characters"],
        ["usernames", "Usernames"],
        ["iphone-names", "iPhone"],
        ["how-to-decorate-names", "How to"],
      ],
    },
    { href: "/en/how-to-decorate-names/", label: "Guides" },
  ],
} as const;

export const FOOTER = {
  ar: [
    {
      title: "التصنيفات",
      links: [
        ["", "مولّد الأسماء"],
        ["pubg-names", "ببجي"],
        ["free-fire-names", "فري فاير"],
        ["facebook-names", "فيسبوك"],
        ["instagram-names", "انستقرام"],
      ],
    },
    {
      title: "أدوات",
      links: [
        ["names-with-symbols", "الرموز"],
        ["hidden-characters", "أحرف مخفية"],
        ["usernames", "اسم المستخدم"],
        ["name-font-styles", "الخطوط"],
        ["iphone-names", "آيفون"],
      ],
    },
    {
      title: "استكشف",
      links: [
        ["decorated-names-copy", "مجموعات جاهزة"],
        ["arabic-calligraphy-names", "الخط العربي"],
        ["how-to-decorate-names", "الطريقة"],
        ["colored-gold-names", "ملون وذهبي"],
        ["islamic-names", "إسلامي"],
      ],
    },
    {
      title: "قانوني",
      links: [
        ["about", "من نحن"],
        ["privacy", "الخصوصية"],
        ["terms", "شروط الاستخدام"],
        ["contact", "اتصل بنا"],
      ],
    },
  ],
  en: [
    {
      title: "Categories",
      links: [
        ["", "Generator"],
        ["pubg-names", "PUBG"],
        ["free-fire-names", "Free Fire"],
        ["facebook-names", "Facebook"],
        ["instagram-names", "Instagram"],
      ],
    },
    {
      title: "Tools",
      links: [
        ["names-with-symbols", "Symbols"],
        ["hidden-characters", "Hidden characters"],
        ["usernames", "Usernames"],
        ["name-font-styles", "Fonts"],
        ["iphone-names", "iPhone"],
      ],
    },
    {
      title: "Explore",
      links: [
        ["decorated-names-copy", "Ready names"],
        ["arabic-calligraphy-names", "Arabic calligraphy"],
        ["how-to-decorate-names", "How to"],
        ["colored-gold-names", "Color and gold"],
        ["islamic-names", "Islamic"],
      ],
    },
    {
      title: "Legal",
      links: [
        ["about", "About"],
        ["privacy", "Privacy"],
        ["terms", "Terms"],
        ["contact", "Contact"],
      ],
    },
  ],
} as const;
