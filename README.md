# E-Champions Result Manager

Live site: https://dia16.github.io/E-Championsv10/

A school result and report card management system built for E-Champions Nursery and Primary School, Omu-Aran, Kwara State. Plain HTML, CSS, and JavaScript with no build step, no framework and no npm install, backed by Firebase (Authentication + Firestore). The whole application is one file: `index.html`.

**Current version:** v50 (deployed 2026-11-15 08:00 UTC)

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

## What is new in v50

- Teacher: strip above the bottom bar with save status, Save and Next incomplete; quick-fill chips (0, 0.5, 1, max) when a score box is focused; green or gold feedback on score boxes with the max shown on focus; offline banner and back online sync; Undo after removing a pupil; haptic tick and green flash on save.
- Admin: class page header card (progress, status, Print cards, Edit scores, All settings); teacher rows with activity dot and WhatsApp Remind; bottom bar now Home, Classes, Teachers, Search, More.
- Religious studies: new scan across all classes for pupils with Test 1, Test 2 and Exam all empty, with one-step Turn OFF (Quick actions, All classes).
- Skeleton loading blocks and empty states.

## What was new in v49

- Class page: old duplicate buttons deleted from the page template and the button-hiding code removed. All class actions live in the All settings groups.
- Global search loads class records and teachers itself if Home has not loaded them.
- Class Settings tab sections collapse like School Settings.

## What was new in v48

- Admin Home: green summary card (classes complete, in review, in progress, overdue, not started), class tiles show percent complete, legend says Gold in review.
- Teacher pupil list: coloured status dot on every row.

## What was new in v47

- New look in the school logo colours: deep green header with gold edge, soft cream background (easier on the eyes), softer cards, green primary buttons, gold focus ring, matching dark mode. Theme is one block (style id theme47) and screen only, so report card printing is unchanged.

## What was new in v46

- Grade ranges read "70 and above", "60 to 69", ... "below 40" in Settings (live list) and the head comment bank screen.
- Teacher and head teacher comment suggestions are composed from the pupil average: grade wording, closeness to the next grade, and top 3 position. Uploaded banks still take priority.

## What was new in v45

- Teacher pupil list: score boxes are built only when a pupil is opened (faster on big classes).
- Logo moved out of index.html into logo.js (upload it with index.html).
- School Settings sections collapse, with a sticky Save button.
- Progress ring on the teacher progress card. Submit now needs 100% of score boxes filled.
- Admin global search: pupils, teachers, classes (Home, Quick actions, Search).
- Removed unused password code.

## What was new in v44

- Settings grouped: one Report card design entry (school-wide defaults collapsed), fees edited per class only, class list/rename/delete in one group, one Comments hub per class, one password modal, new-term checklist linked from the term fields.
- Last pupil can now be deleted and saved. CSV export escapes class, term and teacher cells.

## What was new in v43

- Head teacher comments per class: Suggest, Suggest for all empty, edit, Save (same path as teacher comments). Per class head comment bank by CSV.
- Save no longer overwrites the class when the read fails.
- Firebase libraries can now be cached by sw.js. sw.js has an offline fallback.

## What was new in v42

- Fixed: Find by name on the admin class page (it was filtering the wrong rows).
- Religious studies off now refreshes the class page at once and averages are recalculated on the remaining subjects. The admin choice (`relAdmin`) is kept when a teacher saves.
- The class page has one grouped All settings area: Scores and progress, Comments, Subjects and fees, Report card, Pupils and teachers. The old scattered buttons are merged into it, with delete and restore in a Danger zone.

## What was new in v41

- Comments: first names (names are stored surname first), 3 to 4 lines, based on the average only. Comment banks can be set per class or for all classes.
- Religious studies: admin can turn the subject off or on for chosen pupils; pupils with no score in it are pre-ticked.
- Admin class scores and edit screens: search by name and floating Top and Bottom buttons.
- Admin layout: Home has one grouped Quick actions list, the Manage tab is gone, and the Classes tab opens a class hub. Every per-class setting (fees, comment bank, subjects, religion, CSV, split, break, delete pupils, change teacher) is on the class page.

## What was new in v40

