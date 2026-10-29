import { useEffect, useState } from "react";
import { CATEGORIES, CATEGORY_ICONS } from "../constants";

function ExpenseItem({
    expense,
    onDelete,
    onUpdate,
}) {
    const [editing, setEditing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

    const [form, setForm] = useState({
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
    });

    const [error, setError] = useState("");

    useEffect(() => {
        setForm({
            description: expense.description,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
        });
    }, [expense]);

    function change(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function save() {
        if (
            !form.description.trim() ||
            !form.category ||
            !form.amount ||
            !form.date
        ) {
            setError("Please complete all fields.");
            return;
        }

        if (Number(form.amount) <= 0) {
            setError("Amount must be greater than ₹0.");
            return;
        }

        onUpdate({
            ...expense,
            description: form.description.trim(),
            category: form.category,
            amount: Number(form.amount),
            date: form.date,
        });

        setEditing(false);
        setError("");
    }

    function cancel() {
        setForm({
            description: expense.description,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
        });

        setError("");
        setEditing(false);
    }

    if (editing) {
        return (
            <article className="expense-item editing">
                <div className="edit-title">
                    <strong>Edit Transaction</strong>

                    <button onClick={cancel}>×</button>
                </div>

                <div className="edit-grid">
                    <div>
                        <label>Description</label>

                        <input
                            name="description"
                            value={form.description}
                            onChange={change}
                        />
                    </div>

                    <div>
                        <label>Category</label>

                        <select
                            name="category"
                            value={form.category}
                            onChange={change}
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {CATEGORY_ICONS[category]} {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Amount</label>

                        <input
                            name="amount"
                            type="number"
                            min="1"
                            value={form.amount}
                            onChange={change}
                        />
                    </div>

                    <div>
                        <label>Date</label>

                        <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={change}
                        />
                    </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="edit-actions">
                    <button className="primary-button" onClick={save}>
                        Save
                    </button>

                    <button
                        className="secondary-button"
                        onClick={cancel}
                    >
                        Cancel
                    </button>
                </div>
            </article>
        );
    }

    return (
        <article className="expense-item">
            <div className="expense-left">
                <div className="expense-icon">
                    {CATEGORY_ICONS[expense.category] || "📦"}
                </div>

                <div>
                    <h3>{expense.description}</h3>

                    <p>
                        {expense.category} <span>•</span>{" "}
                        {new Date(
                            `${expense.date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="expense-right">
                <strong>
                    ₹{Number(expense.amount).toLocaleString("en-IN")}
                </strong>

                {expense.receipt_url && (
                    <button
                        type="button"
                        className={`receipt-badge ${expense.receipt_verified ? "verified" : "unverified"}`}
                        onClick={() => setShowReceipt(true)}
                        title={expense.receipt_verified ? "Bill verified" : "Bill amount mismatch"}
                    >
                        🧾 {expense.receipt_verified ? "Receipt ✓" : "Receipt ⚠"}
                    </button>
                )}

                <button
                    className="edit-button"
                    onClick={() => setEditing(true)}
                >
                    Edit
                </button>

                <button
                    className="delete-button"
                    onClick={() => onDelete(expense.id)}
                >
                    Delete
                </button>
            </div>

            {/* RECEIPT VIEWER MODAL */}
            {showReceipt && expense.receipt_url && (
                <div className="receipt-modal-overlay" onClick={() => setShowReceipt(false)}>
                    <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="receipt-modal-header">
                            <div>
                                <span className="eyebrow">BILL / RECEIPT</span>
                                <h3>{expense.description}</h3>
                            </div>
                            <button className="close-button" onClick={() => setShowReceipt(false)}>×</button>
                        </div>

                        <div className="receipt-modal-amounts">
                            <div className="receipt-amount-row">
                                <span>Entered Amount</span>
                                <strong>₹{Number(expense.amount).toLocaleString("en-IN")}</strong>
                            </div>
                            {expense.receipt_amount && (
                                <div className="receipt-amount-row">
                                    <span>Bill Amount</span>
                                    <strong>₹{Number(expense.receipt_amount).toLocaleString("en-IN")}</strong>
                                </div>
                            )}
                            <div className={expense.receipt_verified ? "amount-match" : "amount-mismatch"}>
                                {expense.receipt_verified
                                    ? "✓ Bill amount matches the entered amount."
                                    : "⚠ Bill amount does not match the entered amount. Please review."
                                }
                            </div>
                        </div>

                        <div className="receipt-modal-image">
                            {expense.receipt_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img src={expense.receipt_url} alt="Receipt" />
                            ) : (
                                <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer"
                                   className="receipt-pdf-link">
                                    📄 Open Receipt (PDF)
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

export default ExpenseItem;