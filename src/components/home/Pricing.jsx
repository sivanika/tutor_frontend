export default function Pricing() {
  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      period: "/7 days",
      highlight: false,
      features: [
        "Access to limited tutors",
        "2 demo sessions",
        "Basic dashboard",
        "Community support",
      ],
    },
    {
      name: "Premium Subscription",
      price: "₹999",
      period: "/month",
      highlight: true,
      features: [
        "Unlimited sessions",
        "All verified professors",
        "Priority booking",
        "Session recordings",
        "Analytics & progress tracking",
      ],
    },
    {
      name: "Pay Per Session",
      price: "18%",
      period: " commission",
      highlight: false,
      features: [
        "No monthly fee",
        "Book anytime",
        "All tutors access",
        "Pay only when you learn",
        "Flexible payments",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="
        py-24
        bg-slate-50
        dark:bg-gradient-to-b dark:from-slate-900 dark:to-black
        transition-colors duration-500
      "
    >
      {/* Heading */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl font-extrabold mb-4 text-slate-800 dark:text-slate-100">
          Simple & Transparent Pricing
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Choose the perfect plan that matches your learning style and budget.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`
              relative p-8 rounded-2xl
              backdrop-blur-xl
              border
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl

              ${
                plan.highlight
                  ? `
                    bg-white dark:bg-slate-900
                    border-slate-300 dark:border-slate-700
                    shadow-xl scale-105
                  `
                  : `
                    bg-white/80 dark:bg-slate-900/80
                    border-slate-200 dark:border-slate-800
                    shadow-md
                  `
              }
            `}
          >
            {/* Popular badge */}
            {plan.highlight && (
              <span
                className="
                  absolute -top-4 left-1/2 -translate-x-1/2
                  bg-slate-900 text-white
                  dark:bg-white dark:text-black
                  text-xs font-semibold
                  px-4 py-1 rounded-full
                "
              >
                MOST POPULAR
              </span>
            )}

            {/* Plan name */}
            <h3 className="text-xl font-semibold mb-4 text-center text-slate-800 dark:text-slate-100">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                {plan.price}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {plan.period}
              </span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((f, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <span className="text-slate-400">✔</span> {f}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`
                w-full py-3 rounded-lg font-semibold
                transition

                ${
                  plan.highlight
                    ? `
                      bg-slate-900 text-white
                      dark:bg-white dark:text-black
                      hover:opacity-90
                    `
                    : `
                      bg-slate-200 text-slate-900
                      dark:bg-slate-800 dark:text-white
                      hover:bg-slate-300 dark:hover:bg-slate-700
                    `
                }
              `}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
