# E-Champions Result Manager

A free, phone-first result management system built for **E-Champions Nursery and Primary School**, Omu-Aran, Kwara State.

Teachers enter pupil scores directly from their phones. Results are calculated, ranked, and graded automatically, saved securely to the cloud, and printed as official report cards — no spreadsheets, no manual computation, no paperwork lost.

**Live app:** https://dia16.github.io/E-Championsv10/

---

## What It Does

**For Teachers**
- Log in with a school-issued account — only your assigned class is visible to you
- Enter Test 1, Test 2, and Exam scores per subject
- Totals, averages, grades, and class rank calculate automatically
- Mark pupils absent, add psychomotor/affective ratings, and leave comments
- Everything auto-saves to the cloud as you type — safe even if you close the browser
- Works offline; syncs automatically once back online
- Print official report cards matching the school's paper template
- Download results as a CSV backup at any time

**For Admin**
- One dashboard showing every class, every teacher, all in one place
- See which classes haven't started their results yet
- Create and manage teacher accounts, including which class(es) they can access
- Maintain a bank of Head Teacher comments per class — each pupil is randomly assigned one comment that stays fixed for the term
- Manage school-wide settings: logo, name, address, term, fees, next term date
- Print report cards for a single class or the entire school in one tap
- Export all results across every class as one combined CSV

---

## Tech Stack

- Single HTML file — no build tools, no framework, no server required
- **Firebase Authentication** for secure teacher/admin login
- **Firestore** as the cloud database, with offline persistence built in
- Hosted for free on GitHub Pages (or Netlify)

---

## Deployment

1. Clone or download this repository
2. Open `index.html` and paste in your own Firebase project config (see `firebaseConfig` near the top of the script)
3. In Firebase Console, enable **Email/Password Authentication** and create the first **Firestore** database
4. Paste the security rules below into **Firestore → Rules**
5. Enable **GitHub Pages** in this repo's Settings, pointing to the `main` branch, root folder
6. Your school link is now live

Full step-by-step guides (Firebase setup, GitHub Pages setup, and what changed in each version) are included in this repository.

---

## Firestore Security Rules

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
  }
}
```

---

## Setting Up the First Admin Account

Admin accounts are not created through the app itself — this is a one-time manual step for security.

1. In Firebase Console → **Authentication**, add a user with your email and a password
2. Copy that user's UID
3. In **Firestore Database**, create a `users` collection, with a document ID matching that UID, containing:
   - `role`: `"admin"`
   - `displayName`: your name
   - `email`: your email

Every teacher account after that is created directly inside the app by the admin — no manual Firebase steps needed.

---

## Class & Subject Structure

| Class Group | Subjects |
|---|---|
| Basic 1 – Basic 5 | 18 subjects |
| Nursery Two | 18 subjects |
| Nursery One | 13 subjects |
| KG 2A, KG 2B | 9 subjects |
| KG 1, Creche | 7 subjects |

Report card font size scales automatically based on subject count, so smaller classes print with larger, fuller text.

---

## Cost

Free, for a school of this size, on Firebase's Spark (free) plan:
- 50,000 Firestore reads/day, 20,000 writes/day
- 1 GB Firestore storage
- GitHub Pages hosting has no usage limits at all

---

## Credits

Built for E-Champions Nursery and Primary School.
Signature: **EDA-NI-MI**

---

## Support

If something breaks or looks wrong, note exactly what you see and which screen you were on — this makes it much faster to track down and fix.
