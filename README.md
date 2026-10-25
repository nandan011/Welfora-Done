# Welfora — Welfare For All 🇮🇳

An intelligent discovery and guidance platform for Indian government welfare schemes, powered by Google's Gemini API and grounded in curated welfare scheme data.

---

## 🌟 Features

- **Welfora AI Assistant**: Real-time conversational AI grounded in government welfare data (Education, Agriculture, Healthcare, Housing, Employment, Women & Child, Senior Citizens, and Financial Aid).
- **Zero Client-Side Secret Exposure**: All Gemini API calls route securely through the backend `/api/chat` proxy.
- **Official `@google/genai` SDK**: Uses Google's modern Generative AI SDK with system instructions and grounding context.
- **Dynamic Key Reloading**: Updates to `.env` or `.env.local` are detected immediately without needing to restart the server.
- **Full Conversational History**: Retains session conversation turns for multi-turn conversational context.
- **Reliable Fallbacks & Error Handling**: Clear status reporting for unconfigured keys, invalid keys, rate limits, and network errors with retry functionality.

---

## 🔐 Environment Variables Configuration

To enable the AI Assistant, you need a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 1. Configure Your API Key

Create or edit the `.env` (or `.env.local`) file in the **project root directory**:

```env
# Google Gemini API Key for Welfora Assistant
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Gemini model override (defaults to gemini-3.5-flash-lite)
GEMINI_MODEL=gemini-3.5-flash-lite
```

> **Security Note**: Never commit your `.env` or `.env.local` files to Git. Both are listed in `.gitignore`. A `.env.example` template is provided for reference.

---

## 🚀 How to Run the Project

### 1. Install Dependencies

```bash
npm install
```

*(Note: `@google/genai` is already included in `package.json`).*

### 2. Run in Development Mode

```bash
npm run dev
```

This starts the Vite development server with the integrated `/api/chat` backend middleware.

### 3. Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 4. Run Standalone Node Server (Production)

```bash
npm run build
npm run start
```

---

## 🏗️ Architecture & How It Works

```
┌─────────────────────────────────┐
│     React Frontend (UI)         │
│  (src/pages/AssistantPage.jsx)  │
└────────────────┬────────────────┘
                 │ POST /api/chat (messages, schemes)
                 ▼
┌─────────────────────────────────┐
│     Secure Backend Layer        │
│    (server/geminiService.js)    │
│  - Reads GEMINI_API_KEY safely  │
│  - Builds grounded instructions │
│  - Validates conversation turns │
└────────────────┬────────────────┘
                 │ @google/genai SDK
                 ▼
┌─────────────────────────────────┐
│        Google Gemini API        │
│    (gemini-3.5-flash-lite)      │
└─────────────────────────────────┘
```

1. **User asks a question** in the Welfora Assistant chat interface (`/chatbot`).
2. **Frontend service** (`src/services/chatService.js`) sends the session messages to `/api/chat`.
3. **Backend service** (`server/geminiService.js`) dynamically reads `GEMINI_API_KEY` from `.env.local`, `.env`, or system environment.
4. **Grounding context**: Curated scheme data from `src/data/schemes.js` and strict guidelines are injected into the Gemini system instruction.
5. **Gemini SDK** (`@google/genai`) processes the query and returns an accurate, scheme-aware response.
6. **Frontend UI** displays formatted markdown, handles thinking states, and provides retry mechanisms on network errors.

---

## 📚 Syllabus Topics Covered

| Syllabus Topic | Concepts & Implementation | File Location |
| :--- | :--- | :--- |
| **Components & Props** | Parametric reusable UI components passing data, handlers, and visual variants via props | `src/components/Metric.jsx`<br>`src/components/QuickStat.jsx`<br>`src/components/Empty.jsx`<br>`src/components/SchemeCard.jsx` |
| **State Management** | Local controlled state (`useState`), touch tracking, and centralized global state management | `src/components/AuthScreen.jsx`<br>`src/store/useWelforaStore.js` (Zustand)<br>`src/pages/FindSchemesPage.jsx` |
| **`useEffect` & Lifecycle** | Side-effect synchronisation, progress interval tracking, and timer cleanup on unmount | `src/App.jsx` (session timer & cleanup)<br>`src/hooks/useAsync.js`<br>`src/context/ThemeContext.jsx` |
| **Context API** | Scoped global contexts for cross-cutting themes, notifications, and unified facade hook | `src/context/ThemeContext.jsx`<br>`src/context/NotificationContext.jsx`<br>`src/context/WelforaContext.jsx` |
| **Forms & Validation** | Pure validation functions, `noValidate`, per-field `touched` state, onBlur and submit validation | `src/components/AuthScreen.jsx`<br>`src/utils/validators.js`<br>`src/hooks/useForm.js` |
| **Reusable Inputs** | Accessible input wrappers, inline SVG password visibility toggle, select boxes, ARIA attributes | `src/components/forms/InputField.jsx`<br>`src/components/forms/PasswordField.jsx`<br>`src/components/forms/SelectField.jsx` |
| **Async State & Errors** | Asynchronous status machine (`idle`, `pending`, `resolved`, `rejected`), retry banners, and AI error states | `src/hooks/useAsync.js`<br>`src/pages/Dashboard.jsx` (apiLoading & retry)<br>`src/pages/AssistantPage.jsx` |

