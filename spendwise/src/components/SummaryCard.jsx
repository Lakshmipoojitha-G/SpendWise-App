function SummaryCard({
    title,
    value,
    description,
    icon,
    iconClass = "",
}) {
    return (
        <article className="summary-card">
            <div className="summary-top">
                <div className={`summary-icon ${iconClass}`}>
                    {icon}
                </div>

                <span className="summary-title">
                    {title}
                </span>
            </div>

            <strong className="summary-value">
                {value}
            </strong>

            <p>{description}</p>
        </article>
    );
}

export default SummaryCard;