# CST 438 Assignment 3 — Course Registration Frontend

A React single-page application for a course registration system. Students,
instructors, and administrators sign in and see tools for their role. The
frontend communicates with the course registrar and gradebook services.

## Features

- **Students:** browse their class schedule, enroll in a class, view assignments,
  and view their transcript.
- **Instructors:** manage course assignments, view section enrollments, and
  record assignment and final grades.
- **Administrators:** manage users, courses, and course sections.
- **Authentication:** sign in through the registrar service; the selected role
  determines which application views are available.

## Requirements

- Node.js and npm
- Access to the registrar and gradebook backend services

## Run locally

From the frontend project directory:

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal. The frontend's backend
service URLs are defined in `src/Constants.jsx`; update them there if you need
to point the app at a different backend.

## Build and lint

```sh
npm run build
npm run lint
```

## Technology

- React 19
- React Router 7
- Vite 6

## Contributors

The following work areas are based on the feature commits in this repository's
Git history:

| Contributor | Contributions |
| --- | --- |
| David Wisneski | Initial application foundation, including the role-based app shell, sign-in, and initial administrator, instructor, and student views. |
| Brandon Nhep | Instructor assignment listing, creation, editing, and grading; instructor section view updates. |
| Alexis Wogoman | Student course enrollment and schedule management. |
| Shpetim Mujeci | Instructor final-grade entry and plus/minus grade support. |
| s-AustinAvery | Student assignment and transcript views; case-insensitive semester input. |
