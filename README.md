# StudyHub

Subject-wise study app: notes, original slide pages, MCQ and short-answer practice, and a mock exam
that follows the university pattern (30 MCQ x 1 mark + 20 short x 2 marks = 70 marks).

## Deploy to Vercel

```bash
npx vercel login     # one time, opens the browser
npx vercel --prod    # deploys this folder (scripts/ is ignored via .vercelignore)
```

## Run it

```bash
npm install
npm run dev        # development, http://localhost:3000
npm run build && npm start   # production build
```

On a phone, open the same network address (for example `http://<your-pc-ip>:3000`) after running `npm run dev -- -H 0.0.0.0`.

## Subjects and content

- Subjects are registered in `src/lib/subjects.ts`.
- Each subject has units in `src/content/<subject>/unit-N.json`:
  - `topics`: notes (topic id, title, bullet points)
  - `mcq`: `{ id, topic, q, options[4], answer (0-3), explanation }`
  - `short`: `{ id, topic, q, answer, marks }`
- Slide pages are in `public/<subject>/pages/unit-N/pNNN.jpg`.

To add a new subject: add its JSON files, its slide images, and one entry in `src/lib/subjects.ts`.

## Where things are

- Practice: `/aoc/practice` (filter by unit and question type)
- Mock exam: `/aoc/mock` (60 minutes is the default; change `durationMinutes` in `src/app/[subject]/mock/page.tsx`)
- Unit notes and slides: `/aoc/unit/unit-1` ... `unit-5`
- Progress is stored in this browser's localStorage only.

## Notes on the content

- The source PDFs were scanned images. Text was read from the slides with OCR and then checked by hand.
  Questions and answers were written from that text, so **check anything that looks wrong against the slides** before the exam.
- Extra questions for each unit are in `src/content/aoc/unit-N-extra.json` and are merged automatically.
- Scripts used for extracting and OCR-ing the pages are in `scripts/ocr-tools/` (not deployed).
