import { REST_PAGES } from "./pages-rest.ts";
import type { PageDef } from "./site.ts";

const stepsAr = [
  "اكتب الاسم في الحقل. البطاقات تتحدث مع كل حرف.",
  "اختر نمطاً يُقرأ في المكان الذي ستلصقه فيه. الأنماط ذات الرمز «يغيّر الحروف» تغيّر النص نفسه.",
  "اضغط نسخ. يتحول الزر إلى «تم النسخ».",
  "الصق في خانة الاسم أو النبذة، وجرّبه في محادثة قبل أن تثبّته.",
] as const;

const stepsEn = [
  "Type the name. The cards update with each letter.",
  "Pick a style that stays readable where you will paste it. Styles marked “changes the letters” alter the text itself.",
  "Press Copy. The button changes to “Copied”.",
  "Paste it into the name field or bio, and try it in a chat before you save it.",
] as const;

const CORE_PAGES: readonly PageDef[] = [
  {
    slug: "",
    category: "all",
    sample: "نور Nora",
    phrases: [
      { label: "نور", text: "نور" },
      { label: "Nora", text: "Nora" },
      { label: "صقر", text: "صقر" },
    ],
    tool: "generator",
    home: true,
    related: ["pubg-names", "free-fire-names", "facebook-names", "names-with-symbols"],
    ar: {
      title: "زخرفة اسماء — مولد أسماء عربي وإنجليزي",
      description: "اكتب اسمك بالعربية أو الإنجليزية وانسخ زخرفة جاهزة للألعاب وحسابات التواصل. مجاناً وبدون تسجيل.",
      h1: "زخرفة اسماء عربي وإنجليزي",
      eyebrow: "مولّد مجاني",
      lede: [
        "اكتب اسمك بالعربية أو الإنجليزية واحصل على أنماط جاهزة للنسخ واللصق في الألعاب وحسابات التواصل.",
        "النتيجة نص يونيكود حقيقي، وليست صورة. المعالجة تتم داخل المتصفح، والاسم لا يُرسل إلى خادم.",
      ],
      steps: stepsAr,
      sections: [
        {
          heading: "ما هي زخرفة الاسماء؟",
          paragraphs: [
            "زخرفة الاسماء تحويل النص العادي إلى أشكال بديلة من جداول يونيكود، مع إطارات ورموز حول الاسم. الحروف اللاتينية لها أشكال عريضة ومائلة وقوطية. الحروف العربية تبقى عربية، وتُزيَّن بالتطويل والرموز والتشكيل.",
            "لهذا يمكن نسخ النتيجة ولصقها في خانة تقبل النص. التطبيق هو الذي يقرر ما يبقيه.",
          ],
        },
        {
          heading: "العربية والإنجليزية في الحقل نفسه",
          paragraphs: [
            "اكتب «نور» فتظهر أنماط التطويل والإطارات. اكتب «Nora» فتظهر الخطوط اللاتينية. الاسم المختلط يستخدم الأسلوب المناسب لكل حرف.",
            "إذا ظهر الاسم كما كتبته في بطاقة ما، فهذا النمط لا يغيّر هذا الخط، والبطاقة تُخفى حتى لا تتكرر النتيجة.",
          ],
        },
        {
          heading: "أين يلصق الناس الاسم؟",
          paragraphs: [
            "أكثر المواضع: اسم العرض في ببجي وفري فاير، واسم العرض والنبذة في انستقرام وتيك توك وواتساب. اسم المستخدم الذي يبدأ بـ @ يقبل في العادة حروفاً لاتينية وأرقاماً فقط.",
            "صفحة كل منصة تشرح الفرق بين الحقول. لا نعد بأن اللعبة أو فيسبوك سيحفظان النتيجة.",
          ],
        },
        {
          heading: "لماذا تظهر مربعات فارغة؟",
          paragraphs: [
            "المربع الفارغ يعني أن خط الجهاز لا يملك رسماً لذلك الرمز. قد يظهر الاسم سليماً عندك ومربعات عند غيرك.",
            "جرّب العريض أو المائل أو إطاراً بسيطاً. الرموز النادرة أجمل على بعض الهواتف وأضعف على غيرها.",
          ],
        },
        {
          heading: "احتفظ بنسخة عادية",
          paragraphs: [
            "بعض التطبيقات تبحث بالاسم العادي فقط. احفظ «نور» إلى جانب «♛ نـور ♛» حتى يظل الحساب قابلاً للعثور عليه.",
            "الأنماط التي تحمل شارة «يغيّر الحروف» تضيف تشكيلاً أو علامات، فيصعب البحث عن الاسم بعدها.",
          ],
        },
      ],
      faq: [
        { q: "هل النتيجة صورة؟", a: "لا. هي نص يمكن تحديده ونسخه. بعض الرموز تظهر مربعاً إذا كان الخط لا يدعمها." },
        { q: "هل يُحفظ الاسم؟", a: "لا. الزخرفة تتم في المتصفح. المفضلة تبقى على جهازك فقط." },
        { q: "هل تعمل على الآيفون والأندرويد؟", a: "نعم، لأن النتيجة نص. شكل بعض الرموز يختلف بين الخطوط." },
        { q: "هل يقبل فيسبوك أو ببجي كل الأنماط؟", a: "ليس دائماً. كل تطبيق يحذف رموزاً أو يرفض الحفظ. جرّب نمطاً أقصر داخل التطبيق نفسه." },
      ],
    },
    en: {
      title: "Decorated Arabic and English names",
      description: "Type an Arabic or English name and copy a Unicode style for games and social profiles. Free, with no account.",
      h1: "Arabic and English name styles",
      eyebrow: "Free generator",
      lede: [
        "Type a name in Arabic or English and copy a style for a game or a social profile.",
        "The result is real Unicode text, not a picture. It is made in your browser and is not sent to a server.",
      ],
      steps: stepsEn,
      sections: [
        {
          heading: "What name decoration is",
          paragraphs: [
            "It swaps Latin letters for bold, italic, script, and gothic Unicode letters, and it decorates Arabic with tatweel, marks, and frames.",
            "You can paste the result anywhere that accepts text. The app decides what it keeps.",
          ],
        },
        {
          heading: "Arabic and English in one field",
          paragraphs: [
            "Arabic input shows tatweel and frames. Latin input shows the font styles. A mixed name is handled letter by letter.",
            "A card that would repeat the original text is hidden.",
          ],
        },
        {
          heading: "Where people paste it",
          paragraphs: [
            "Common places are a PUBG or Free Fire display name, and the display name or bio on Instagram, TikTok, and WhatsApp. A @username usually accepts only Latin letters and digits.",
            "Each platform page explains the fields. This site does not promise that a game or Facebook will save the result.",
          ],
        },
        {
          heading: "Why boxes appear",
          paragraphs: [
            "An empty box means the phone’s font has no drawing for that character. It can look fine on your phone and broken on another.",
            "Try bold, italic, or a short frame. Rare symbols fail more often.",
          ],
        },
        {
          heading: "Keep a plain copy",
          paragraphs: [
            "Some apps search only the plain name. Keep the original next to the decorated copy.",
            "Styles marked “changes the letters” add marks, so a search for the plain name can miss them.",
          ],
        },
      ],
      faq: [
        { q: "Is the result a picture?", a: "No. It is text you can select and copy. Some symbols show as boxes when a font lacks them." },
        { q: "Is the name stored?", a: "No. Decoration runs in the browser. Favorites stay on your device." },
        { q: "Does it work on iPhone and Android?", a: "Yes, because the result is text. A few symbols differ between fonts." },
        { q: "Will Facebook or PUBG accept every style?", a: "No. Each app strips characters or refuses to save. Test a shorter style inside the app." },
      ],
    },
  },
  {
    slug: "arabic-names",
    category: "arabi",
    sample: "محمد",
    phrases: [
      { label: "محمد", text: "محمد" },
      { label: "ليان", text: "ليان" },
      { label: "سلمان", text: "سلمان" },
    ],
    tool: "generator",
    stripTashkeel: true,
    related: ["arabic-calligraphy-names", "fancy-names", "names-with-symbols"],
    ar: {
      title: "زخرفة اسماء عربية",
      description: "زخرفة الأسماء العربية بالتطويل والإطارات والتشكيل، مع إبقاء الحرف العربي قابلاً للنسخ.",
      h1: "زخرفة اسماء عربية",
      eyebrow: "عربي",
      lede: ["الحرف العربي لا يملك خطاً عريضاً جاهزاً داخل يونيكود كما تملك اللاتينية. الزخرفة هنا تطويل ورمز وإطار."],
      steps: stepsAr,
      sections: [
        { heading: "التشكيل", paragraphs: ["نمط التشكيل يضيف فتحة وضمة وكسرة. الشارة «يغيّر الحروف» تعني أن البحث عن الاسم قد يفشل. زر إزالة التشكيل يعيد الحروف بلا حركات ويبقي التطويل."] },
        { heading: "العريض والمائل", paragraphs: ["العريض والمائل يغيّران الحروف اللاتينية فقط. الاسم العربي فيهما يبقى كما هو، لذلك تُخفى البطاقة. للعربي استخدم التطويل أو إطاراً."] },
        { heading: "الأسماء الفخمة", paragraphs: ["الإطار الهادئ والتاج يناسبان اسماً قصيراً. كثرة الرموز تصعّب القراءة. مجموعة الأنماط الفخمة في صفحة مستقلة."] },
        { heading: "الخط العربي", paragraphs: ["الرقعة والكوفي والثلث خطوط تُثبَّت في الجهاز أو تُرسم صورة. هذه الصفحة لا تمنح ملف خط. الشرح في صفحة الخط العربي."] },
      ],
      faq: [
        { q: "لماذا لا يصير اسمي عريضاً؟", a: "جداول يونيكود الرياضية لا تحتوي حروفاً عربية بديلة. التطويل والإطار هما المسار العربي." },
        { q: "هل التشكيل مناسب للعبة؟", a: "غالباً لا. الحركة تغيّر النص وقد تُحذف. التطويل والإطار أوضح." },
      ],
    },
    en: {
      title: "Arabic name decoration",
      description: "Decorate Arabic names with tatweel, frames, and vowel marks, and keep the letters copyable.",
      h1: "Arabic name styles",
      eyebrow: "Arabic",
      lede: ["Unicode has no bold Arabic alphabet the way it has bold Latin. Arabic decoration here is tatweel, symbols, and frames."],
      steps: stepsEn,
      sections: [
        { heading: "Vowel marks", paragraphs: ["The vowel-mark style adds fatha, damma, and kasra. The “changes the letters” badge means a search for the name may fail. Remove vowel marks restores the letters and keeps tatweel."] },
        { heading: "Bold and italic", paragraphs: ["Bold and italic change Latin letters only. An Arabic name is unchanged, so that card is hidden. Use tatweel or a frame for Arabic."] },
        { heading: "Fancy names", paragraphs: ["A quiet frame or a crown suits a short name. Too many symbols make it hard to read. Fancy styles have their own page."] },
        { heading: "Arabic calligraphy", paragraphs: ["Ruqaa, Kufi, and Thuluth are installed fonts or pictures. This page does not hand out a font file. The calligraphy page explains that."] },
      ],
      faq: [
        { q: "Why does my name not turn bold?", a: "The mathematical Unicode alphabets have no Arabic letters. Tatweel and frames are the Arabic path." },
        { q: "Are vowel marks good in a game?", a: "Usually not. They change the text and are often stripped. Tatweel and a frame are clearer." },
      ],
    },
  },
  {
    slug: "english-names",
    category: "english",
    sample: "Nora",
    phrases: [
      { label: "Nora", text: "Nora" },
      { label: "Adam", text: "Adam" },
      { label: "Lina", text: "Lina" },
    ],
    tool: "generator",
    related: ["name-font-styles", "facebook-names", "tiktok-names", "free-fire-names"],
    ar: {
      title: "زخرفة اسماء انجليزي",
      description: "حوّل الاسم الإنجليزي إلى عريض ومائل وخط يد وقوطي ودوائر، جاهز للنسخ.",
      h1: "زخرفة اسماء انجليزي",
      eyebrow: "إنجليزي",
      lede: ["هذه الصفحة للأسماء اللاتينية: عريض، مائل، خط يد، قوطي، دوائر، ومربعات. الاسم العربي في الحقل نفسه ما زال يحصل على الإطارات والتطويل."],
      steps: stepsAr,
      sections: [
        { heading: "أنماط الحروف اللاتينية", paragraphs: ["كل بطاقة اسمها مختلف: عريض، مائل، قوطي، أحرف صغيرة، فوق السطر وتحت السطر. جدول A إلى Z في صفحة الخطوط."] },
        { heading: "مع الرموز", paragraphs: ["الإطار والقلب والنجمة يلفّان الاسم الإنجليزي كما يلفّان العربي. مكتبة الرموز في صفحة الرموز."] },
        { heading: "فيسبوك وتيك توك وفري فاير", paragraphs: ["اسم العرض يقبل زخرفة أكثر من اسم المستخدم. فري فاير وصفحة فيسبوك وتيك توك تشرح كل حقل على حدة."] },
      ],
      faq: [
        { q: "كتبت بالعربية في هذه الصفحة", a: "الإطارات والتطويل تظهر. خطوط العريض والمائل تبقى للحروف اللاتينية." },
        { q: "هل هذا خط أثبّته؟", a: "لا. الحرف نفسه تغيّر داخل النص. لا يوجد ملف TTF للتنزيل." },
      ],
    },
    en: {
      title: "English name decoration",
      description: "Turn an English name into bold, italic, script, gothic, and circled letters you can copy.",
      h1: "English name styles",
      eyebrow: "English",
      lede: ["This page is for Latin names: bold, italic, script, gothic, circles, and squares. An Arabic name in the same field still receives frames and tatweel."],
      steps: stepsEn,
      sections: [
        { heading: "Latin letter styles", paragraphs: ["Each card has its own name: bold, italic, gothic, small caps, superscript, and subscript. The A to Z table is on the fonts page."] },
        { heading: "With symbols", paragraphs: ["Frames, hearts, and stars wrap an English name the same way they wrap Arabic. The symbol library is on the symbols page."] },
        { heading: "Facebook, TikTok, and Free Fire", paragraphs: ["A display name accepts more decoration than a username. The Facebook, TikTok, and Free Fire pages explain each field."] },
      ],
      faq: [
        { q: "I typed Arabic on this page", a: "Frames and tatweel still appear. Bold and italic apply to Latin letters." },
        { q: "Is this a font I install?", a: "No. The character inside the text changed. There is no TTF to download." },
      ],
    },
  },
  {
    slug: "arabic-english-names",
    category: "all",
    sample: "نور Nora",
    phrases: [
      { label: "نور Nora", text: "نور Nora" },
      { label: "Ali علي", text: "Ali علي" },
    ],
    tool: "generator",
    related: ["arabic-names", "english-names"],
    ar: {
      title: "زخرفة اسماء عربي وانجليزي",
      description: "اسم مختلط من عربي وإنجليزي في حقل واحد، كل حرف بأسلوبه.",
      h1: "زخرفة اسماء عربي وانجليزي",
      eyebrow: "الاثنان معاً",
      lede: ["اكتب الجزء العربي والجزء الإنجليزي معاً. التطويل يمس العربية، والعريض يمس اللاتينية، والإطار يلف الجملة كلها."],
      steps: stepsAr,
      sections: [
        { heading: "اسم من لغتين", paragraphs: ["«نور Nora» يُظهر التطويل على نور والخط العريض على Nora في بطاقات منفصلة. الإطار الواحد يحيط بالاثنين."] },
      ],
      faq: [{ q: "هل أنشئ حسابين؟", a: "لا. حقل واحد يكفي. اختر البطاقة التي تبقى مقروءة في التطبيق." }],
    },
    en: {
      title: "Arabic and English together",
      description: "A mixed Arabic and English name in one field, each letter in its own style.",
      h1: "Arabic and English name styles together",
      eyebrow: "Both scripts",
      lede: ["Type the Arabic part and the English part together. Tatweel touches Arabic, bold touches Latin, and a frame wraps the whole line."],
      steps: stepsEn,
      sections: [
        { heading: "One name, two scripts", paragraphs: ["“نور Nora” shows tatweel on the Arabic word and bold on Nora as separate cards. One frame surrounds both."] },
      ],
      faq: [{ q: "Do I need two accounts?", a: "No. One field is enough. Pick the card that stays readable in the app." }],
    },
  },
  {
    slug: "pubg-names",
    category: "games",
    sample: "صقر",
    phrases: [
      { label: "صقر", text: "صقر" },
      { label: "Nova", text: "Nova" },
      { label: "فهد", text: "فهد" },
    ],
    tool: "generator",
    limit: 7,
    limitHintAr: "كثير من الباحثين يطلبون اسماً من 7 أحرف. العداد ينبّه بعد ذلك. حد اللعبة نفسه يُختبر داخلها.",
    limitHintEn: "Many searches ask for a 7-character name. The counter notes when you pass that. The game’s own limit has to be tested inside the game.",
    related: ["free-fire-names", "game-names", "names-with-symbols"],
    ar: {
      title: "زخرفة اسماء ببجي",
      description: "أنماط قصيرة لأسماء ببجي بالعربية والإنجليزية، مع تنبيه عند تجاوز 7 أحرف.",
      h1: "زخرفة اسماء ببجي",
      eyebrow: "ببجي",
      lede: ["اسم ببجي يظهر في القائمة والقتل. الاسم القصير أوضح من إطار طويل. هذه الصفحة لا تضمن أن اللعبة ستقبل الرمز."],
      steps: stepsAr,
      sections: [
        { heading: "بالعربية", paragraphs: ["التطويل وإطار الجناح يناسبان اسماً عربياً قصيراً. التشكيل يغيّر الحروف وغالباً ما يُحذف في الألعاب."] },
        { heading: "بالإنجليزية", paragraphs: ["العريض والقوطي والمربع أوضح في شريط صغير. خط اليد الجميل قد يصير صعب القراءة."] },
        { heading: "سبعة أحرف", paragraphs: ["عبارة «7 حروف» بحث شائع. العداد يلون الرقم بعد الحرف السابع. هذا ليس وثيقة رسمية لحد اللعبة. الصق الاسم في ببجي وتأكد قبل التثبيت."] },
        { heading: "ماذا يبقى عادة؟", paragraphs: ["الأنماط قليلة الرموز تبقى أكثر من الأكوام. إذا رفضت الخانة الحفظ، احذف الإطار وجرّب العريض أو التطويل وحده. القبول يقرره إصدار اللعبة."] },
        { heading: "أسماء بنات", paragraphs: ["نور وليان وLuna أمثلة قصيرة. صفحة بنات وشباب فيها المزيد. القصر أهم من كثرة القلوب."] },
        { heading: "رموز", paragraphs: ["نجمة أو سيف واحد على الطرفين يكفي. مكتبة الرموز كاملة في صفحة الرموز. كل رمز يُحسب ضمن الطول."] },
      ],
      faq: [
        { q: "هل يقبل ببجي كل الزخارف؟", a: "لا. جرّب داخل اللعبة. ابدأ بنمط قصير." },
        { q: "هل أحتاج برنامج ببجي؟", a: "لا. انسخ من هنا والصق في خانة الاسم داخل اللعبة." },
      ],
    },
    en: {
      title: "PUBG name styles",
      description: "Short Arabic and English styles for PUBG names, with a note after 7 characters.",
      h1: "PUBG name styles",
      eyebrow: "PUBG",
      lede: ["A PUBG name shows in the lobby and the kill feed. A short name is clearer than a long frame. This page does not guarantee the game will accept a symbol."],
      steps: stepsEn,
      sections: [
        { heading: "Arabic", paragraphs: ["Tatweel and a wing frame suit a short Arabic name. Vowel marks change the letters and games often strip them."] },
        { heading: "English", paragraphs: ["Bold, gothic, and squared letters stay readable in a small bar. A delicate script can be hard to read."] },
        { heading: "Seven characters", paragraphs: ["“7 letters” is a common search. The counter changes color after the seventh character. That is not an official statement of the game’s limit. Paste the name in PUBG before you keep it."] },
        { heading: "What usually remains", paragraphs: ["Styles with few symbols survive more often than stacks. If the field refuses to save, drop the frame and try bold or tatweel alone. The game version decides."] },
        { heading: "Girls’ names", paragraphs: ["Noor, Layan, and Luna are short examples. The girls and boys page has more. Length matters more than extra hearts."] },
        { heading: "Symbols", paragraphs: ["One star or sword on each side is enough. The full set is on the symbols page. Every symbol counts toward the length."] },
      ],
      faq: [
        { q: "Does PUBG accept every style?", a: "No. Test it in the game. Start with a short style." },
        { q: "Do I need a PUBG app from this site?", a: "No. Copy from here and paste into the name field in the game." },
      ],
    },
  },
  {
    slug: "free-fire-names",
    category: "games",
    sample: "فهد",
    phrases: [
      { label: "فهد", text: "فهد" },
      { label: "VORTEX", text: "VORTEX" },
      { label: "غيم", text: "غيم" },
    ],
    tool: "generator",
    related: ["pubg-names", "game-names", "iphone-names"],
    ar: {
      title: "زخرفة اسماء فري فاير",
      description: "أسماء فري فاير بالعربية والإنجليزية: أسطورية، حروف كبيرة وصغيرة، ومسافات ورموز.",
      h1: "زخرفة اسماء فري فاير",
      eyebrow: "فري فاير",
      lede: ["اسم فري فاير يُقرأ بسرعة. القوطي العريض والنجمة أوضح من إطار مزدحم. القبول يُختبر في اللعبة."],
      steps: stepsAr,
      sections: [
        { heading: "أسماء أسطورية", paragraphs: ["القوطي وإطار السيف يعطيان طابعاً قوياً. أبقِ الكلمة قصيرة: فهد، VORTEX، غيم."] },
        { heading: "بالعربي", paragraphs: ["التطويل مع جناحين يناسب الاسم العربي. لا تضع تطويلاً بين الأرقام."] },
        { heading: "بالإنجليزي", paragraphs: ["العريض والقوطي والمربع هي البداية. خط اليد للنبذة ألطف منه لاسم قصير في اللعبة."] },
        { heading: "حروف كبيرة وصغيرة", paragraphs: ["الأحرف الصغيرة (small caps) أقصر بصرياً. الدوائر أوضح وأطول. جرّب الاثنين على الاسم نفسه."] },
        { heading: "المسافة والرموز", paragraphs: ["نمط الحروف المتباعدة يفصل الحروف بمسافة. كل مسافة وكل رمز يطيل الاسم. إذا رُفض الحفظ، احذف الرموز أولاً."] },
        { heading: "آيفون", paragraphs: ["انسخ الاسم، ثم في اللعبة اضغط مطولاً على الخانة واختر لصق. إن ظهر مربع، غيّر النمط. تفاصيل الآيفون في صفحته."] },
        { heading: "الكلانات وملف APK", paragraphs: ["أسماء الكلانات والرابطة في صفحة الألعاب الأخرى، ومنها كلاش أوف كلانس. لا يوجد ملف APK في هذا الموقع. الأداة تعمل في المتصفح."] },
      ],
      faq: [
        { q: "هل تقبل فري فاير الاسم؟", a: "بعض الأنماط تبقى وبعضها يُحذف. الصق داخل اللعبة قبل أن تعتمد الاسم." },
        { q: "أين أحصل على التطبيق؟", a: "من متجر جهازك. هذا الموقع لا يوزّع ملف تثبيت." },
      ],
    },
    en: {
      title: "Free Fire name styles",
      description: "Arabic and English Free Fire names: bold, gothic, spaced letters, and symbols.",
      h1: "Free Fire name styles",
      eyebrow: "Free Fire",
      lede: ["A Free Fire name is read quickly. Bold gothic and a single star are clearer than a crowded frame. Acceptance is tested in the game."],
      steps: stepsEn,
      sections: [
        { heading: "Legendary names", paragraphs: ["Gothic and a sword frame feel strong. Keep the word short: Fahad, VORTEX, Ghaym."] },
        { heading: "Arabic", paragraphs: ["Tatweel with wings suits an Arabic name. Digits never receive tatweel."] },
        { heading: "English", paragraphs: ["Start with bold, gothic, or squared letters. Script is kinder in a bio than in a short game name."] },
        { heading: "Large and small letters", paragraphs: ["Small caps look compact. Circled letters are clearer and longer. Try both on the same name."] },
        { heading: "Spaces and symbols", paragraphs: ["Spaced letters put a gap between characters. Every space and symbol lengthens the name. If saving fails, remove symbols first."] },
        { heading: "iPhone", paragraphs: ["Copy the name, then long-press the game field and choose Paste. If a box appears, switch styles. The iPhone page has the details."] },
        { heading: "Clans and APK files", paragraphs: ["Clan names, including Clash of Clans, are on the other-games page. This site has no APK. The tool runs in the browser."] },
      ],
      faq: [
        { q: "Will Free Fire keep the name?", a: "Some styles remain and some are stripped. Paste it in the game before you rely on it." },
        { q: "Where is the app?", a: "In your phone’s store. This site does not distribute an installer." },
      ],
    },
  },
  {
    slug: "game-names",
    category: "games",
    sample: "Nova",
    phrases: [
      { label: "Nova", text: "Nova" },
      { label: "صقر", text: "صقر" },
    ],
    tool: "generator",
    names: "clans",
    related: ["pubg-names", "free-fire-names"],
    ar: {
      title: "زخرفة اسماء للالعاب",
      description: "زخرفة أسماء فورت نايت ولودو وكول أوف ديوتي وروبلوكس وإيبك قيمز وكلاش أوف كلانس بأداة واحدة.",
      h1: "زخرفة اسماء للالعاب",
      eyebrow: "ألعاب أخرى",
      lede: ["ببجي وفري فاير لهما صفحتان. هنا بقية الألعاب التي يبحث عنها الناس، والأداة نفسها."],
      steps: stepsAr,
      sections: [
        { heading: "فورت نايت", paragraphs: ["الاسم القصير العريض أو القوطي يُقرأ في الاستوديو. الإطار الطويل يزاحم الاسم. جرّب داخل اللعبة."] },
        { heading: "لودو ويلا لودو", paragraphs: ["الأسماء الذهبية بالألوان في صفحة اللون والذهب هي بريق إيموجي، لا ذهباً مصوراً. للودو ابدأ بنجمة أو تاج."] },
        { heading: "كول أوف ديوتي", paragraphs: ["على الجوال والحاسوب القاعدة واحدة: الصق، وإن رُفض الحفظ فاختصر الرموز. لا حد رسمياً نعرضه هنا قبل تجربته."] },
        { heading: "روبلوكس", paragraphs: ["اسم العرض قد يقبل زخرفة. اسم المستخدم @ في روبلوكس يقتصر عادة على حروف وأرقام وشرطة سفلية. التفاصيل في صفحة أسماء المستخدمين."] },
        { heading: "إيبك قيمز", paragraphs: ["حساب إيبك يظهر في أكثر من لعبة. اختر نمطاً يبقى مفهوماً خارج فورت نايت أيضاً."] },
        { heading: "كلاش أوف كلانس", paragraphs: ["اسم الكلان يُقرأ من بعيد. VORTEX وصقر أمثلة قصيرة في القائمة أسفل الأداة. إطار السيف يكفي."] },
        { heading: "ألعاب أخرى", paragraphs: ["جواكر ودلتا فورس وستيم وموبايل ليجند وسول شيل تظهر في البحث بلا حجم مستقل. الأداة نفسها تزيّن الاسم. القبول داخل كل لعبة على حدة."] },
      ],
      faq: [{ q: "لماذا ليست كل لعبة في رابط؟", a: "النية واحدة: تزيين اسم قصير. الصفحات المنفصلة لببجي وفري فاير لأن البحث عنهما أكبر بكثير." }],
    },
    en: {
      title: "Name styles for other games",
      description: "Fortnite, Ludo, Call of Duty, Roblox, Epic, and Clash of Clans styles from one tool.",
      h1: "Name styles for other games",
      eyebrow: "Other games",
      lede: ["PUBG and Free Fire have their own pages. This page covers the other games people search for, with the same tool."],
      steps: stepsEn,
      sections: [
        { heading: "Fortnite", paragraphs: ["A short bold or gothic name is readable in the lobby. A long frame crowds it. Test it in the game."] },
        { heading: "Ludo and Yalla Ludo", paragraphs: ["“Gold” styles on the color page are sparkle emoji, not a painted gold image. For Ludo, start with a star or a crown."] },
        { heading: "Call of Duty", paragraphs: ["On mobile and PC the step is the same: paste, and if saving fails, remove symbols. No official limit is shown here until it has been checked."] },
        { heading: "Roblox", paragraphs: ["A display name may accept decoration. The Roblox @username is usually letters, digits, and underscore. See the usernames page."] },
        { heading: "Epic Games", paragraphs: ["An Epic account shows in more than one game. Pick a style that still makes sense outside Fortnite."] },
        { heading: "Clash of Clans", paragraphs: ["A clan name is read from far away. VORTEX and Saqr are short samples in the list under the tool. A sword frame is enough."] },
        { heading: "Other titles", paragraphs: ["Jawaker, Delta Force, Steam, Mobile Legends, and Soul Shield appear in searches without their own volume. The same tool decorates the name. Each game decides what it keeps."] },
      ],
      faq: [{ q: "Why is every game not its own URL?", a: "The job is the same: decorate a short name. PUBG and Free Fire have their own pages because the searches are much larger." }],
    },
  },
];

export const PAGES: readonly PageDef[] = [...CORE_PAGES, ...REST_PAGES];

export function getPage(slug: string): PageDef | undefined {
  return PAGES.find((page) => page.slug === slug);
}

export function contentPages(): readonly PageDef[] {
  return PAGES.filter((page) => page.slug.length > 0);
}
