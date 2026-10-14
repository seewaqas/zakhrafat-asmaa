const THEME_KEY = "za-theme";

function mountTheme(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]");
  const apply = (theme: "light" | "dark"): void => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* The toggle still works for this visit. */
    }
  };
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      apply(next);
    });
  }
}

function mountNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.hasAttribute("data-open");
    if (open) nav.removeAttribute("data-open");
    else nav.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
  });
}

function mountSearch(): void {
  const openButton = document.querySelector<HTMLButtonElement>("[data-search-open]");
  const panel = document.querySelector<HTMLElement>("[data-search-panel]");
  const input = document.querySelector<HTMLInputElement>("[data-site-search]");
  if (!openButton || !panel || !input) return;
  const items = [...panel.querySelectorAll<HTMLAnchorElement>("a")];
  openButton.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) input.focus();
  });
  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase();
    for (const item of items) {
      const label = (item.dataset.label ?? item.textContent ?? "").toLocaleLowerCase();
      const row = item.closest("li");
      if (row) row.hidden = query.length > 0 && !label.includes(query);
    }
  });
}

async function copyPlain(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* Fall through. */
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.insetInlineStart = "-9999px";
  document.body.append(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

function mountPlainCopy(): void {
  document.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-text]");
    if (!button || button.closest("[data-generator]")) return;
    const text = button.dataset.copyText ?? "";
    void copyPlain(text).then((ok) => {
      const idle = button.dataset.idleLabel ?? button.textContent ?? "";
      button.dataset.idleLabel = idle;
      button.textContent = ok ? (button.dataset.copiedLabel ?? "✓") : idle;
      window.setTimeout(() => {
        button.textContent = idle;
      }, 1400);
    });
  });
}

mountTheme();
mountNav();
mountSearch();
mountPlainCopy();
