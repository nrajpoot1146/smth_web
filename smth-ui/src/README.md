src/
├── assets/             # Static files (images, fonts, global icons)
│   └── logo.png
│
├── components/         # Reusable UI parts (Buttons, Navbars, Cards)
│   ├── Navbar.jsx
│   └── Button.jsx
│
├── pages/              # Full screens (matches your Django URLs)
│   ├── Home.jsx        # Route: /
│   ├── Login.jsx       # Route: /login
│   └── Dashboard.jsx   # Route: /dashboard
│
├── services/           # API calls (Connecting to Django)
│   ├── api.js          # Axios setup (base URL, headers)
│   └── auth.js         # Login/Register API functions
│
├── context/            # Global state (User login status, Theme)
│   └── AuthContext.js
│
├── utils/              # Helper functions (Date formatting, validators)
│   └── formatDate.js
│
├── App.jsx             # Main Router setup
└── main.jsx            # Entry point (imports CSS and App)