# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction
This chapter presents a comprehensive analysis of the SmartEstate property management system and details its architectural, structural, and behavioral design. It outlines the requirements specification, proposed system architecture, database design, and the logical flow that guided the implementation of the platform.

## 3.2 Analysis of Existing System
The existing system of property and tenant management largely relies on semi-digital or entirely manual paradigms, such as physical ledgers, disconnected spreadsheet applications, and fragmented communication channels (e.g., informal messaging apps and physical notice boards). 

**Limitations observed:**
*   Data redundancy and inconsistency across multiple platforms.
*   High latency in maintenance request processing.
*   Lack of centralized payment tracking and financial oversight.
*   Poor communication between property managers and tenants.
*   The absence of a unified dashboard creates administrative bottlenecks and degrades the overall tenant experience.

## 3.3 Proposed System
To address the aforementioned constraints, the proposed system, **"SmartEstate,"** is a comprehensive, web-based property management solution designed to bridge the gap between property managers and tenants. 

*   **Target Users:** Property Managers and Tenants.
*   **Core Objectives:** Automating property and unit onboarding, facilitating real-time maintenance requests and tracking, integrating secure payment logs, and providing a centralized community hub. 
*   **Key Improvements:** A role-based modular architecture, a cloud-hosted NoSQL data repository for real-time synchronization, and an integration of an AI Chatbot to assist users dynamically.

## 3.4 System Requirements

### 3.4.1 Functional Requirements
Based on the implemented controllers, routes, and UI components, the system comprises the following functional requirements:
1.  **User Authentication and Authorization:** The system must provide secure registration and login mechanisms separated by roles (`RegisterManager`, `RegisterTenant`, `Login`).
2.  **Property and Unit Management:** Managers must be able to add, view, and manage property details and individual units (`AddUnit`, `Properties`, `PropertyDetails`).
3.  **Tenant Onboarding and Management:** Managers must be able to oversee tenants, while tenants must undergo a pending approval phase before gaining full access (`Onboarding`, `Tenants`, `PendingApproval`).
4.  **Maintenance Tracking:** Tenants must be able to initiate maintenance requests (`NewMaintenance`), while managers track, update, and resolve these requests (`Maintenance`, `TenantRequestDetails`).
5.  **Financial Operations:** Tenants must be able to make payments and view transaction details (`MakePayment`, `TransactionDetails`), and managers must have an overview of all financial inflows (`Payments`).
6.  **Communication Hub:** Users will interact via a centralized community module and an AI-driven chatbot (`Community`, `AIChatbot`).

### 3.4.2 Non-Functional Requirements
1.  **Security Mechanisms:** The system restricts unauthorized data access using robust environment configurations, route guards via `AuthContext`, and secure database rules (`firestore.rules`, `storage.rules`).
2.  **Performance Optimization:** The user interface employs responsive loaders (`Loader.jsx`) and asynchronous state management to prevent blocking the main rendering thread.
3.  **Maintainability:** The application utilizes a modular Component-Based Architecture and the MVC-like separation of concerns (Components, Pages, Lib/Services) to facilitate future extension.
4.  **Usability:** The interface is highly intuitive, leveraging clean UI layouts (`DashboardLayout.jsx`, Tailwind CSS configurations) for an optimal user experience.

## 3.5 System Architecture
The system adopts a **Serverless Client-Server Architecture**. 

*   **Frontend Architecture:** The client-side is a Single Page Application (SPA) built utilizing React.js alongside Vite for optimized bundling. It manages state and routing dynamically on the client, utilizing `AuthContext` for global authentication state management.
*   **Backend Architecture:** Instead of a traditional monolithic backend, the system employs Backend-as-a-Service (BaaS) via Firebase. Custom server-side logic and automated email triggers are handled by isolated serverless functions (`functions/index.js`, `functions/emailTemplate.js`).
*   **Database Structure:** The system relies on a real-time, cloud-hosted NoSQL database (Firebase Firestore) to parse and distribute document-oriented data to the client efficiently.
*   **Request Flow:** A client initiates an action (e.g., submitting a maintenance query). The React component invokes a utility function from the `lib/` directory, which standardizes the payload and communicates with Firestore or Cloud Functions asynchronously. Responses update the React state, prompting UI recalibration without page reloads.

