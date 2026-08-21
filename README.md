# E-Champions Result Manager

Live site: https://dia16.github.io/E-Championsv10/

A single-file school result and report card management system built for E-Champions Nursery and Primary School, Omu-Aran, Kwara State. Plain HTML, CSS, and JavaScript — no build step, no framework, no npm install — backed by Firebase (Authentication + Firestore). The entire application is one file: `index.html`.

**Current version:** v17 (deployed 2026-08-21 19:40 UTC)

**Versioning:** whole-number releases only — v17, v18, v19, and so on. No decimal/point releases.

---

## Table of contents

- [What it does](#what-it-does)
- [Tech stack](#tech-stack)
- [Repository contents](#repository-contents)
- [Setup — fresh deployment](#setup--fresh-deployment)
- [Updating the live site](#updating-the-live-site)
- [Data model](#data-model-firestore-collections)
- [Roles and permissions](#roles-and-permissions)
- [Security](#security)
- [Known limitations](#known-limitations)
- [Built by](#built-by)

---

## What it does

### For teachers
- Log in and enter Test 1, Test 2, and Exam scores per subject for their assigned class(es)
- Auto-calculated subject totals, grades, class averages, and class positions
- Psychomotor Skills and Affective Development ratings per pupil
- Class Teacher's Comment per pupil, and a school-wide Head Teacher's Comment auto-assigned from a comment bank matched to each pupil's grade band
- Continuous autosave — nothing is lost if the app closes mid-entry
- Print individual or whole-class report cards, one page per pupil
- Export class results to CSV
- "Before you print" check flags unnamed pupils or obviously incomplete records before printing

### For admins
**Dashboard & data**
- Overview across every class at once, with search
- Edit any teacher's data directly, including a one-level undo (a snapshot is taken automatically the instant a class is opened for editing, so a mistake made in that session can be reverted)
- Export a full JSON backup of the entire database on demand
- Delete a class and everything filed under it (results, fees, comments, subjects, undo history) with a type-to-confirm safety check
- Rename a class and safely move all of its data to the new name, using atomic two-phase batched writes so a failure partway through can't leave data split between the old and new name

**Teachers & rosters**
- Create teacher accounts one at a time, or in bulk (paste a list of name/email/class lines, get auto-generated passwords and a results screen to copy and share)
- Set up a class's pupil roster by pasting names, or copy the previous term's roster forward at promotion time
- Activity log of admin actions (renames, deletions, bulk operations, settings changes)

**Subjects, grading, and skills — all admin-editable, no code changes required**
- Subjects per class: add, remove, or reduce freely; copy another class's subject list; save a subject list as a reusable named template and apply it anywhere
- The class list itself
- Grading scale — the minimum score and remark for each of grades A–F
- Score component labels (e.g. renaming "Test 1"/"Test 2"/"Exam"); the underlying 20/20/60 weighting stays fixed since it's baked into every stored score
- Psychomotor and Affective skill lists — rename, add, or remove skills; renaming a skill that's already in use keeps its existing ratings attached
- The rating-scale legend text printed on the report card

**Report card layout — school-wide, applies to every class**
- Show or hide the school logo
- Show or hide the Psychomotor & Affective tables
- Font: Times New Roman, Georgia, or Arial
- Line/border colour: any colour
- Spacing: Compact, Normal, or Relaxed
- Logo size: Small, Medium, or Large
- Text size adjustment: Smaller, Normal, or Larger (bounded — can never push a report card past one page)
- Class Teacher's and Head Teacher's comment boxes start at a 3-line minimum and grow to fit longer comments, capped at roughly 6 lines so an extreme outlier can't overflow onto a second page

**Fees & settings**
- Per-class fee overrides (falls back to the school-wide default when not set)
- School-wide settings: name, address, session, term, dates, fees, head teacher name and default comment, an announcement banner shown to all teachers on login

## Tech stack

- Plain HTML, CSS, and JavaScript — the entire app is `index.html` (~3,700 lines)
- [Firebase Authentication](https://firebase.google.com/docs/auth) (email/password) for login
- [Cloud Firestore](https://firebase.google.com/docs/firestore) for all data storage
- Hosted on [GitHub Pages](https://pages.github.com/)
- Report cards are generated as an HTML page and turned into a PDF using the browser's own Print → Save as PDF — there is no server-side PDF generation

## Repository contents

| File | Purpose |
|---|---|
| `index.html` | The entire application |
| `firestore.rules` | Firestore security rules — must be published manually in the Firebase Console; nothing in this repo applies them automatically |
| `README.md` | This file |

## Setup — fresh deployment

1. Create a Firebase project. Enable **Authentication → Email/Password** and **Firestore Database**.
2. Copy your Firebase config into the `firebaseConfig` object near the top of `index.html`.
3. Publish `firestore.rules` in Firebase Console → Firestore Database → Rules → paste → Publish. **Do this before putting real pupil data in** — with no rules published, Firestore defaults to open, and any signed-in account can read or write anything.
4. Firebase Console → Authentication → Settings → Authorized domains → add your GitHub Pages domain (e.g. `dia16.github.io`).
5. Push `index.html` to this repo's GitHub Pages branch.
6. Create your first admin account manually in Firestore: add a document to `users/{uid}` (the uid must match a real Firebase Auth user you've created) with `role: "admin"`. There is no public sign-up screen — every account is created by an existing admin, including the first one.

## Updating the live site

Replace `index.html` in this repo with the new version and commit/push. Changes go live in under a minute. The version number and deploy timestamp shown in the app's footer, login screen, and CSV exports are updated with every release, so you can always confirm what's actually live versus what's just been pushed.

## Data model (Firestore collections)

| Collection | Shape | Written by |
|---|---|---|
| `users` | One doc per account: `role`, `assignedClasses`, `assignedClass`, `email`, `displayName`, `lastLogin` | Admin (create/most fields); the account itself (`lastLogin` only) |
| `settings` | Single doc (`school`): all school-wide and report-card-layout configuration | Admin only |
| `classdata` | One doc per class per session/term: pupil list, scores, ratings, comments | Assigned teacher (own class only) and admin |
| `classdata_history` | One doc per class per session/term: a single "before this edit session" snapshot for one-level undo | Written as a side effect of opening a class; read only by admin |
| `classfees` | One doc per class: fee overrides | Admin only |
| `commentbanks` | One doc per class: Head Teacher comment pools by grade band | Admin only |
| `classsubjects` | One doc per class: subject list and religious-subject flag | Admin only |
| `subjecttemplates` | One doc per saved template: a reusable named subject list | Admin only |
| `activitylog` | One doc per logged admin action | Admin only |

## Roles and permissions

Two roles: `admin` and `teacher`. A teacher's Firestore user document lists `assignedClasses` — the only classes they can read or write `classdata` for. Every configuration collection (settings, fees, comment banks, subjects, templates) is readable by any signed-in account (teachers need this to print correctly) but writable by admins only.

## Security

Firestore rules enforce all of the above at the database level — the app's UI hiding a button is not what protects your data, the published rules are. Two things worth knowing:

- **Publish the rules.** An unpublished or default-open ruleset means any signed-in account can read or write anything, regardless of what the app's interface shows them.
- **Silent failures.** A denied write in this app fails quietly — there's no visible error, a save just doesn't stick. If a feature seems to "not save," check that `firestore.rules` matches what's in this repo before assuming it's an app bug.

## Known limitations

- No full drag-and-drop print layout editor — the Report Card Layout settings cover font, colour, spacing, logo size, and text size, not arbitrary repositioning
- One-level undo only, not a full version history, per class
- Score component weighting (20/20/60) is fixed; only the labels are editable
- Class rename/delete tools are not usable while offline — they depend on multi-step Firestore reads and atomic batched writes completing in sequence

## Built by

EDA-NI-MI
