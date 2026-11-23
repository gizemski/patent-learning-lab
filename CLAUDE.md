# CLAUDE.md

Guidance for working on **Patent Learning Lab**, a multilingual (English, German, French) e-learning prototype that explains patent grant procedures.

## What this project is

- One self-contained `index.html` (HTML, CSS, plain JavaScript). No framework, no bundler, no npm, no build step.
- Hosted on **GitHub Pages from the `main` branch**. Whatever is in `index.html` on `main` is the live site.
- Learners first choose a patent system (`PATHWAYS`). Only the **European patent** pathway (`id: "epo"`, `avail: true`) has content. All other pathways are shown as *coming soon* and only let learners register interest.
- Learner progress is stored only in the visitor's browser (`localStorage`, key `patent-learning-lab-v1`). Nothing is sent to any server.

## Where things live in `index.html`

| Block | Purpose |
|---|---|
| `UI` | Interface strings, one object per language (`en`, `de`, `fr`) |
| `PATHWAYS`, `PX` | Patent-system list and pathway-picker strings |
| `LESSONS` | Micro-course lessons (title, timing, body per language) |
| `SCENARIO`, `QUIZ` | Fictional scenario and quiz questions, options, answers, explanations |
| `SRC` | Official sources the content and tutor answers cite |
| `KB` | Mock AI-tutor knowledge base (keywords, answer per language, `src` key) |
| `DATA` | Sample data for the learning-insights charts |
| `render()` + view functions | `home`, `course`, `tutor`, `insights`, `about`; hash routing in `route()` |

Helpers: `T()` returns the current `UI` language object, `L(obj)` picks the current language from an `{en,de,fr}` object, `esc()` escapes HTML.

## Rules

### 1. Every patent-law fact is checked against official sources

- Before adding or changing any fact about patent law or procedure (deadlines, fees, who may act, languages, stages, durations), check it against an **official source**: the legal text (e.g. EPC articles and rules), the patent office's own guides and guidelines, or its official website.
- Every source used must be listed in the sources section: add it to `SRC`, make sure it appears on the About page, and keep the **Sources** list in `README.md` in sync.
- Each tutor answer in `KB` must point to the `SRC` entry that supports it.
- Link to the specific page or article, not just a home page. Prefer the current edition of guidelines and guides, and update links when a newer edition replaces them.
- If a fact cannot be verified, do not add it. Ask instead.
- Keep the content an entry-level summary. It is not legal advice, and the disclaimer saying so must stay.

### 2. The site stays neutral

- No references to any employer, company, organisation, job role, job application, or existing internal system or tool. Do not frame the prototype as made for, or pitched to, anyone.
- Patent offices and treaties are the **subject matter**, so they may be named where the content is about their procedure, and their official publications may be cited as sources. Keep the existing "not affiliated with or endorsed by" disclaimer.
- No logos or branding of real organisations.

### 3. Every user-facing text exists in all three languages

- Every visible string, `aria-label`, `placeholder`, `alt` text, tooltip, chart label, table header and error or feedback message needs `en`, `de` and `fr` versions. Never leave one language out or fall back to English silently.
- Add strings to the right place (`UI`, `PX`, or an `{en,de,fr}` object inside the content). Do not hard-code text in templates.
- Use correct legal terms in each language, as used in that language version of the official sources (e.g. EPO / EPA / OEB, EPC / EPÜ / CBE).
- Follow each language's typography (for example a space before `:` `;` `?` `!` in French, and `%` spacing per locale).
- German uses the informal "du", matching the existing text. French uses "vous".
- After a change, switch through EN, DE and FR and check that nothing is missing or broken.

### 4. Keep it accessible

- **Keyboard:** every interactive element can be reached and used with the keyboard, in a logical order. Use real `<button>`, `<a>`, `<input>` elements, not clickable `<div>`s. Keep the skip link working.
- **Visible focus:** never remove focus outlines without a clearly visible replacement.
- **Contrast:** text and meaningful UI elements meet WCAG 2.2 AA contrast (4.5:1 for body text, 3:1 for large text and UI components). Do not convey meaning by colour alone.
- **Charts:** every chart has a table view (`chartCard` with its *Show table* toggle) and a text alternative (`role="img"` with a descriptive `aria-label`). Any new chart must follow the same pattern.
- **Dynamic content:** quiz feedback, tutor replies and results are announced via `aria-live`. Toggle buttons use `aria-pressed`; the current page in the navigation uses `aria-current`.
- Set `<html lang>` to the active language (done in `shell()`).
- **Mobile:** the layout must work on small screens (about 320 px wide and up) with no horizontal scrolling, readable text and touch targets that are large enough. Check the responsive breakpoints after layout changes.

### 5. Sample data is always labelled as sample data

- Any figure that is not real (the insights dashboard, KPIs, charts, example statistics) must be visibly labelled as sample data on the same screen, in all three languages (see `sampleLbl` and the `.sample` badge).
- Never present sample numbers as real learner, office or market statistics.
- The quiz scenario and its people are fictional; keep them clearly fictional.

### 6. Keep it working on GitHub Pages with no build step

- The site must keep working by opening `index.html` directly in a browser and when served by GitHub Pages from `main`.
- No build tools, package managers, transpilers or server-side code. No new runtime dependencies. The only external resource is Google Fonts; the site must still be usable if fonts fail to load.
- Use relative paths only. Do not rename or move `index.html`.
- Keep the code to plain modern JavaScript that runs in current browsers without compilation.

## Adding a new patent-system pathway

Pathways share one structure: lessons, quiz, tutor knowledge base, sources and analytics. To make a *coming soon* pathway available, add its content in the same shape as the European pathway, set `avail: true` and a `desc`, and apply every rule above: verified official sources, all three languages, accessible, sample data labelled.

## Before finishing a change

- [ ] Patent-law facts checked against official sources, and listed in `SRC`, the About page and `README.md`
- [ ] No references to employers, organisations (other than the patent offices as subject matter), job roles, applications or internal systems
- [ ] All new or changed text present in EN, DE and FR
- [ ] Keyboard, focus, contrast, chart table views and mobile layout still work
- [ ] Sample data labelled as such
- [ ] Opens directly in a browser with no build step; no console errors
