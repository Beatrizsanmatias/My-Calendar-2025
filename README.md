# 🗓️ React Calendar App

A modern, minimalist calendar app built with **React + TypeScript**, featuring event creation, color categorization, and optional notifications.  
Users can add events, select custom colors, set notifications, and view daily details via a clean modal interface.

---

## 💻 Tech Stack

- **React** – UI Framework  
- **TypeScript** – Type safety  
- **Lucide React** – Icon library  
- **CSS** – Modern responsive layout  
- **LocalStorage API** – Event persistence  
- **Web Notifications API** – Event reminders  

---

## ✅ Features

- **Interactive monthly calendar** — navigate months easily with previous/next buttons.  
- **Add events** with title, time range, color, and optional notifications.  
- **LocalStorage persistence** — your events stay saved between sessions.  
- **Visual day highlights** — days with events are tinted with their event color.  
- **Responsive design** — works beautifully on both desktop and mobile.  
- **Browser notifications** — get a reminder before events (with permission).  
- **Simple, elegant UI** — designed with accessibility and clarity in mind, using Lucide React.

---

## 📦 Installation & Setup

Clone the repository

```bash
git clone https://github.com/yourusername/react-calendar-app.git
cd react-calendar-app
```

Install dependencies
```bash
npm install
# or
yarn install
```

Run the development server
```bash
npm run dev
```

Then open http://localhost:5173
 (or whatever port Vite assigns).


Build for production
```bash
npm run build
```


Preview the production build
```bash
npm run preview
```

---

## 🧩 Project Structure

```bash
src/
├── components/
│   └── Calendar.tsx        # Main calendar component
├── styles/
│   └── Calendar.css        # Component-specific styles
├── App.tsx                 # App root
└── main.tsx                # React entry point
```
