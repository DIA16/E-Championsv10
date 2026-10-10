# E-Champions Result Manager

Live site: https://dia16.github.io/E-Championsv10/

A school result and report card management system built for E-Champions Nursery and Primary School, Omu-Aran, Kwara State. Plain HTML, CSS, and JavaScript with no build step, no framework and no npm install, backed by Firebase (Authentication + Firestore). The whole application is one file: `index.html`.

**Current version:** v18 (deployed 2026-10-09 02:49 UTC)

**Versioning:** whole-number releases only: v18, v19, v20, and so on. No decimal or point releases.

---

## Table of contents

- [What it does](#what-it-does)
- [What is new in v18](#what-is-new-in-v18)
- [Tech stack](#tech-stack)
- [Repository contents](#repository-contents)
- [Setup: fresh deployment](#setup-fresh-deployment)
- [Updating the live site](#updating-the-live-site)
- [Data model](#data-model-firestore-collections)
- [Roles and permissions](#roles-and-permissions)
- [Security](#security)
- [Backup and recovery](#backup-and-recovery)
- [Known limitations](#known-limitations)
- [Built by](#built-by)

---

## What it does

### For teachers
- Log in and enter Test 1, Test 2, and Exam scores per subject for their assigned class(es)
- Auto-calculated subject totals, grades, class averages, and class positions
- Psychomotor Skills and Affective Development ratings per pupil
- Class Teacher's Comment per pupil, and a school-wide Head Teacher's Comment auto-assigned from a comment bank matched to each pupil's grade band
- Continuous autosave with a visible Saved indicator
- Print individual or whole-class report cards, one page per pupil, or switch on PDF mode to download them as a PDF instead
- Export class results to CSV
- "Before you print" check flags unnamed pupils or obviously incomplete records
- Score entry deadline banner with days remaining
- Submit a class for admin review when scores are final
- Change own password from the footer (asks for the current password first)
- In-app Help page
- Install the app to the phone home screen

### For admins
**Dashboard and data**
- Overview across every class at once, with search
- Edit any teacher's data directly, with Undo and Redo buttons, an unsaved-changes warning, and a Version History of the last 10 saves per class
- Lock or unlock a class so teachers cannot change scores
- Mastersheet for any class (all pupils against all subjects, totals, averages, positions), printed landscape
- Annual Cumulative Report per class: Term 1, 2 and 3 averages, annual average and position
- Progress tab: scores-entered percentage per class, class average, top 3 pupils, weakest subject, warnings for unnamed pupils, duplicate names and totals over 100, and Approve and Lock for classes submitted for review
- Export a full JSON backup of the database, with a "last backup" reminder
- Restore a single class from a JSON backup, with a warning when live data is newer than the backup
- Recover deleted class records and records replaced by a restore
- Delete a class and everything filed under it with a type-to-confirm safety check
- Rename a class and safely move all of its data to the new name, using atomic two-phase batched writes
- A backup file downloads automatically before a class rename, a roster replace and a final class delete
- New Term Checklist

**Teachers and rosters**
- Create teacher accounts one at a time, or in bulk (paste name/email/class lines, get auto-generated passwords to copy and share)
- Edit a teacher's name and assigned classes
- Set up a class's pupil roster by pasting names, or copy the previous term's roster forward
- Activity log of admin actions. Score edits record the old and new values.

**Subjects, grading, and skills (all admin-editable, no code changes required)**
- Subjects per class: add, remove, or reduce freely; copy another class's list; save a list as a reusable named template
- The class list itself
- Grading scale: the minimum score and remark for each of grades A to F
- Score component labels (the underlying 20/20/60 weighting stays fixed)
- Psychomotor and Affective skill lists, and the rating-scale legend text

**Report card layout (school-wide)**
- Show or hide the school logo and the Psychomotor and Affective tables
- Font, line colour, spacing, logo size, and text size adjustment
- Comment boxes start at 3 lines and grow to about 6 so a card never spills onto a second page

**Fees and settings**
- Per-class fee overrides (falls back to the school-wide default)
- School-wide settings: name, address, session, term, dates, fees, head teacher name and default comment, announcement banner, and score entry deadline

## What is new in v18

| Area | Change |
|---|---|
| Data safety | Undo and Redo, Version History (last 10 saves), recovery copy before a class record is deleted, unsaved-changes warning, JSON restore of a single class, automatic backup before risky actions, backup reminder |
| Accounts | Teachers can change their own password; admins can edit a teacher's name; clearer message when an email is already registered; Remove Teacher now warns that the login email stays reserved |
| Admin tools | Progress tab, lock class, submit for review and approve, mastersheet, annual cumulative report, soft warnings, richer activity log, New Term Checklist |
| Report cards | PDF mode for downloading cards |
| Teacher experience | Score entry deadline banner, Help page |
| Speed | Install to home screen with caching of the app and its libraries |
| Security | Firestore rules updated: teachers cannot edit a locked class, cannot lock or unlock one, and cannot overwrite another class's undo snapshot; My History now works for teachers |

## Tech stack

- Plain HTML, CSS, and JavaScript. The app is `index.html` (about 3,900 lines).
- [Firebase Authentication](https://firebase.google.com/docs/auth) (email/password) for login
- [Cloud Firestore](https://firebase.google.com/docs/firestore) for all data storage
- Hosted on [GitHub Pages](https://pages.github.com/)
- Report cards are generated as an HTML page. Printing uses the browser's own Print or Save as PDF. PDF mode uses the html2pdf library, loaded from cdnjs the first time it is needed.
- A small service worker (`sw.js`) caches the app and its libraries for faster loads and for poor connections

## Repository contents

| File | Purpose |
|---|---|
| `index.html` | The entire application |
| `firestore.rules` | Firestore security rules. Must be published manually in the Firebase Console; nothing in this repo applies them automatically |
| `manifest.json` | Install-to-home-screen settings (optional) |
| `sw.js` | Service worker for caching (optional) |
| `icon-192.png`, `icon-512.png` | Home screen icons (optional) |
| `README.md` | This file |

The app works with only `index.html`. The manifest, service worker and icons add the install feature and caching.

## Setup: fresh deployment

1. Create a Firebase project. Enable **Authentication > Email/Password** and **Firestore Database**.
2. Copy your Firebase config into the `firebaseConfig` object near the top of `index.html`.
3. Publish `firestore.rules` in Firebase Console > Firestore Database > Rules > paste > Publish. **Do this before putting real pupil data in.** With no rules published, Firestore defaults to open.
4. Firebase Console > Authentication > Settings > Authorized domains > add your GitHub Pages domain (e.g. `dia16.github.io`).
5. Push all files in the table above to this repo's GitHub Pages branch, in the same folder.
6. Create your first admin account manually in Firestore: add a document to `users/{uid}` (the uid must match a real Firebase Auth user you have created) with `role: "admin"`. There is no public sign-up screen. Every account is created by an existing admin, including the first one.

## Updating the live site

1. **Publish any changed Firestore rules first.** v18 needs the updated rules, or deleting a class record will be refused.
2. Export a full backup from the admin dashboard.
3. Replace the files in this repo and commit and push. Changes go live within a few minutes.
4. Check the version in the app footer. A teacher who still sees the old version should refresh once.
5. Test one edit, one undo, one lock and one save as a teacher before announcing the update.

Keep the previous `index.html` as a fallback until the new version has been used for a full day.

## Data model (Firestore collections)

| Collection | Shape | Written by |
|---|---|---|
| `users` | One doc per account: `role`, `assignedClasses`, `assignedClass`, `email`, `displayName`, `lastLogin` | Admin (create and most fields); the account itself (`lastLogin` only) |
| `settings` | Single doc (`school`): all school-wide and report card layout configuration, including `announcement` and `deadline` | Admin only |
| `classdata` | One doc per class per session/term: pupil list, scores, ratings, comments, optional `locked`, `submitted`, `submittedAt` | Assigned teacher (own class, never when locked) and admin |
| `classdata_history` | One doc per class per session/term: a single "before this edit session" snapshot | Written as a side effect of opening a class; read only by admin |
| `classdata_versions` | Version history (last 10 saves per class) and recovery copies of deleted or replaced records | Admin only |
| `classfees` | One doc per class: fee overrides | Admin only |
| `commentbanks` | One doc per class: Head Teacher comment pools by grade band | Admin only |
| `classsubjects` | One doc per class: subject list and religious-subject flag | Admin only |
| `subjecttemplates` | One doc per saved template | Admin only |
| `activitylog` | One doc per logged admin action | Admin only |

Fields added in v18 are optional. Records saved by earlier versions work unchanged.

## Roles and permissions

Two roles: `admin` and `teacher`. A teacher's `users` document lists `assignedClasses`, the only classes they can read or write `classdata` for. Every teacher account must have an `assignedClasses` list; a record with only the older `assignedClass` field will not be able to open its class. Configuration collections (settings, fees, comment banks, subjects) are readable by any signed-in account, because teachers need them to print correctly, but writable by admins only.

## Security

Firestore rules enforce all of the above at the database level. Hiding a button in the app does not protect your data; the published rules do.

- **Publish the rules.** An unpublished or default-open ruleset lets any signed-in account read or write anything.
- **Locked classes** are enforced by the rules, not only by the app. A teacher's save to a locked class is refused and the app tells them the class is locked.
- **Silent failures.** For other denied writes the app may fail quietly. If a feature seems to not save, check that the published rules match `firestore.rules` in this repo before assuming an app bug.
- **Logins are separate.** Passwords and login emails live in Firebase Authentication, not in Firestore.

## Backup and recovery

- **Full backup:** admin dashboard, Export Full Database Backup (JSON). Do this before every update and at the start of each term.
- **Restore one class:** admin dashboard, Restore a Class from Backup. Pick the JSON file, then the class. A copy of the current data is kept first.
- **Recover deleted or replaced records:** admin dashboard, Recover Deleted Class Records.
- **Undo a mistake in an edit session:** Undo and Redo on the edit screen, or Version History for earlier saves.
- **Logins are not in the backup.** After a full rebuild, teachers need new passwords via Bulk Add or Reset Password.

## Known limitations

- Score component weighting (20/20/60) is fixed; only the labels are editable
- The Annual Cumulative Report matches pupils across terms by name, so spellings must be identical in every term
- Remove Teacher deletes the profile but not the Firebase login. To reuse that email, delete it in Firebase Console > Authentication > Users first.
- A teacher's login email cannot be corrected inside the app. Delete the wrong login in the Firebase Console and register the correct email.
- The JSON restore covers class results, not logins or settings
- PDF mode needs an internet connection the first time, to load the PDF library
- Install to home screen needs https hosting (GitHub Pages is fine)
- Class rename and delete tools are not usable while offline, because they depend on multi-step Firestore reads and batched writes completing in sequence
- No drag-and-drop print layout editor

## Built by

EDA-NI-MI
