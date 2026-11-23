# Patent Learning Lab

An interactive e-learning prototype that explains how patents are granted, step by step.
Learners choose a patent system and work through a short micro-course, practise with a realistic scenario and ask an AI tutor. A demo mode shows how instructors and admins could use learning data and manage the platform.

**Live demo:** https://gizemski.github.io/patent-learning-lab/

> **Demo mode, no real login.** The Learner, Instructor and Admin roles are switched with a button in the header. There is no authentication, and all learner and user data shown is fictional sample data.
>
> Concept prototype. Not affiliated with or endorsed by the European Patent Office or any other patent office named. The content is a simplified, entry-level summary and is not legal advice.

---

## Features

| | |
|---|---|
| **Patent system pathways** | Learners first choose a patent system. The **European patent** pathway is available; further pathways (PCT, USPTO, JPO, CNIPA, MOIP, DPMA, UKIPO) are shown as *coming soon*, and learners can register their interest. |
| **Micro-course** | Six short lessons on one visual timeline, from filing to opposition. Each lesson ends with one key takeaway. |
| **Scenario quiz** | Six questions based on a fictional start-up and its real deadlines, with instant feedback, explanations and a 70% pass mark. |
| **Certificate** | Unlocked after completing all lessons and passing the quiz. |
| **AI tutor (mock-up)** | Answers only from a curated set of approved sources and always shows the source. If it can't answer reliably, it says so and hands the question over to a human expert. |
| **My courses** | The selected course with its completion (percentage, status: not started, in progress or completed, and the next step), plus the learner's own progress: lesson timeline, lessons completed, best quiz score and certificate status. Learners see only their own data. |
| **Roles (demo mode)** | A *View as: Learner / Instructor / Admin* switcher in the header, labelled *Demo mode – no real login*. See [Roles](#roles-demo-mode) below. |
| **Instructor dashboard** | Course insights (completion, drop-off per lesson, difficulty per quiz question, learner regions) with each finding linked to a content change, a list of fictional demo learners and their progress, and a read-only content preview per lesson, optionally in all three languages side by side. Uses clearly labelled sample data. |
| **Admin area** | Switch each pathway between *available* and *coming soon*, change the roles of fictional users, and review an activity log. Pathways switched on without content show learners an *in preparation* page. |
| **Three languages** | English, German and French. |
| **Accessibility** | Keyboard navigation, skip link, visible focus, readable contrast and a table view for every chart. Works on mobile. |

## Roles (demo mode)

| Role | Sees |
|---|---|
| **Learner** | Home and pathway choice, *My courses* with the course (lessons, quiz, certificate), the AI tutor, *About*, and their own progress only. Never the instructor or admin views or other learners' data. |
| **Instructor** | The instructor dashboard (course insights, demo learners, content preview) and *About*. |
| **Admin** | Everything instructors see, plus pathway management, users and roles, and the activity log. |

**This is a demo without real authentication.** The role switcher stands in for a login. It only controls what the interface shows: on a static site anyone can choose any role, and all code and demo data can be downloaded. Pages a role may not open redirect to that role's start page. Real access control would need a server with authentication.

All demo learners, users, figures and log entries are fictional and labelled as sample data. Admin changes and the activity log are saved only in the visitor's browser (`localStorage`) and can be reset from the activity log.

## How it is built

- Plain HTML, CSS and JavaScript with no build step and no dependencies apart from web fonts. The JavaScript is split into classic scripts (no ES modules, no `fetch`), so the site works on GitHub Pages **and** when `index.html` is opened directly from disk:

```
index.html             page shell and script tags (order matters)
css/styles.css         all styles; colours, font, radii and spacing are CSS variables at the top
js/icons.js            simple line icons (ic())
js/i18n.js             interface strings in EN/DE/FR
js/pathways.js         list of patent-system pathways
js/content/epo.js      European pathway: lessons, quiz, sources, tutor knowledge base
js/demo-data.js        fictional sample data (insights, demo learners, users, log)
js/state.js            browser storage, roles and access check, activity log
js/views/learner.js    home, course, quiz, certificate, tutor, about
js/views/instructor.js instructor dashboard and shared chart/table helpers
js/views/admin.js      admin area
js/app.js              header, routing, events
```

- Content is organised as **modules per patent system**, all using the same structure (lessons, quiz, tutor knowledge base, analytics). Adding a new pathway means adding a new content module.
- Learner progress, the chosen role and the demo admin changes are stored only in the visitor's own browser (`localStorage`). No data is sent anywhere.
- The AI tutor is a mock-up that matches questions to a small, curated knowledge base. A production version could use retrieval-augmented generation (RAG) over approved content, with expert review and data-protection controls.

### Content workflow

```
Source  →  AI draft  →  Expert review  →  Accessibility check  →  Publish  →  Measure
```

AI speeds up drafting, but every fact is checked against official sources before publishing, and learner data feeds the next revision.

## Run it locally

No installation needed. Download or clone the repository and open `index.html` in any modern browser, or serve the folder with any static web server (for example `python3 -m http.server`).

```bash
git clone https://github.com/gizemski/patent-learning-lab.git
```

## Roadmap

- [ ] Add further patent system pathways, starting with the international (PCT) route
- [ ] Interactive deadline calculator
- [ ] AI tutor based on retrieval over approved sources
- [ ] Learning-progress tracking via open e-learning standards (xAPI)
- [ ] Short video or animated explainers per lesson

## Sources (European patent pathway)

- [EPO – Applying for a patent: the basics](https://epo.org/applying/basics.html)
- [EPO – How to apply for a patent](https://www.epo.org/en/new-to-patents/how-to-apply-for-a-patent)
- [European Patent Guide, 5.4.1 Request for examination](https://www.epo.org/en/legal/guide-epc/2024/ga_c5_4_1.html)
- [European Patent Convention, Art. 99 (Opposition)](https://www.epo.org/en/legal/epc/2020/a99.html)
- [Guidelines for Examination, General Part](https://epo.org/en/legal/guidelines-epc/2024/foreword_5.html)
- [EPO – Oppositions](https://epo.org/en/applying/european/oppositions)

## Author

Created by **Gizem Yörür**.

© 2026 Gizem Yörür. All rights reserved.
