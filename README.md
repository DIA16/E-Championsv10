# E-Champions Result Manager

A phone-first result management app built for **E-Champions Nursery and Primary School**, Alakaka Road, Omu-Aran, Kwara State, Nigeria.

**Live site:** https://dia16.github.io/E-Championsv10/
**Version:** v13.0
**Built by:** EDA-NI-MI

---

## What this is

A single-file web app (`index.html`) that lets teachers enter Continuous Assessment scores for their class on their phone, and generates the school's official printable report card, matching the paper CA Report Sheet format E-Champions already uses. Admins get a companion dashboard to manage teachers, classes, fees, and school-wide settings.

No installation needed. Teachers and admins open the site link in any phone or desktop browser and sign in.

---

## Who uses it

**Teachers** — see only their assigned class or classes, enter scores, print report cards for their pupils.

**Admins** — see every class in the school, can edit or delete any record, manage teacher and admin accounts, maintain the Head Teacher comment bank, set school-wide fees and term settings, and review an activity log of admin actions.

---

## Core features

### Teacher side
- Login scoped to assigned class(es); teachers with more than one class can switch between them
- Score entry: Test 1, Test 2, and Exam per subject, with number-pad input and tab/enter navigation between fields
- Live per-pupil summary (subject count, grand total, average) as scores are entered
- Copy last term's pupil roster instead of retyping names every term
- Absent toggle per pupil, and optional inclusion of the religious subject (Christian Religious Studies / Bible Knowledge) per pupil
- Psychomotor and affective skill ratings, plus a free-text comment per pupil
- Jump-to-pupil search for quickly finding one name in a long class list
- Remove a specific pupil from anywhere in the list (not just the last one), with a confirmation showing exactly whose scores would be deleted
- Automatic totals, averages, letter grades, and tie-aware class ranking
- A completeness check before printing — flags unnamed pupils, subjects nobody has scored at all, and scores that are only partly filled in
- Official printable report card: portrait A4, Times New Roman, school logo, skills tables, comments, and fees — auto-scaling font size so both an 18-subject Basic 5 card and a lighter Creche card fit on one page
- CSV download of the whole class, and CSV re-upload to restore a class
- "My Past Terms & Classes" — full history across every term and session a teacher has saved
- Dark mode, adjustable font size, and offline support (scores keep saving locally and sync once back online)

