# E-Champions Result Manager

Live site: https://dia16.github.io/E-Championsv10/

A single-file school result and report card management system for E-Champions Nursery and Primary School, Omu-Aran, Kwara State. Built with vanilla HTML/CSS/JavaScript and Firebase (Authentication + Firestore) — no build step, no framework, one `index.html` file.

**Current version:** v16.0 (deployed 2026-08-19 04:25 UTC)

---

## What it does

**For teachers**
- Log in and enter Test 1, Test 2, and Exam scores per subject for their assigned class
- Auto-calculated totals, grades, and class positions
- Psychomotor and Affective skill ratings, class teacher's comment
- Print report cards and export class results to CSV
- Continuous autosave — nothing is lost if the app closes mid-entry

**For admins**
- Dashboard across every class, with search
- Edit any teacher's data directly
- Create teacher accounts one at a time or in bulk (paste a list, get auto-generated passwords)
- Set up a class's pupil roster by pasting names, or copy last term's roster forward
- Full control over subjects per class — add, remove, reduce, copy between classes, or save as a reusable template
- Edit the class list, grading scale, score labels, psychomotor/affective skill lists, and rating-scale legend — all without touching code
- Rename a class and safely move all of its data (results, fees, comments, subjects) to the new name
- Permanently delete a class and everything filed under it, with a type-to-confirm safety check
- One-level undo per class (a snapshot is taken automatically the moment a class is opened for editing)
- Export a full JSON backup of the entire database on demand
- Head Teacher comment bank organized by grade band
- Per-class fee overrides, school-wide settings, activity log

## Tech stack

- Plain HTML, CSS, and JavaScript — everything lives in `index.html`
- [Firebase Authentication](https://firebase.google.com/docs/auth) for teacher/admin login
- [Cloud Firestore](https://firebase.google.com/docs/firestore) for all data storage
- Hosted on [GitHub Pages](https://pages.github.com/)

## Repository contents

| File | Purpose |
|---|---|
| `index.html` | The entire application |
| `firestore.rules` | Firestore security rules — publish these in the Firebase Console, they are not applied automatically from this repo |

## Setup (for a fresh deployment)

1. Create a Firebase project, enable **Authentication → Email/Password** and **Firestore Database**
2. Copy your Firebase config into the `firebaseConfig` object near the top of `index.html`
3. Publish `firestore.rules` in Firebase Console → Firestore Database → Rules
4. In Firebase Console → Authentication → Settings → Authorized domains, add your GitHub Pages domain (e.g. `dia16.github.io`)
5. Push `index.html` to this repo's GitHub Pages branch
6. Create your first admin account manually in Firestore (`users/{uid}` with `role: "admin"`), since the app has no public sign-up

## Updating the live site

Replace `index.html` in this repo with the new version and commit/push to the Pages branch. Changes go live within about a minute. The version number and deploy timestamp shown in the app's footer, login screen, and CSV exports should be updated with each release so you can confirm what's actually live.

## Data model (Firestore collections)

- `users` — teacher and admin accounts (`role`, `assignedClasses`)
- `settings/school` — school-wide configuration (name, session, classes, grading scale, skill lists, etc.)
- `classdata` — pupil results, one document per class per session/term
- `classdata_history` — one-level undo snapshots, admin-readable only
- `classfees`, `commentbank`, `classsubjects` — per-class overrides for fees, head teacher comments, and subjects
- `subjecttemplates` — reusable named subject lists

## Security

Firestore rules restrict teachers to only the classes assigned to them and restrict all configuration changes (settings, fees, comments, subjects, class rename/delete) to admin accounts. Confirm `firestore.rules` is actually published in the Firebase Console before putting real pupil data into a new deployment — an unpublished ruleset leaves the database open to any signed-in user.

## Built by

EDA-NI-MI
