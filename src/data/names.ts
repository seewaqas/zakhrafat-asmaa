export type ReadyName = {
  label: string;
  text: string;
  groups: readonly ("ready" | "people" | "clans" | "gulf" | "family")[];
};

export const READY_NAMES: readonly ReadyName[] = [
  { label: "صقر", text: "صقر", groups: ["ready", "people", "clans"] },
  { label: "نور", text: "نور", groups: ["ready", "people", "gulf"] },
  { label: "ليان", text: "ليان", groups: ["people", "gulf"] },
  { label: "جواد", text: "جواد", groups: ["people"] },
  { label: "غيم", text: "غيم", groups: ["ready", "people"] },
  { label: "ورد", text: "ورد", groups: ["people", "gulf"] },
  { label: "فهد", text: "فهد", groups: ["clans", "people"] },
  { label: "لينا", text: "لينا", groups: ["people"] },
  { label: "Nova", text: "Nova", groups: ["ready", "clans"] },
  { label: "Luna", text: "Luna", groups: ["ready", "people"] },
  { label: "VORTEX", text: "VORTEX", groups: ["clans"] },
  { label: "العنزي", text: "العنزي", groups: ["family"] },
  { label: "القحطاني", text: "القحطاني", groups: ["family"] },
  { label: "الجوهرة", text: "الجوهرة", groups: ["gulf", "people"] },
];
