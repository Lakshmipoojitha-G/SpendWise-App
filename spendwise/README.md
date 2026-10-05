# 💰 SpendWise — Personal Expense Tracker & Financial Intelligence

> A modern, responsive personal finance and expense tracking web application built with **React 19** and **Vite**. Features real-time categorization, monthly budget tracking, smart savings insights, and secure client-side session management.

---

## ✨ Features

- **🔐 Authentication & Session Security**:
  - Demo account with 1-click test login (`demo@spendwise.com` / `123456`) or custom credentials.
  - Automatic session timeout after 30 minutes of inactivity to safeguard financial data.
  - Client-side storage scoped per user account (`spendwise-expenses-[userId]`).

- **📊 Comprehensive Financial Dashboard**:
  - **Financial Hero Banner**: Visual pulse of current month's spending and remaining budget.
  - **Monthly Budget Tracker**: Real-time progress bar with color-coded status badges (On Track, High Usage, Budget Alert).
  - **KPI Summary Grid**: Total outflow, transaction count, average per transaction, and highest expense.
  - **Dual Spending Spotlight**:
    - Top Outflow Category with actionable money-saving tips.
    - Wealth & Emergency Fund Target with visual 3D savings goal progress.
  - **Category Breakdown Analytics**: Percentage distribution and progress bars across Food, Transportation, Shopping, Bills, Entertainment, Health, and Other.
  - **Proven Money Principles**: Smart guidance including the 50/30/20 rule, Zero-Based Budgeting, and the 24-hour buffer rule.

- **💳 Transaction Management**:
  - Add new expenses with description, category, amount (₹ INR), and date.
  - Inline editing and instant deletion.
  - Real-time search by description with clear button.
  - Category filtering.

- **👤 User Profile Management**:
  - View and edit full name and email.
  - Profile cover banner and user avatar with initials.
  - Session and security controls with confirmation modal before logout.

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Pure Modern CSS with custom variables and glassmorphism (No heavy utility framework dependencies)
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Icons**: Unicode & SVG icons
- **Storage**: Browser LocalStorage with multi-user isolation

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lakshmipoojitha-G/SpendWise.git
   cd SpendWise
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173).

---

## ⚡ Demo Account

For quick testing without creating an account:
- **Email**: `demo@spendwise.com`
- **Password**: `123456`
- Or simply click the **"⚡ 1-Click Demo Login"** button on the sign-in page.

---

## 🌐 Deployment (Vercel / Netlify)

This project is optimized for 1-click deployment on platforms like **Vercel** or **Netlify**:

### Deploying on Vercel:
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and log in with GitHub.
3. Click **"Add New Project"** and import `SpendWise`.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your live app will be ready in seconds!

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
