import { stripTashkeel } from "../lib/arabic.ts";
import { categoryLabel, styleApplies, styleName, STYLES, type Locale } from "../lib/styles.ts";
import { clampInput, graphemes, visibleLength, MAX_INPUT_GRAPHEMES } from "../lib/transform.ts";

const FAV_KEY = "za-favorites";

function readFavs(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function writeFavs(favs: Set<string>): void {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  } catch {
    /* Private mode can block storage. The star still toggles for this visit. */
  }
}

async function writeClipboard(text: string): Promise<boolean> {
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
  area.setAttribute("readonly", "");
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

function selectText(node: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function mountGenerator(root: HTMLElement): void {
  const input = root.querySelector<HTMLTextAreaElement>("[data-input]");
  const list = root.querySelector<HTMLElement>("[data-cards]");
  const note = root.querySelector<HTMLElement>("[data-sample-note]");
  const counter = root.querySelector<HTMLElement>("[data-counter]");
  const capNote = root.querySelector<HTMLElement>("[data-cap-note]");
  const toast = root.querySelector<HTMLElement>("[data-toast]");
  const empty = root.querySelector<HTMLElement>("[data-empty]");
  if (!input || !list || !counter) return;

  const locale = (root.dataset.locale === "en" ? "en" : "ar") as Locale;
  const sample = root.dataset.sample ?? "";
  const limitMax = Number(root.dataset.limitMax ?? "");
  const hasLimit = Number.isFinite(limitMax) && limitMax > 0;
  const copyLabel = root.dataset.copyLabel ?? "Copy";
  const copiedLabel = root.dataset.copiedLabel ?? "Copied";
  const errorLabel = root.dataset.errorLabel ?? "Error";
  const styles = new Map(STYLES.map((item) => [item.id, item]));
  const favs = readFavs();
  let category = root.dataset.category || "all";
  let toastTimer = 0;

  const showToast = (message: string): void => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  };

  const paintFav = (button: HTMLButtonElement, on: boolean): void => {
    button.setAttribute("aria-pressed", on ? "true" : "false");
    button.textContent = on ? "★" : "☆";
  };

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-fav]")) {
    const card = button.closest<HTMLElement>("[data-id]");
    paintFav(button, favs.has(card?.dataset.id ?? ""));
  }

  const render = (): void => {
    const raw = input.value;
    const limited = clampInput(raw);
    const capped = graphemes(raw).length > MAX_INPUT_GRAPHEMES;
    if (limited !== raw) input.value = limited;
    if (capNote) capNote.hidden = !capped;

    const usingSample = input.value.trim().length === 0 && sample.length > 0;
    const text = usingSample ? sample : input.value;
    if (note) note.hidden = !usingSample;

    const length = visibleLength(input.value);
    counter.textContent = `${length} ${root.dataset.countLabel ?? ""}`.trim();
    counter.classList.toggle("is-over", hasLimit && length > limitMax);

    let visible = 0;
    for (const card of list.querySelectorAll<HTMLElement>("[data-id]")) {
      const id = card.dataset.id ?? "";
      const style = styles.get(id);
      const output = card.querySelector<HTMLElement>("[data-output]");
      if (style && output) output.textContent = text.trim() ? style.apply(text) : "";

      const cats = card.dataset.cats ?? "";
      const categoryOk = category === "all" || (category === "favoritos" ? favs.has(id) : cats.split(" ").includes(category));
      const applies = style ? styleApplies(style, text) : false;
      const show = categoryOk && applies;
      card.hidden = !show;
      if (show) visible += 1;

      if (hasLimit && output) {
        const badge = card.querySelector<HTMLElement>("[data-len]");
        const outLen = visibleLength(output.textContent ?? "");
        if (badge) {
          badge.textContent = `${outLen}/${limitMax}`;
          badge.classList.toggle("is-over", outLen > limitMax);
        }
      }
    }
    if (empty) empty.hidden = visible > 0;
  };

  const flash = (button: HTMLButtonElement, ok: boolean): void => {
    button.textContent = ok ? copiedLabel : errorLabel;
    button.classList.toggle("is-copied", ok);
    window.setTimeout(() => {
      button.textContent = copyLabel;
      button.classList.remove("is-copied");
    }, 1600);
  };

  const copyCard = async (card: HTMLElement, button: HTMLButtonElement | null): Promise<void> => {
    const output = card.querySelector<HTMLElement>("[data-output]");
    const name = card.dataset.label ?? "";
    const text = output?.textContent ?? "";
    const ok = await writeClipboard(text);
    if (!ok && output) selectText(output);
    if (button) flash(button, ok);
    showToast(ok ? `${root.dataset.toastLabel ?? ""} «${name}»`.trim() : errorLabel);
  };

  input.addEventListener("input", render);

  root.querySelector<HTMLButtonElement>("[data-clear]")?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    render();
  });

  root.querySelector<HTMLButtonElement>("[data-decorate]")?.addEventListener("click", () => {
    list.scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  });

  root.querySelector<HTMLButtonElement>("[data-strip]")?.addEventListener("click", () => {
    input.value = stripTashkeel(input.value);
    render();
  });

  root.querySelector<HTMLButtonElement>("[data-copy-all]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const lines: string[] = [];
    for (const card of list.querySelectorAll<HTMLElement>("[data-id]")) {
      if (card.hidden) continue;
      const name = card.dataset.label ?? "";
      const text = card.querySelector<HTMLElement>("[data-output]")?.textContent ?? "";
      lines.push(`${name}\n${text}`);
    }
    const ok = await writeClipboard(lines.join("\n\n"));
    flash(button, ok);
  });

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-insert]")) {
    button.addEventListener("click", () => {
      const symbol = button.dataset.insert ?? "";
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      input.setRangeText(symbol, start, end, "end");
      input.focus();
      render();
    });
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-phrase]")) {
    button.addEventListener("click", () => {
      input.value = button.dataset.phrase ?? "";
      render();
    });
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-chip]")) {
    button.addEventListener("click", () => {
      category = button.dataset.chip ?? "all";
      for (const chip of root.querySelectorAll<HTMLButtonElement>("[data-chip]")) {
        chip.setAttribute("aria-pressed", chip === button ? "true" : "false");
      }
      render();
    });
  }

  list.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const fav = target.closest<HTMLButtonElement>("[data-fav]");
    const card = target.closest<HTMLElement>("[data-id]");
    if (!card) return;
    if (fav) {
      const id = card.dataset.id ?? "";
      if (favs.has(id)) favs.delete(id);
      else favs.add(id);
      writeFavs(favs);
      paintFav(fav, favs.has(id));
      if (category === "favoritos") render();
      return;
    }
    const copyButton = target.closest<HTMLButtonElement>("[data-copy]") ?? card.querySelector<HTMLButtonElement>("[data-copy]");
    void copyCard(card, copyButton);
  });

  for (const card of list.querySelectorAll<HTMLElement>("[data-id]")) {
    const style = styles.get(card.dataset.id ?? "");
    if (!style) continue;
    card.dataset.label = styleName(style, locale);
    const nameNode = card.querySelector<HTMLElement>("[data-name]");
    if (nameNode) nameNode.textContent = styleName(style, locale);
    const chipName = categoryLabel(style.categories[0] ?? "all", locale);
    card.dataset.group = chipName;
  }

  render();
}
