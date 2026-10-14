export type SymbolGroup = {
  id: string;
  ar: string;
  en: string;
  symbols: readonly string[];
};

export const SYMBOL_GROUPS: readonly SymbolGroup[] = [
  { id: "crowns", ar: "تيجان", en: "Crowns", symbols: ["♛", "♕", "♔", "♚"] },
  { id: "stars", ar: "نجوم", en: "Stars", symbols: ["★", "☆", "✦", "✧", "✩", "✪"] },
  { id: "hearts", ar: "قلوب", en: "Hearts", symbols: ["♡", "♥", "❥", "❣"] },
  { id: "flowers", ar: "زهور", en: "Flowers", symbols: ["✿", "❀", "❁", "✾"] },
  { id: "games", ar: "ألعاب", en: "Games", symbols: ["⚔", "☠", "⚡", "🔥"] },
  { id: "brackets", ar: "أقواس", en: "Brackets", symbols: ["『", "』", "【", "】", "꧁", "꧂", "༺", "༻"] },
  { id: "emoji-games", ar: "إيموجي ألعاب", en: "Game emoji", symbols: ["🎮", "🔥", "⚔️", "💀", "🏆", "🎯"] },
  { id: "emoji-soft", ar: "إيموجي هادئ", en: "Soft emoji", symbols: ["✨", "🌙", "🤍", "☁️", "🦋", "🌸"] },
  { id: "emoji-hearts", ar: "إيموجي قلوب", en: "Heart emoji", symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜"] },
  { id: "emoji-nature", ar: "إيموجي طبيعة", en: "Nature emoji", symbols: ["🌿", "🌸", "🌊", "🍃", "🌻", "🦋"] },
];
