import { useMemo } from "react";
import { CATEGORY_ICONS } from "../constants";

function CategoryAnalytics({ categoryTotals }) {
    const categories = useMemo(() => {
        return Object.entries(categoryTotals).sort(
            (a, b) => b[1] - a[1]
        );
    }, [categoryTotals]);

    const total = categories.reduce(
        (sum, [, amount]) => sum + amount,
        0
    );

    return (
        <section className="analytics-section" id="analytics">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">ANALYTICS</span>

                    <h2>Spending by Category</h2>

                    <p>
                        Understand where most of your money is going.
                    </p>
                </div>

                <div className="analytics-total">
                    Total
                    <strong>
                        ₹{total.toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            {!categories.length ? (
                <div className="empty-state">
                    <div className="empty-icon">◌</div>

                    <h3>No analytics yet</h3>

                    <p>
                        Add some expenses to see your spending
                        breakdown.
                    </p>
                </div>
            ) : (
                <div className="category-list">
                    {categories.map(([category, amount]) => {
                        const percentage =
                            total > 0 ? (amount / total) * 100 : 0;

                        return (
                            <div className="category-card" key={category}>
                                <div className="category-info">
                                    <div className="category-icon">
                                        {CATEGORY_ICONS[category] || "📦"}
                                    </div>

                                    <div>
                                        <strong>{category}</strong>

                                        <span>
                                            ₹{amount.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                <strong className="percentage">
                                    {percentage.toFixed(1)}%
                                </strong>

                                <div className="progress">
                                    <div
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default CategoryAnalytics;