export type BlankChar = {
  id: string;
  char: string;
  ar: string;
  en: string;
  noteAr: string;
  noteEn: string;
};

export const BLANKS: readonly BlankChar[] = [
  {
    id: "braille",
    char: "\u2800",
    ar: "فراغ برايل",
    en: "Braille blank",
    noteAr: "يظهر فراغاً في كثير من خانات الألعاب. بعض الألعاب تمنع الاسم الفارغ.",
    noteEn: "Often shows as a blank in game name fields. Some games block an empty name.",
  },
  {
    id: "zwnj",
    char: "\u200C",
    ar: "فاصل بلا عرض",
    en: "Zero-width non-joiner",
    noteAr: "حرف موجود بلا شكل ظاهر. مفيد أحياناً لسطر يبدو فارغاً في النبذة.",
    noteEn: "A character with no visible shape. Sometimes used for a line that looks empty in a bio.",
  },
  {
    id: "zwj",
    char: "\u200D",
    ar: "واصل بلا عرض",
    en: "Zero-width joiner",
    noteAr: "يُستخدم لربط الإيموجي المركّب. بعض الحقول تحذفه.",
    noteEn: "Used to join compound emoji. Some fields strip it.",
  },
  {
    id: "hair",
    char: "\u200A",
    ar: "مسافة شعرية",
    en: "Hair space",
    noteAr: "مسافة رفيعة جداً، أقرب إلى فراغ صغير من حرف مخفي.",
    noteEn: "A very thin space, closer to a tiny gap than a hidden letter.",
  },
  {
    id: "thin",
    char: "\u2009",
    ar: "مسافة رقيقة",
    en: "Thin space",
    noteAr: "أعرض قليلاً من المسافة الشعرية. تفصل رمزين دون مسافة عادية.",
    noteEn: "A little wider than a hair space. It separates two marks without a normal space.",
  },
  {
    id: "nbsp",
    char: "\u00A0",
    ar: "مسافة غير منقسمة",
    en: "No-break space",
    noteAr: "مسافة عادية لا تنكسر في آخر السطر.",
    noteEn: "A normal space that does not break at the end of a line.",
  },
];