- Next key on phones now goes down the column (tab order), on pupil cards, the Scores screen and the Table view.
- Teacher pupil list top bar slimmed to Find by name plus up and down arrows. Filters, Next to do and Tools buttons removed from it (Table, Grid, Problems and class tools are in More).
- Clear zeros tool (class page, Manage, teacher More > Records) and a built-in guard: a CSV upload reads a pupil's all-zero test column as not entered. The teacher CSV download now leaves unentered scores blank.

## What was new in v39

- Progress by test: Test 1, Test 2 and Exam counts per class (teacher card with tap to jump, admin Progress by pupil). A blank box is not entered, 0 is a real score.
- Enter or Next on a pupil card moves down the same column to the next subject, then to the next pupil.
- Admin per-class CSV download and upload with preview. Blank stays blank.
- Class teacher comments written by the admin (stored as `adminComment` on each pupil, shown on report cards), with suggestions from a CSV comment bank (band,comment). Read-only for teachers in pilot classes.
- Admin Manage menu regrouped: Teachers, Classes and pupils, Report cards, Reports and printing, Data and backup, School settings, Account.
- Fixed: Restore a class from backup did not open on the new Home.

## What was new in v38

- Network resilience: Firestore auto-switches to long polling on restrictive mobile networks, Firebase scripts fall back to jsDelivr if gstatic is blocked, and a start-up message with fixes appears if the app has not started after 20 seconds.
- Faster admin Home: the old Home layout is no longer built behind the new one.
- Upload saved CSV is back: teacher More > Records, and the Upload CSV chip on the Scores screen.

## What was new in v37

- Redesign. Teacher Scores (pilot, Basic 5): one subject at a time, sticky pupil column, live total and grade, optional on-screen keypad (off by default), Next pupil direction setting, and a pupil sheet. Admin Home: Needs your action feed, class tiles with a colour legend, and a new bottom bar (Home, Classes, Teachers, Manage). Manage is a searchable grouped list of every tool. Tools moved off the Home screen. Dark mode kept. Old Home layout available from Manage.

## What was new in v36

- Teacher view selector on the Scores screen (Basic 5 first, controlled by Menu > Classes > Teachers views rollout): Table, Grid (pupils across or down, one score type at a time) and Problems first.
- Lock banner with read-only inputs, and Send back with a note from the admin Progress tab (optional fields `sendBackNote`, `sentBackAt`).
- Admin Home view selector: Needs attention, Class grid, List.

## What was new in v35

Hardening release, no new screens.

- Saves now run one at a time per phone, so an older save can never overwrite a newer one. Writes made offline are still queued on the phone straight away.
- A failed subject-list read is no longer remembered, and Add pupil waits for the real subject list.
- Break class checks names and pupil ranges for overlaps before writing anything.
- Teacher profile creation retries and gives a clear error if it still fails.
- Score values and CSV names are escaped (formula-safe).
- The annual cumulative report warns about duplicate pupil names.
- Clearer save wording.

## What was new in v34

- Table view (one subject for all pupils, Enter moves down), switched on per class from Menu > Classes > Table view rollout. Starts with Basic 5 only. Stored as `tableViewClasses` in `settings/school`.
- Fixed: a class made with Break class lost its subjects after a refresh. Its subject list is now saved.
- Unsaved scores are now saved when the page is hidden or closed.
- Merge read cache cut to 10 seconds, version pruning awaited, apostrophes escaped, leftover B5 paper code removed.

## What was new in v33

- Teacher: a green Save now button, always visible, that saves and backs up to the cloud at once and says whether it synced.
- Faster loading: settings and profile load together, the class opens without a duplicate read, background pre-loading waits 5 seconds, early connections to Google servers, and the service worker now opens the saved copy first and checks for updates in the background. When an update is found a Tap to refresh bar appears.

## What was new in v32

- Fixed a blank second page when printing a single report card.
- Editable fees: rename, add and delete fee types per class (Quick actions > Fees, or Menu > Classes). Stored as `feeItems` in `classfees/{class}`, with an optional school default in `settings/school`. The report card total is worked out automatically.

## What was new in v31

- Score limits: Test 1 and 2 cap at 20, Exam at 60, on teacher and admin screens.
- Admin Home: Needs attention list including a backup reminder after 7 days, class filter chips, Class summary page (Menu > Reports), menu search, Teachers filters, a More actions group inside a class, and the last tab is remembered.
- Teacher: Scores and Skills tabs inside each pupil, Next pupil button, count of pupils still to do on the Scores button, the open pupil is remembered, and first-time tips.

