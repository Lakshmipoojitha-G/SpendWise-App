
const quotes = [
  "Save money today to give yourself more choices tomorrow.",
  "A budget gives every rupee a purpose.",
  "Small savings today create big opportunities tomorrow.",
  "Don't let your expenses decide your financial future.",
  "Financial freedom begins with understanding your spending.",
  "Every rupee saved is a step towards your goals.",
  "Spend wisely, save consistently, and live confidently.",
  "Your financial habits shape your financial future.",
  "Manage your money before it manages you.",
  "A little discipline today creates financial peace tomorrow.",
  "Track every expense. Understand every decision.",
  "Saving is not about sacrifice; it's about priorities.",
  "Make your money work towards the life you want.",
  "Smart spending is the first step towards financial freedom.",
  "Don't spend to impress. Save to progress.",
  "The secret to wealth is simple: spend less than you earn.",
  "A goal without a plan is just a wish. Start budgeting!",
  "Your future self will thank you for today's savings.",
  "Money saved is money earned.",
  "Be mindful of small expenses. They add up.",
  "Financial success starts with small daily decisions.",
  "Give every rupee a job before you spend it.",
  "Spend on what matters, not just what attracts you.",
  "Consistency is more powerful than occasional big savings.",
  "A healthy financial life starts with tracking expenses.",
  "Build habits that make your money grow.",
  "Don't just earn money. Learn to manage it.",
  "Every smart financial decision brings you closer to your goals.",
  "Your budget is a roadmap to financial freedom.",
  "Start where you are. Save what you can. Grow from there."
];

function getDailyQuote() {
  const today = new Date();

  // Calculate a stable day number using the local calendar date.
  const dayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ) / 86400000
  );

  const index = dayNumber % quotes.length;

  return quotes[index];
}

export default function DailyQuote() {
  const quote = getDailyQuote();

  return (
    <section className="daily-quote-card">
      <div className="daily-quote-symbol">✦</div>

      <div className="daily-quote-content">
        <span className="daily-quote-label">
          DAILY MONEY WISDOM
        </span>

        <blockquote>
          "{quote}"
        </blockquote>

        <span className="daily-quote-author">
          — SpendWise
        </span>
      </div>

      <div className="daily-quote-decoration">❝</div>
    </section>
  );
}
