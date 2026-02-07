<div align="center">
  <img src="public/icon.png" alt="SmartEstate Logo" width="120" height="120" />
  <h1>SmartEstate</h1>
  <p><strong>The Digital Twin for Modern Communities</strong></p>
  <p>A comprehensive property management solution bridging the gap between estate managers and residents through seamless automation and AI.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a>
  </p>

  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
  ![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
  ![React](https://img.shields.io/badge/react-19.0.0-61DAFB.svg?style=flat-square&logo=react&logoColor=black)
  ![Firebase](https://img.shields.io/badge/firebase-12.9.0-FFCA28.svg?style=flat-square&logo=firebase&logoColor=black)
</div>

---

## 📖 Overview

**SmartEstate** is a next-generation property management platform designed to streamline the complexities of residential estate administration. By digitizing interactions, it creates a transparent, efficient, and community-focused environment.

Whether you are an **Estate Manager** overseeing multiple units or a **Tenant** looking for a hassle-free living experience, SmartEstate provides the tools you need in one unified interface.

## ✨ Key Features

### 🏢 For Estate Managers
*   **Dashboard Analytics**: Real-time overview of occupancy, financial health, and pending requests.
*   **Property & Unit Management**: Add, edit, and organize properties with ease.
*   **Tenant Onboarding**: Streamlined invitation and verification process for new residents.
*   **Financial Oversight**: Track rent payments, generate reports, and verify transaction proofs.
*   **Maintenance Dispatch**: Review, assign, and track maintenance tickets from open to resolved.
*   **Community Hub**: Post announcements and updates directly to residents' feeds.

### 🏠 For Tenants
*   **Digital lease & Profile**: Manage personal details and view lease terms.
*   **Seamless Payments**: Upload proof of payment for rent and service charges directly.
*   **Maintenance Requests**: Report issues with photos and track repair status in real-time.
*   **Visitor Management**: (Upcoming) Generate gate codes for guests.
*   **Community Updates**: Stay informed with digital notice boards.

### 🤖 AI-Powered Assistance
*   **Smart Chatbot**: Integrated AI assistant capable of answering FAQS about estate rules, payments, and troubleshooting, with seamless fallback to OpenAI for complex queries.

## 🛠️ Tech Stack

This project is built with a modern, performance-focused stack:

*   **Frontend**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first design
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid UI interactions
*   **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
*   **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
*   **AI Integration**: Custom logic engine + OpenAI API

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   Firebase project credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/smartestate.git
    cd smartestate
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_OpenAI_API_KEY=your_openai_key_optional
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```bash
Smartestate/
├── src/
│   ├── components/      # Reusable UI components (Layouts, UI Kit)
│   ├── context/         # React Context (Auth, Theme)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities and service configs (Firebase, AI)
│   ├── pages/           # Application views (Manager & Tenant portals)
│   └── services/        # API and Data services
├── public/              # Static assets
└── ...config files
```

## 🔐 Security & Roles

*   **Authentication**: Secure login/signup via Firebase Auth.
*   **Role-Based Access Control (RBAC)**: Strict route protection ensures Managers and Tenants only access appropriate areas.
*   **Data Privacy**: Firestore security rules implement strict ownership policies.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by the SmartEstate Team</p>
</div>
