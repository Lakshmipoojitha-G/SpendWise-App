import { useEffect, useState } from "react";
import { CATEGORIES, CATEGORY_ICONS } from "../constants";

function ExpenseItem({
    expense,
    onDelete,
    onUpdate,
}) {
    const [editing, setEditing] = useState(false);

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
        </article>
    );
}

export default ExpenseItem;