## 3.6 System Design Models

### Use Case Diagram
Identifies two primary actors:
*   **Manager Actor:** Interacts with use cases such as Add Property, Approve Tenant, View Payments, and Update Maintenance Status. 
*   **Tenant Actor:** Interacts with Register, View Dashboard, Request Maintenance, and Make Payment.

### Class Diagram
Comprises discrete entities mirroring the data models: 
*   `User` (sub-classed into `Manager` and `Tenant`)
*   `Property` 
*   `Unit`
*   `MaintenanceRequest`
*   `PaymentTransaction`
*A Manager aggregate contains multiple Properties, which in turn contain Units.*

### Sequence Diagram (Example: Login Workflow)
1.  The user accesses the `RoleSelection` page.
2.  Proceeds to the respective `/auth` endpoint and submits credentials.
3.  The Authentication Controller validates the payload against Firebase Auth.
4.  A secure token is generated.
5.  The global `AuthContext` stores the session securely.
6.  The Router automatically redirects the user to the appropriate `Dashboard` based on their role.

### ER Diagram Description
The Entity-Relationship model revolves around a NoSQL Document Structuring pattern. A `Users` collection connects to a role attribute. `Properties` collections hold embedded or referenced `Units`. `Maintenance` documents possess references to both the `Unit` and the `User` (Tenant) that triggered them, along with status strings.

## 3.7 Database Design
The application schema leverages a NoSQL document-based structure mapped equivalently to tables in traditional relational databases:

| Collection / Table | Fields | Primary Key | Foreign Key | Relationships |
| :--- | :--- | :--- | :--- | :--- |
| **Users** | ID, Name, Email, Role, CreatedAt | Document ID | None | One-to-Many with Properties/Maintenance |
| **Properties** | ID, Manager ID, Address, Name | Property ID | Manager ID | One-to-Many with Units |
| **Units** | ID, Property ID, Tenant ID, Status | Unit ID | Property ID, Tenant ID | One-to-One with Tenant |
| **Maintenance** | ID, Tenant ID, Unit ID, Description, Status | Request ID | Tenant ID, Unit ID | Many-to-One with Tenant/Unit |
| **Payments** | ID, Tenant ID, Amount, Method, Date, Status | Transaction ID| Tenant ID | Many-to-One with Tenant |

**Normalization Level:** The database structure relies on controlled denormalization appropriate for NoSQL performance, ensuring fast read times for real-time dashboard presentation while avoiding deep multi-collection joins.

## 3.8 System Flow / Algorithms

*   **Authentication Process:** Validates via Firebase OAuth/Email providers. Role checks ensure users cannot access unauthorized dashboards.
*   **Tenant Onboarding & Matching Logic:** When a tenant registers, their state defaults to `PendingApproval`. The matching algorithm checks the tenant's requested unit against the `Properties` collection. If the unit is marked "vacant", the manager receives an alert.
*   **Automation Logic:** Upon manager validation, the backend transactionally updates the tenant's role permission and shifts the unit state to "occupied", preventing race conditions or double booking.

## 3.9 Development Tools
*   **Programming Languages:** JavaScript (ES6+), JSX, HTML5, CSS3.
*   **Frameworks & Libraries:** React.js, Vite, Tailwind CSS (for utility-first styling), PostCSS, React Router.
*   **Backend & Database:** Node.js (Cloud Functions), Firebase Authentication, Firestore (NoSQL), Firebase Storage.
*   **Hosting Configuration:** Vercel (Frontend), Firebase Functions (Backend).
*   **Version Control:** Git & GitHub.
