const HAS_ARABIC = /\p{Script=Arabic}/u;

function ideas(raw: string): string[] {
  const base = raw.toLocaleLowerCase("en").replace(/[^a-z0-9]/g, "");
  if (base.length < 2) return [];
  const cut = base.slice(0, 15);
  const list = [cut, `the${cut}`.slice(0, 18), `${cut}hq`.slice(0, 18)];
  return [...new Set(list)].filter((item) => /^[a-z0-9._]+$/.test(item));
}

export function mountUsernames(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>("[data-user-input]");
  const list = root.querySelector<HTMLElement>("[data-user-list]");
  const arabicNote = root.querySelector<HTMLElement>("[data-user-arabic]");
  if (!input || !list) return;

  const render = (): void => {
    const value = input.value.trim();
    if (arabicNote) arabicNote.hidden = !HAS_ARABIC.test(value);
    list.replaceChildren();
    if (HAS_ARABIC.test(value)) return;
    for (const idea of ideas(value)) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.dataset.copyText = idea;
      button.dataset.copiedLabel = root.dataset.copiedLabel ?? "✓";
      button.textContent = idea;
      item.append(button);
      list.append(item);
    }
  };

  input.addEventListener("input", render);
  render();
}