## What was new in v30

- Fixed: admin logins were never recorded, so admins always showed Never logged in. Admin logins are now recorded and the admin list is sorted by last login.

## What was new in v29

- Teachers list is sorted by last login, most recent first. Teachers who never logged in come last.
- Fixed dual-role users appearing in both the Teachers and Admins lists.
- Removed an unused Account menu function.
- Speed: pupil status is cached on the teacher list screen, the admin Home clean-up scans far fewer elements, and autosave reads the class from the cloud at most once every 30 seconds unless the class is split.

## What was new in v28

- Fixed report cards printing small: the one-page fitter measured unstyled content and shrank every card. It now measures with the print styles and picks the largest font that fits one A4 page, so cards fill the page. A font size set in Print layout is treated as a maximum.

## What was new in v27

- Print one pupil's report card by name search (admin: Menu > Reports; teacher: More > Class tools).
- Editing a teacher's name now also updates the name stored on class records and pupil splits.
- Comments are printed in a box (room for 50 or more words) with the signature line below the box.

## What was new in v26

- Removed the paper size option. Basic 5 now defaults to the head teacher comment under the class teacher comment, tighter row spacing and automatic one-page fitting.

## What was new in v25

- Dual role: Edit Teacher has an Also an admin option; admins with classes can switch between admin and teacher views.
- Change a class teacher and Break a class tools, with saved records untouched. Quick actions now has eight tiles.
- Whole-school print and CSV moved into Menu > Reports.
- Print layout: alternate row shading, compact stacked comments, an option to put the head teacher comment under the class teacher comment for classes with 15 or more subjects (applied to Basic 5 by default), and every report card is shrunk automatically to fit one page.
- Admin class list is cached for 30 seconds to cut waiting.

## What was new in v24

- Teachers open their class directly after login, for the school's current session and term only. Session and term are fixed to the admin's settings, so stray records stop appearing.
- Admin can delete pupils by range or ticks on the edit screen (nothing saved until Save, Undo works), and delete class records by range or ticks (Menu > Classes), with a recovery copy of each.
- The admin class list now loads up to 500 records instead of 100.

## What was new in v23

- Admin: a grouped **Menu** (Teachers, Classes, Data and backup, Settings and logs, Account) in the bottom bar. Backup, restore, recover and similar buttons moved off the Home screen. **Split pupils** now has its own entry on Home and in the menu.
- Teacher: a grouped **More** menu (class tools, help, account). The tool buttons, jump list and info banner no longer crowd the pupil list.

## What was new in v22

- **Print layout per class** (admin Home > Print layout, or the class view): report title, font, font size, row spacing, table line thickness, header rule thickness, colours, table width, logo size, show or hide logo, skills, comments and fees, and the order of sections. Includes live preview, apply to all classes, and reset. Stored in `settings/school` as `classLayouts`, so no rule changes are needed.

## What was new in v21

- Teacher screen redesigned for large classes: each pupil is a slim row with a status colour, one pupil opens at a time, sticky search, To do / Done / Absent filters, Next to do, Top and End buttons, and a bottom bar (Scores, Results, Submit, Help, Account).
- Admin screen: bottom navigation with icons and a Quick actions panel on Home (add teacher, bulk add, backup, restore, recover, new term, PDF mode, school settings).

## What was new in v20

- Pupil lists stay in A to Z order, on add, paste, sort and save. Manual up/down arrows are disabled.
- Teachers get Add pupil and Sort A-Z buttons.
- Admin dashboard shows pupils per term for the current session.
- Admin can set an official class size for report cards per class and term. A reason is required and is saved in the activity log. Optional field `classSizeOverride`.
- Detailed step-by-step Help for teachers.
- Visual polish (larger tap targets, softer cards) and faster long pupil lists.

## What was new in v19

- **Shared classes:** two or more teachers can now be assigned to one class. Saves merge by pupil, so one teacher no longer wipes out the other's work.
- **Split pupils:** the admin gives each teacher a range of pupils (Version History row, Split Pupils button on the admin edit screen). Teachers can edit only their own pupils; the rest show as locked. Enforced by the app, not by Firestore rules.
- **Pupil IDs:** every pupil gets a permanent `pid`, added automatically to existing classes the first time they are opened or saved. Optional `owner` and `ownerName` fields hold the split.
- No Firestore rule changes are needed.

## What was new in v18

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
