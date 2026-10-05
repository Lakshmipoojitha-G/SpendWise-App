import ExpenseItem from "./ExpenseItem";

function ExpenseList({
    expenses,
    onDelete,
    onUpdate,
}) {
    if (!expenses.length) {
        return (
            <div className="empty-state">
                <div className="empty-icon">₹</div>

                <h3>No expenses found</h3>

                <p>
                    Add an expense or change your search/filter.
                </p>
            </div>
        );
    }

    return (
        <div className="expense-list">
            {expenses.map((expense) => (
                <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}

export default ExpenseList;