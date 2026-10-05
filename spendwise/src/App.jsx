import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import SummaryCard from "./components/SummaryCard";
import ExpenseList from "./components/ExpenseList";
import CategoryAnalytics from "./components/CategoryAnalytics";

import { authAPI, expensesAPI, budgetAPI, getAccessToken } from "./api";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Entertainment: "🎬",
  Health: "❤️",
  Other: "📦",
};

const emptyExpense = {
  description: "",
  category: "Food",
  amount: "",
  date: new Date().toISOString().split("T")[0],
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [showExpenseDrawer, setShowExpenseDrawer] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [budgetInput, setBudgetInput] = useState("");

  const [toast, setToast] = useState("");
  const [profileUser, setProfileUser] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  /* ---------------- RESTORE SESSION ON MOUNT ---------------- */

  useEffect(() => {
    async function checkSession() {
      if (getAccessToken()) {
        try {
          const user = await authAPI.getProfile();
          setCurrentUser(user);
          setProfileUser(user);
        } catch {
          // Token invalid — stay on login
        }
      }
      setAuthChecked(true);
    }
    checkSession();
  }, []);

  /* ---------------- LOAD DATA WHEN USER LOGS IN ---------------- */

  const loadUserData = useCallback(async (user) => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [expensesData, budgetData] = await Promise.all([
        expensesAPI.getAll(),
        budgetAPI.get(),
      ]);
      // DRF returns paginated results or array
      const list = Array.isArray(expensesData)
        ? expensesData
        : expensesData?.results || [];
      setExpenses(list);
      setBudget(Number(budgetData?.amount) || 0);
      setBudgetInput(budgetData?.amount ? String(budgetData.amount) : "");
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser);
    }
  }, [currentUser, loadUserData]);

  /* ---------------- TOAST ---------------- */

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---------------- CALCULATIONS ---------------- */

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  }, [expenses]);

  const remainingBudget = Math.max(budget - totalSpent, 0);

  const budgetPercentage =
    budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach((expense) => {
      if (!totals[expense.category]) totals[expense.category] = 0;
      totals[expense.category] += Number(expense.amount);
    });
    return totals;
  }, [expenses]);

  const highestCategory = useMemo(() => {
    const entries = Object.entries(categoryTotals);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [categoryTotals]);

  /* ---------------- FILTER (client-side on fetched data) -------- */

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((expense) => expense.category === categoryFilter);
    }

    if (sortBy === "latest") result.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "highest") result.sort((a, b) => Number(b.amount) - Number(a.amount));
    if (sortBy === "lowest") result.sort((a, b) => Number(a.amount) - Number(b.amount));

    return result;
  }, [expenses, search, categoryFilter, sortBy]);

  /* ---------------- LOGIN ---------------- */

  function handleLogin(user) {
    setCurrentUser(user);
    setProfileUser(user);
    setCurrentPage("dashboard");
    setToast(`Welcome${user.name ? ", " + user.name.split(" ")[0] : ""}! 🎉`);
  }

  /* ---------------- LOGOUT ---------------- */

  function handleLogoutRequest() {
    setShowLogoutModal(true);
  }

  async function handleLogout() {
    await authAPI.logout();
    setCurrentUser(null);
    setExpenses([]);
    setBudget(0);
    setShowLogoutModal(false);
    setCurrentPage("dashboard");
  }

  /* ---------------- PROFILE ---------------- */

  function handleProfileSave(updatedUser) {
    setCurrentUser(updatedUser);
    setProfileUser(updatedUser);
    setToast("Profile updated successfully!");
  }

  /* ---------------- EXPENSE ---------------- */

  function openExpenseDrawer() {
    setExpenseForm({
      ...emptyExpense,
      date: new Date().toISOString().split("T")[0],
    });
    setShowExpenseDrawer(true);
  }

  function closeExpenseDrawer() {
    setShowExpenseDrawer(false);
  }

  function handleExpenseChange(event) {
    const { name, value } = event.target;
    setExpenseForm((prev) => ({ ...prev, [name]: value }));
  }

  async function addExpense(event) {
    event.preventDefault();

    if (
      !expenseForm.description.trim() ||
      !expenseForm.category ||
      !expenseForm.amount ||
      !expenseForm.date
    ) {
      setToast("Please complete all fields.");
      return;
    }

    if (Number(expenseForm.amount) <= 0) {
      setToast("Amount must be greater than ₹0.");
      return;
    }

    try {
      const newExpense = await expensesAPI.create({
        description: expenseForm.description.trim(),
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
      });

      setExpenses((prev) => [newExpense, ...prev]);
      setShowExpenseDrawer(false);
      setExpenseForm(emptyExpense);
      setToast("Expense added successfully!");
    } catch (err) {
      setToast(err?.error || "Failed to add expense.");
    }
  }

  async function deleteExpense(id) {
    try {
      await expensesAPI.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setToast("Expense deleted.");
    } catch {
      setToast("Failed to delete expense.");
    }
  }

  async function updateExpense(updatedExpense) {
    try {
      const saved = await expensesAPI.update(updatedExpense.id, {
        description: updatedExpense.description,
        category: updatedExpense.category,
        amount: updatedExpense.amount,
        date: updatedExpense.date,
      });
      setExpenses((prev) =>
        prev.map((e) => (e.id === saved.id ? saved : e))
      );
      setToast("Expense updated successfully!");
    } catch {
      setToast("Failed to update expense.");
    }
  }

  /* ---------------- BUDGET ---------------- */

  async function saveBudget(event) {
    event.preventDefault();

    const amount = Number(budgetInput);
    if (!amount || amount <= 0) {
      setToast("Please enter a valid budget.");
      return;
    }

    try {
      const saved = await budgetAPI.set(amount);
      setBudget(Number(saved.amount));
      setShowBudgetModal(false);
      setToast("Monthly budget updated!");
    } catch {
      setToast("Failed to save budget.");
    }
  }

  /* ---------------- INSIGHT ---------------- */

  function getInsight() {
    if (!expenses.length)
      return "Start by adding your first expense. SpendWise will automatically analyze your spending.";

    if (budget > 0 && totalSpent > budget)
      return `You are ₹${(totalSpent - budget).toLocaleString("en-IN")} over your monthly budget. Consider reviewing your largest spending categories.`;

    if (highestCategory)
      return `${highestCategory[0]} is currently your largest spending category at ₹${highestCategory[1].toLocaleString("en-IN")}.`;

    return "Your spending is being tracked successfully.";
  }

  /* ---------------- AUTH LOADING STATE ---------------- */

  if (!authChecked) {
    return (
      <div className="app-loading">
        <div className="brand-mark large">S</div>
        <p>Loading SpendWise…</p>
      </div>
    );
  }

  /* ---------------- LOGIN SCREEN ---------------- */

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  /* ---------------- PROFILE PAGE ---------------- */

  if (currentPage === "profile") {
    return (
      <Profile
        user={profileUser || currentUser}
        onSave={handleProfileSave}
        onLogout={handleLogout}
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  /* ---------------- DASHBOARD ---------------- */

  return (
    <div className="app">
      <Navbar
        user={currentUser}
        onDashboard={() => {
          setCurrentPage("dashboard");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onTransactions={() =>
          document
            .getElementById("transactions")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        onAnalytics={() =>
          document
            .getElementById("analytics")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        onProfile={() => setCurrentPage("profile")}
        onLogoutRequest={handleLogoutRequest}
      />

      <main className="dashboard">
        {/* HERO */}

        <section className="hero">
          <div>
            <span className="eyebrow">PERSONAL FINANCE</span>

            <h1>
              Understand where
              <br />
              your money goes.
            </h1>

            <p>
              Track your expenses, manage your budget and build
              smarter financial habits with SpendWise.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openExpenseDrawer}
          >
            + Add Expense
          </button>
        </section>

        {/* SUMMARY */}

        <section className="summary-grid">
          <SummaryCard
            title="Total Spent"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            description="Across all transactions"
            icon="💰"
            iconClass="green"
          />

          <SummaryCard
            title="Monthly Budget"
            value={
              budget
                ? `₹${budget.toLocaleString("en-IN")}`
                : "Not Set"
            }
            description="Your spending limit"
            icon="🎯"
            iconClass="blue"
          />

          <SummaryCard
            title="Remaining"
            value={`₹${remainingBudget.toLocaleString("en-IN")}`}
            description={
              budget > 0
                ? `${Math.round(budgetPercentage)}% used`
                : "Set a budget to track"
            }
            icon="📊"
            iconClass="purple"
          />

          <SummaryCard
            title="Transactions"
            value={expenses.length}
            description="Recorded expenses"
            icon="🧾"
            iconClass="orange"
          />
        </section>

        {/* BUDGET */}

        <section className="budget-card">
          <div>
            <span className="eyebrow">MONTHLY BUDGET</span>

            <h2>
              {budget
                ? `₹${totalSpent.toLocaleString("en-IN")} of ₹${budget.toLocaleString("en-IN")}`
                : "Set your monthly budget"}
            </h2>

            <p>
              {budget
                ? `${Math.round(budgetPercentage)}% of your budget has been used.`
                : "Choose a budget that matches your spending preferences."}
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() => {
              setBudgetInput(budget ? String(budget) : "");
              setShowBudgetModal(true);
            }}
          >
            {budget ? "Edit Budget" : "Set Budget"}
          </button>

          {budget > 0 && (
            <div className="budget-progress">
              <div style={{ width: `${budgetPercentage}%` }} />
            </div>
          )}
        </section>

        {/* INSIGHT */}

        <section className="insight-card">
          <div className="insight-icon">✦</div>

          <div>
            <span className="eyebrow">SMART INSIGHT</span>
            <h3>What your spending tells you</h3>
            <p>{getInsight()}</p>
          </div>
        </section>

        {/* TRANSACTIONS */}

        <section className="section-block" id="transactions">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRANSACTIONS</span>
              <h2>Your Expenses</h2>
              <p>Search, filter and manage your spending.</p>
            </div>

            <button
              className="primary-button small"
              onClick={openExpenseDrawer}
            >
              + Add Expense
            </button>
          </div>

          <div className="controls">
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="All">All Categories</option>

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_ICONS[category]} {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          {dataLoading ? (
            <div className="loading-state">Loading expenses…</div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={deleteExpense}
              onUpdate={updateExpense}
            />
          )}
        </section>

        {/* ANALYTICS */}

        <CategoryAnalytics categoryTotals={categoryTotals} />

        {/* HABITS */}

        <section className="habits">
          <div>
            <span className="eyebrow">FINANCIAL HABITS</span>
            <h2>Small changes create better money habits.</h2>
          </div>

          <div className="habit-grid">
            <div>
              <span>01</span>
              <h3>Track consistently</h3>
              <p>
                Record expenses as soon as they happen so
                your dashboard stays accurate.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Review categories</h3>
              <p>
                Check which areas consume most of your
                monthly spending.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Set realistic limits</h3>
              <p>
                Use your spending history to create a
                practical monthly budget.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* EXPENSE DRAWER */}

      {showExpenseDrawer && (
        <div
          className="overlay"
          onClick={closeExpenseDrawer}
        >
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="eyebrow">NEW TRANSACTION</span>
                <h2>Add Expense</h2>
              </div>

              <button
                className="close-button"
                onClick={closeExpenseDrawer}
              >
                ×
              </button>
            </div>

            <form onSubmit={addExpense}>
              <label>Description</label>
              <input
                name="description"
                value={expenseForm.description}
                onChange={handleExpenseChange}
                placeholder="e.g. Lunch with friends"
              />

              <label>Category</label>
              <select
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_ICONS[category]} {category}
                  </option>
                ))}
              </select>

              <label>Amount</label>
              <input
                name="amount"
                type="number"
                min="1"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                placeholder="₹0"
              />

              <label>Date</label>
              <input
                name="date"
                type="date"
                value={expenseForm.date}
                onChange={handleExpenseChange}
              />

              <button className="primary-button full">
                Save Expense
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* BUDGET MODAL */}

      {showBudgetModal && (
        <div
          className="overlay"
          onClick={() => setShowBudgetModal(false)}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setShowBudgetModal(false)}
            >
              ×
            </button>

            <span className="eyebrow">MONTHLY PLANNING</span>

            <h2>Set your budget</h2>

            <p>
              Choose the maximum amount you want to spend
              this month.
            </p>

            <form onSubmit={saveBudget}>
              <input
                type="number"
                min="1"
                value={budgetInput}
                onChange={(event) =>
                  setBudgetInput(event.target.value)
                }
                placeholder="Enter amount"
                autoFocus
              />

              <button className="primary-button full">
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}

      {showLogoutModal && (
        <div
          className="overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="modal logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-icon">↗</div>

            <h2>Logout from SpendWise?</h2>

            <p>
              All your data is safely stored in the cloud
              and will be here when you return.
            </p>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="danger-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;