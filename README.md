# BloodNearMe

## Overview

This project aims to connect individuals in need of blood with potential donors in their vicinity. While the description is currently limited, the core functionality revolves around facilitating blood donations through a user-friendly interface.

## Key Features & Benefits

*   **Donor Discovery:** Easily find potential blood donors near you.
*   **User-Friendly Interface:** A streamlined and intuitive design for effortless navigation.
*   **Admin Dashboard:** Functionality for administrators to manage users and data.
*   **Real-Time Updates:** Potentially utilizes real-time data for up-to-date information on blood availability.

## Technologies

### Languages

*   TypeScript

### Tools & Technologies

*   Node.js
*   Firebase (for backend services like Firestore and Storage)
*   Tailwind CSS (for styling)
*   Next.js (Potentially the underlying framework)

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** (version >= 16 recommended) - [https://nodejs.org/](https://nodejs.org/)
*   **npm** or **yarn:** (package manager)
*   **Firebase Account:** Required for configuring Firebase services.

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/abhayclasher/BloodNearMe.git
    cd BloodNearMe
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Configure Firebase:**

    *   Create a Firebase project in the Firebase console ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
    *   Enable Firestore and Storage in your Firebase project.
    *   Obtain your Firebase configuration details (API key, project ID, storage bucket, etc.).
    *   Create a `.env` file (or similar environment variable mechanism) and set the following environment variables:

        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
        ```

4.  **Start the development server:**

    ```bash
    npm run dev  # or yarn dev
    ```

    This will typically start the application at `http://localhost:3000`.

## Project Structure

```
├── .gitignore
├── .meta.json
├── app.info
└── app/
    ├── about/
    │   └── page.tsx
    ├── admin/
    │   └── dashboard/
    │       ├── loading.tsx
    │       ├── page.tsx
    │       └── layout.tsx
    ├── page.tsx
    └── donor/
    │   └── page.tsx
    └── find/
        ├── loading.tsx
        ├── page.tsx
        ├── globals.css
        └── layout.tsx
        └── page.tsx
```

*   **`.gitignore`:** Specifies intentionally untracked files that Git should ignore.
*   **`app/`:** Contains the main application code, likely using Next.js's `app` router.
    *   **`about/`:**  Page for information about the application.
    *   **`admin/`:** Contains administrative functionalities.
        *   **`dashboard/`:** The admin dashboard.
    *   **`donor/`:** Page related to donor information.
    *   **`find/`:** Pages related to finding blood.
    *   **`globals.css`:** Global CSS file, likely using Tailwind CSS for styling.
*   **.meta.json, app.info:** Meta data or configuration files.

## Important Files

### `app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0....
```

This file sets up the global CSS styles, primarily using Tailwind CSS for utility-first styling. It also includes custom CSS variables for theming.

### `components/ui/use-toast.ts`

```ts
'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOA...
```

This file defines a custom hook for managing toast notifications, likely inspired by the `react-hot-toast` library.

### `hooks/use-mobile.ts`

```ts
import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeE...
```

This custom hook determines if the user is on a mobile device based on the screen width.

### `hooks/use-toast.ts`

```ts
'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOA...
```

This file is a duplicate of the first `use-toast.ts` file. A future cleanup should eliminate the duplication.

### `lib/firebase.ts`

```ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type FirestoreType = Firestore;
type StorageType = FirebaseStorage;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:...
```

This file initializes the Firebase connection and exports instances of Firestore and Storage, enabling interaction with Firebase services.

## Usage Examples & API Documentation

Detailed API documentation will be provided in a separate document.  For now, refer to the Firebase documentation for using Firestore and Storage:

*   **Firestore:** [https://firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
*   **Storage:** [https://firebase.google.com/docs/storage](https://firebase.google.com/docs/storage)

## Configuration Options

*   **Firebase Configuration:**  Configure your Firebase settings using environment variables as described in the Installation & Setup section.

## Contributing Guidelines

We welcome contributions to improve BloodNearMe! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request with a clear explanation of your changes.

## License Information

License information will be added in a future update.

## Acknowledgments

*   This project utilizes Firebase for backend services.
*   The UI design is powered by Tailwind CSS.
