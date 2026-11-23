# Patent Learning Lab

An interactive e-learning prototype that explains how patents are granted, step by step.
Learners choose a patent system and work through a short micro-course, practise with a realistic scenario, ask an AI tutor and see how learning data can be used to improve the content.

**Live demo:** https://gizemski.github.io/patent-learning-lab/

> Concept prototype. Not affiliated with or endorsed by the European Patent Office or any other patent office named. The content is a simplified, entry-level summary and is not legal advice.

---

## Features

| | |
|---|---|
| **Patent system pathways** | Learners first choose a patent system. The **European patent** pathway is available; further pathways (PCT, USPTO, JPO, CNIPA, MOIP, DPMA, UKIPO) are shown as *coming soon*, and learners can register their interest. |
| **Micro-course** | Six short lessons on one visual timeline, from filing to opposition. Each lesson ends with one key takeaway. |
| **Deadline calculator** | Learners enter a filing date and, optionally, the earliest priority date, plus the dates of the search-report and grant mentions once known. Key dates appear on a visual timeline (with a table view), each marked as calculated or depending on an event the learner enters. A learning tool, not legal advice. |
| **Scenario quiz** | Six questions based on a fictional start-up and its real deadlines, with instant feedback, explanations and a 70% pass mark. |
| **Certificate** | Unlocked after completing all lessons and passing the quiz. |
| **AI tutor (mock-up)** | Answers only from a curated set of approved sources and always shows the source. If it can't answer reliably, it says so and hands the question over to a human expert. |
| **Learning insights** | A dashboard showing drop-off per lesson, question difficulty and learner regions, with each finding linked to a concrete content change. Uses clearly labelled sample data. |
| **Three languages** | English, German and French. |
| **Accessibility** | Keyboard navigation, skip link, visible focus, readable contrast and a table view for every chart. Works on mobile. |

## How it is built

- A single, self-contained `index.html` file: HTML, CSS and plain JavaScript, with no build step and no dependencies apart from web fonts.
- Content is organised as **modules per patent system**, all using the same structure (lessons, quiz, tutor knowledge base, analytics). Adding a new pathway means adding a new content module.
- Learner progress is stored only in the visitor's own browser (`localStorage`). No data is sent anywhere.
- The AI tutor is a mock-up that matches questions to a small, curated knowledge base. A production version could use retrieval-augmented generation (RAG) over approved content, with expert review and data-protection controls.

### Content workflow

```
Source  →  AI draft  →  Expert review  →  Accessibility check  →  Publish  →  Measure
```

AI speeds up drafting, but every fact is checked against official sources before publishing, and learner data feeds the next revision.

## Run it locally

No installation needed. Download or clone the repository and open `index.html` in any modern browser.

```bash
git clone https://github.com/gizemski/patent-learning-lab.git
```

## Roadmap

- [ ] Add further patent system pathways, starting with the international (PCT) route
- [x] Interactive deadline calculator
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
- [European Patent Convention, Art. 93 (Publication of the European patent application)](https://www.epo.org/en/legal/epc/2020/a93.html)
- [European Patent Convention, Rule 70 (Request for examination)](https://www.epo.org/en/legal/epc/2020/r70.html)
- [Rules relating to Unitary Patent Protection, Rule 6 (Request for unitary effect)](https://www.epo.org/en/legal/up-upc/2022/upr_6.html)
- [European Patent Convention, Art. 87 (Priority right)](https://www.epo.org/en/legal/epc/2020/a87.html)
- [European Patent Convention, Rule 131 (Calculation of periods)](https://www.epo.org/en/legal/epc/2020/r131.html)
- [European Patent Convention, Rule 134 (Extension of periods)](https://www.epo.org/en/legal/epc/2020/r134.html)

## Author

Created by **Gizem Yörür**.

© 2026 Gizem Yörür. All rights reserved.
© 2026 Gizem Yörür. All rights reserved.
