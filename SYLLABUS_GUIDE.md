# Welfora — Academic Syllabus & Architecture Guide

This comprehensive reference document maps every academic syllabus topic directly to the implementation within the **Welfora** codebase, along with a structured 10-minute presentation and viva response guide for a 4-member team.

---

## 1. Syllabus Topic to Codebase Mapping

| Syllabus Topic | Concepts Covered | Codebase Implementation (Files & Lines) |
| :--- | :--- | :--- |
| **HTML, CSS, JS & DOM Manipulation** | Semantic landmarks, accessible attributes, document lifecycle, DOM manipulation | `src/components/Layout.jsx`<br>`src/components/SchemeModal.jsx` (Keyboard event listeners & focus)<br>`src/App.css` (Vanilla CSS design system, CSS variables) |
| **React Fundamentals** | Functional components, JSX, props, state, effects, component composition | `src/components/SchemeCard.jsx`<br>`src/components/Metric.jsx`<br>`src/components/QuickStat.jsx` |
| **React Router (SPA)** | Multi-page client-side SPA, declarative `<Routes>`, `<Route>`, `<NavLink>`, `<Outlet>`, dynamic params (`:id`), programmatic navigation | `src/App.jsx` (Declarative router)<br>`src/components/Layout.jsx` (`<Outlet />` shell)<br>`src/components/ProtectedRoute.jsx` (Route guarding)<br>`src/components/Sidebar.jsx` (`<NavLink>` active states)<br>`src/pages/SchemeDetailPage.jsx` (`useParams` for `/scheme/:id`) |
| **Code Splitting & Suspense** | Optimizing bundle size, dynamic chunk loading with `React.lazy` | `src/App.jsx` (`lazy()` imports for heavy pages)<br>`src/components/Layout.jsx` (`<Suspense fallback={...}>`) |
| **State Architecture & Zustand** | Centralized global store, selector-based subscription, immutable state updates, persistence | `src/store/useWelforaStore.js` (Zustand store for catalog, user session, application tracking)<br>`src/pages/SavedSchemesPage.jsx` (`useWelforaStore(s => s.saved)`) |
| **Context API (Global vs Local State)** | Scoped context providers for cross-cutting UI concerns, preventing prop-drilling | `src/context/ThemeContext.jsx` (Dark/light mode sync)<br>`src/context/NotificationContext.jsx` (Toasts & alert channels)<br>`src/context/WelforaContext.jsx` (Unified Facade Hook) |
| **Async State & Error Handling** | Asynchronous lifecycle (`idle` -> `pending` -> `resolved` / `rejected`), loading skeletons, error banners, retry mechanisms | `src/hooks/useAsync.js` (Standardized async lifecycle)<br>`src/services/schemeService.js` (Catalog fetch simulation)<br>`src/pages/Dashboard.jsx` (`apiLoading` skeleton, `apiError` retry banner)<br>`src/pages/AssistantPage.jsx` (Gemini API streaming & retry flow) |
| **Backend API Proxy** | Node.js proxy server, environment isolation, CORS handling, API key protection | `server.js` (Node HTTP server & SPA fallback router)<br>`server/geminiService.js` (Secure Gemini API proxy)<br>`.env.example` (Safe environment template) |
| **Form Handling & Validation** | Controlled inputs, validation strategies (onBlur, real-time, submit), reusable form components | `src/hooks/useForm.js` (Form validation controller hook)<br>`src/components/form/TextInput.jsx`<br>`src/components/form/SelectInput.jsx`<br>`src/components/form/NumberInput.jsx`<br>`src/pages/FindSchemesPage.jsx` (Interactive eligibility questionnaire) |

---

## 2. 10-Minute Team Presentation & Viva Guide (4 Members)

### **Member 1: Introduction, SPA Architecture & Routing (2.5 mins)**
* **Role:** Sets the stage, introduces the real-world problem, and walks through the multi-page single-page application structure.
* **Key Demo Points:**
  1. Start on the login screen (`/login`). Explain that Welfora bridges the digital divide for Indian welfare schemes.
  2. Log in using Demo credentials. Point out the onboarding personalization screen.
  3. Show how clicking sidebar items updates the URL (`/`, `/explore`, `/find-schemes`, `/saved`, `/deadlines`) instantly without full-page reloads.
* **Code to Highlight:**
  - `src/App.jsx`: Show `<BrowserRouter>`, `<Routes>`, and code-splitting with `React.lazy()`.
  - `src/components/Layout.jsx`: Explain how the persistent shell uses `<Outlet />` to render child routes.
  - `src/components/ProtectedRoute.jsx`: Explain route guarding (`<Navigate to="/login" replace />`).
  - `src/pages/SchemeDetailPage.jsx`: Show `useParams()` extracting the scheme `:id` for shareable URLs.
* **Expected Viva Questions:**
  - *Q: Why use client-side routing instead of standard multi-page HTML?*
    - **A:** It avoids redundant page reloads, preserves application state in memory, and provides an app-like user experience.
  - *Q: How does `React.lazy` improve performance?*
    - **A:** It splits the JavaScript bundle into smaller chunks that are fetched on-demand only when the user navigates to that route, reducing initial page load time.

