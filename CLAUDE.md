# CLAUDE.md

Guidance for working on **Patent Learning Lab**, a multilingual (English, German, French) e-learning prototype that explains patent grant procedures.

## What this project is

- Plain HTML, CSS and JavaScript split into a few files (see below). No framework, no bundler, no npm, no build step.
- Hosted on **GitHub Pages from the `main` branch**. Whatever is on `main` is the live site.
- Three roles, **Learner**, **Instructor** and **Admin**, switched in the header. This is a **demo mode with no real login or authentication** (see rule 7).
- Learners first choose a patent system (`PATHWAYS`). Only the **European patent** pathway (`id: "epo"`, `avail: true`) has content. All other pathways are shown as *coming soon* and only let learners register interest.
- Learner progress and the chosen role are stored only in the visitor's browser (`localStorage`, key `patent-learning-lab-v1`). Demo admin changes and the activity log use a separate key, `patent-learning-lab-demo-v1`. Nothing is sent to any server.
- A pathway is *available* when `avail: true` (or when an admin switched it on in the demo) and has content when `content: true`. An available pathway without content shows learners an "in preparation" page (`prepView()`), never an empty course.

## Where things live

| File | Contents |
|---|---|
| `index.html` | Page shell (header with language and role switchers, `<main>`, footer) and the `<script>` tags. **Load order matters.** |
| `css/styles.css` | All styles |
| `js/i18n.js` | `UI` (interface strings), `PX` (pathway picker), `RX` (roles, dashboards, demo mode, activity-log texts), each `{en,de,fr}` |
| `js/pathways.js` | `PATHWAYS` list (`avail`, `content`, office and name per language) |
| `js/content/epo.js` | European pathway: `LESSONS`, `SCENARIO`, `QUIZ`, `SRC`, `KB`. One file per pathway with content (`js/content/<id>.js`) |
| `js/demo-data.js` | Fictional sample data: `DATA` (insights), `PERSONAS`, `DEMO_LEARNERS`, `DEMO_USERS`, `DEMO_LOG_SEED` |
| `js/state.js` | Learner state `S`, roles (`ROLES`, `PAGES`, `ROLE_HOME`, `canView()`), demo state `D`, `logEv()`, `pathAvail()`, `pathReady()` |
| `js/views/learner.js` | `home`, `myProgress`, `prepView`, `course`, quiz, certificate, `tutor`, `about` |
| `js/views/instructor.js` | Chart and table helpers (`chartCard`, `rtable`, `subnav`, `dashHead`) and the `instructor` dashboard |
| `js/views/admin.js` | `admin` area: pathways, users and roles, activity log |
| `js/app.js` | `shell()`, `render()`, `route()` with the access check, event handling |

Helpers: `T()`, `P()` and `R()` return the current language object of `UI`, `PX` and `RX`; `L(obj)` picks the current language from an `{en,de,fr}` object; `esc()` escapes HTML.

Routes are hashes: `#home`, `#course`, `#tutor`, `#about`, `#instructor[/insights|learners|preview[/<lesson>|quiz]]`, `#admin[/pathways|users|log]`.

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
- **Tables:** give every data table a `<caption>` and header cells with `scope`. Wide tables use `rtable()`, which turns rows into stacked cards on phones while keeping table semantics.
- **Charts:** every chart has a table view (`chartCard` with its *Show table* toggle) and a text alternative (`role="img"` with a descriptive `aria-label`). Any new chart must follow the same pattern.
- **Dynamic content:** quiz feedback, tutor replies and results are announced via `aria-live`. Toggle buttons use `aria-pressed`; the current page in the navigation uses `aria-current`.
- Set `<html lang>` to the active language (done in `shell()`).
- **Mobile:** the layout must work on small screens (about 320 px wide and up) with no horizontal scrolling, readable text and touch targets that are large enough. Check the responsive breakpoints after layout changes.

### 5. Sample data is always labelled as sample data

- Any figure or person that is not real (insights, KPIs, charts, demo learners, demo users, activity log) must be visibly labelled as sample data on the same screen, in all three languages (see `sampleLbl` and the `.sample` badge).
- Never present sample numbers as real learner, office or market statistics.
- The quiz scenario and its people are fictional; keep them clearly fictional.
- Demo names must be obviously invented placeholders (for example "Ines Example", "Ben Sample") and marked *fictional*. Never use real people, real e-mail addresses or real organisations.

### 6. Keep it working on GitHub Pages with no build step

- The site must keep working by opening `index.html` directly in a browser and when served by GitHub Pages from `main`.
- No build tools, package managers, transpilers or server-side code. No new runtime dependencies. The only external resource is Google Fonts; the site must still be usable if fonts fail to load.
- Use relative paths only. Do not rename or move `index.html`.
- Keep the code to plain modern JavaScript that runs in current browsers without compilation.
- Use **classic `<script src>` files only**: no ES modules (`type="module"`) and no `fetch()` of local JSON, because both fail when `index.html` is opened from disk. Store data as `.js` files. Add every new file to the script list in `index.html` in the right order (data before views, `js/app.js` last).

### 7. Roles are a demo, not security

- There is **no real login or authentication**. The header must always show the *Demo mode – no real login* label, and Instructor and Admin views show the demo banner.
- Never add password fields, sign-in forms, real user accounts or any collection of real personal data. Keep everything in the visitor's browser.
- Every role-restricted page goes through the access check (`PAGES` and `canView()` in `js/state.js`, enforced in `route()` and `render()`). When you add a page, add it to `PAGES` for exactly the roles that may see it.
- Learner views show only the learner's own progress. Never render demo learners, users, the activity log or course-wide insights in a learner view.
- Be honest about limits: on a static site anyone can pick any role and read all code and data. Do not describe the demo as secure or as real access control.

## Adding a new patent-system pathway

Pathways share one structure: lessons, quiz, tutor knowledge base, sources and analytics. To make a *coming soon* pathway available, add its content in the same shape as the European pathway in `js/content/<id>.js`, add the script to `index.html`, set `avail: true`, `content: true` and a `desc`, and apply every rule above: verified official sources, all three languages, accessible, sample data labelled. (The views currently read the European content globals directly; a second content pathway needs them to look up content by pathway id.)

## Before finishing a change

- [ ] Patent-law facts checked against official sources, and listed in `SRC`, the About page and `README.md`
- [ ] No references to employers, organisations (other than the patent offices as subject matter), job roles, applications or internal systems
- [ ] All new or changed text present in EN, DE and FR
- [ ] Keyboard, focus, contrast, chart table views and mobile layout still work
- [ ] Sample data and demo people labelled as such
- [ ] Role access still correct: learners cannot open instructor or admin pages, and the demo-mode label is visible
- [ ] Opens directly in a browser with no build step; no console errors