### Admin side
- Dashboard: school-wide average, which classes haven't started the term yet, search by class or teacher, whole-school CSV export, whole-school print
- View, edit, or delete any class's records directly
- Add, edit, or remove teacher accounts, including multi-class assignment and triggering a password-reset email
- Add or remove other admin accounts
- Head Teacher comment bank, organized by grade band (Excellent / Good / Average / Pass / Poor / Fail) — each pupil's comment is chosen to match their actual grade, and automatically re-rolls if a later score correction moves them into a different band
- Per-class fee settings
- School-wide settings: school identity, logo, address, current term and Academic Session (locked to a fixed format so it can never mismatch what a teacher's device shows), bulk "start new term" placeholder creator for all 13 classes, login announcement banner
- Activity Log: records score edits, class deletions, and account changes, with who did it and when

---

## Classes covered

Creche, KG 1, KG 2A, KG 2B, Nursery One, Nursery Two, Basic 1, Basic 2, Basic 3A, Basic 3B, Basic 4A, Basic 4B, Basic 5 — 13 classes in total, each with its own subject list matched to its age group.

Basic 1 through Basic 5 carry the full 18-subject curriculum (English Language, Mathematics, Basic Science, Social Studies, Civic Education, Yoruba, Health Education, Verbal Reasoning, Agricultural Science, Computer Science, Christian Religious Studies, Quantitative Reasoning, Fine Arts, Hand Writing, Spelling and Dictation, Phonics, French, and Creative Arts). Younger groups use a shorter, age-appropriate subject list.

Every subject is scored as Test 1 (20) + Test 2 (20) + Exam (60) = 100.

---

## Tech stack

- **Frontend:** Single HTML file, vanilla JavaScript, no build step or framework
- **Auth:** Firebase Authentication (email/password)
- **Database:** Cloud Firestore
- **Hosting:** GitHub Pages, deployed from this repository

No servers to maintain. Updating the app means editing `index.html` and pushing to GitHub.

---

## Firestore data structure

| Collection | Purpose |
|---|---|
| `users` | One doc per account. Stores role (`teacher`/`admin`), display name, and assigned class(es). |
| `classdata` | One doc per class, per session, per term. Holds every pupil's names, scores, skills ratings, comments, and attendance for that record. |
| `settings` | School-wide identity, branding, current term/session, and announcement banner. |
| `commentbanks` | One doc per class, holding the Head Teacher comment pool organized by grade band. |
| `classfees` | Per-class fee amounts shown on the report card. |
| `activitylog` | Append-only record of admin actions (score edits, deletions, account changes). |

Security rules restrict `classdata` writes to the assigned teacher or an admin, and restrict `settings`, `commentbanks`, `classfees`, and `activitylog` writes to admins only. Current rules are tracked separately and should be kept in sync with this repo — see **Security Rules** below.

---

## Security rules

Firestore rules are managed in the Firebase Console, not in this repo (there is no `firestore.rules` file checked in here yet — see **Open Items** below). The current rules in production are:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuth() { return request.auth != null; }
    function getUser() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data; }
    function isAdmin() { return isAuth() && getUser().role == 'admin'; }
    function isTeacher() { return isAuth() && getUser().role == 'teacher'; }

    match /users/{uid} {
      allow read: if isAuth() && (request.auth.uid == uid || isAdmin());
      allow write: if isAdmin();
      allow update: if isAuth() && request.auth.uid == uid &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['lastLogin']);
    }

    match /classdata/{docId} {
      allow read, write: if isAdmin();
      allow read, write: if isTeacher() && (resource == null || resource.data.teacherUid == request.auth.uid);
      allow create: if isTeacher() && request.resource.data.teacherUid == request.auth.uid;
    }

    match /settings/{doc} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    match /commentbanks/{className} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    match /classfees/{className} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }

    match /activitylog/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update, delete: if false;
    }
  }
}
```

---

## Version history

- **v13.0** — Head Teacher comments by grade band with auto-re-roll; copy-forward roster; confirm-before-shrink pupil count; pre-print completeness check; jump-to-pupil search; self-service password reset; remove a specific pupil mid-list; locked Academic Session format; admin activity log.
- **v12.0 and earlier** — Firebase Auth login, class-scoped teacher access, official printable report card matching the paper CA sheet, admin dashboard, teacher/admin management, Head Teacher comment bank (flat pool), per-class fees, CSV export/import, dark mode, offline support.

---

## Known limitations

- CSV re-upload restores scores, absence, and religious-subject inclusion, but not psychomotor/affective ratings or comments — it's a partial backup, not a full one.
- There's no built-in "promote to next class" flow at year-end; each new session's roster is set up fresh (or copied forward by name only).
- Only one admin can hold the "Official Head Teacher" role at a time by design; there's no support for co-signing report cards.

---

## Open items / what I still need from you

To keep this README and the deployment accurate going forward:

1. **Confirm the live site is running v13.0.** The deploy guide covered replacing `index.html` on GitHub, but I don't have visibility into whether that commit actually went out yet, or which version is live right now.
2. **A `firestore.rules` file for this repo, if you want rules version-controlled** alongside the code instead of only living in Firebase Console. I can create one from what you pasted, so future rule changes get reviewed the same way code changes do.
3. **License preference.** Right now there's no license on the repo, which by default means "all rights reserved." If you want it fully closed (recommended, since this is built for one specific school with pupil data involved) I can state that explicitly; if you ever want to share the codebase as a template for other schools, that's a different license and a bigger conversation about stripping out E-Champions-specific data first.
4. **Whether the repo is public or private.** A public repo exposes the Firebase client config (project ID, API key) in the README and source — that's normal and not a security hole on its own (Firestore rules are what actually protect data, not a hidden key), but worth confirming you're comfortable with that visibility.
5. **Anything you want added that I don't know about** — screenshots for the README, a specific contact/support line for teachers who get stuck, or contribution notes if anyone besides you ever touches this code.

Let me know on any of these and I'll fold it in.