---

### **Member 2: State Architecture — Zustand & Context API (2.5 mins)**
* **Role:** Explains how global state, scoped context, and local state are cleanly separated.
* **Key Demo Points:**
  1. Click the Heart icon on any scheme on the Dashboard or Explore page.
  2. Navigate to `/saved` to show that the saved list updated instantly across all pages.
  3. Toggle between Dark and Light mode from the sidebar or settings.
* **Code to Highlight:**
  - `src/store/useWelforaStore.js`: Explain the Zustand store. Highlight that Zustand operates outside the React component tree and doesn't require boilerplate reducers or context wrappers.
  - `src/pages/SavedSchemesPage.jsx`: Show `const saved = useWelforaStore(state => state.saved)`. Explain how Zustand selectors prevent unnecessary re-renders.
  - `src/context/ThemeContext.jsx` & `src/context/NotificationContext.jsx`: Explain why Context API was chosen for cross-cutting UI concerns (Theme and Toasts) while Zustand handles large data entities.
  - `src/context/WelforaContext.jsx`: Explain the **Facade Pattern** used to aggregate Zustand and Context for backward compatibility.
* **Expected Viva Questions:**
  - *Q: Why use Zustand over Context API for the scheme catalog and user profile?*
    - **A:** When a Context value changes, every component consuming that context re-renders unless memoized. Zustand allows selector subscriptions (`state => state.saved`), re-rendering only when the selected slice changes.
  - *Q: When would you use local state (`useState`) instead of global state?*
    - **A:** For UI state that only matters to a single component and doesn't need to persist across page transitions, such as modal open/close flags, dropdown toggles, or active tab indices.

---

### **Member 3: Asynchronous State, Loading/Errors & Backend Proxy (2.5 mins)**
* **Role:** Demonstrates how Welfora handles network requests, async lifecycles, and backend isolation.
* **Key Demo Points:**
  1. Open `/settings` and click "Simulate API Error". Point out the warning banner with the "Retry" button.
  2. Click "Retry" to show clean recovery without refreshing the browser.
  3. Open `/chatbot` (Welfora Assistant) and demonstrate a prompt query.
* **Code to Highlight:**
  - `src/hooks/useAsync.js`: Walk through the generic async state machine (`idle`, `pending`, `resolved`, `rejected`).
  - `server.js` & `server/geminiService.js`: Explain why the Gemini AI API is accessed via a Node.js backend proxy rather than directly from the frontend.
  - Mention API key security (`.env` is never exposed to the client browser) and server-side input validation.
* **Expected Viva Questions:**
  - *Q: What are the risks of calling AI APIs directly from client-side React code?*
    - **A:** The private API key would be visible in client network bundles, allowing attackers to steal quota. A backend proxy keeps keys secure on the server.
  - *Q: How do you prevent memory leaks when an async request resolves after a component unmounts?*
    - **A:** Using cancellation flags, `AbortController.signal`, or checking component mount status in cleanup functions of `useEffect`.

---

### **Member 4: Form Handling, Validation & Accessibility (2.5 mins)**
* **Role:** Demonstrates the interactive forms, reusable inputs, validation rules, and accessibility features.
* **Key Demo Points:**
  1. Navigate to `/find-schemes` (Find Schemes For Me).
  2. Click "Find Schemes For Me" with empty inputs to trigger validation messages.
  3. Fill in age (e.g. enter 150 to show range validation). Correct it and complete the form to show instant matching results.
* **Code to Highlight:**
  - `src/hooks/useForm.js`: Explain the custom form controller managing `values`, `errors`, `touched`, `handleBlur`, and `handleSubmit`.
  - `src/components/form/TextInput.jsx`, `SelectInput.jsx`, `NumberInput.jsx`: Highlight accessibility attributes:
    - `<label htmlFor="...">` for screen readers.
    - `aria-invalid={true}` on invalid fields.
    - `aria-describedby` pointing to error and helper text elements.
  - Focus trapping and Escape key closing in `src/components/SchemeModal.jsx`.
* **Expected Viva Questions:**
  - *Q: What is the difference between controlled and uncontrolled inputs in React?*
    - **A:** In controlled inputs, the input's current value is driven by React state (`value={state}` and `onChange={setState}`), making validation and conditional rendering instantaneous. Uncontrolled inputs rely on the DOM itself via `ref`.
  - *Q: Why is onBlur validation preferred over onChange-only validation?*
    - **A:** Validating immediately on the first keystroke shows premature errors before the user has finished typing. `onBlur` ensures errors only appear after the user interacts with and leaves the field.

---

## 3. Verification & Compliance Checklist

- [x] **0 ESLint Errors:** Verified with `npm run lint`.
- [x] **0 Build Errors:** Verified with `npm run build` (Clean Vite bundle with chunks for lazy routes).
- [x] **Zero Visual Regression:** Design system, CSS variables, and layout aesthetics preserved.
- [x] **Preserved Data:** All records in `src/data/schemes.js`, `categories.js`, and `notifications.js` unchanged.
- [x] **Environment Security:** `.env` files protected; template documented in `.env.example`.
- [x] **Educational Inline Comments:** Present in all refactored hooks, stores, and components.
