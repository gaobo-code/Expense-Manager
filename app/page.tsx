const transactions = [
  { date: "Aug 11, 2026", amount: "$128.40", category: "Groceries" },
  { date: "Aug 9, 2026", amount: "$42.00", category: "Transportation" },
  { date: "Aug 7, 2026", amount: "$89.99", category: "Shopping" },
  { date: "Aug 5, 2026", amount: "$24.50", category: "Dining" },
  { date: "Aug 2, 2026", amount: "$1,250.00", category: "Housing" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Expense Manager
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Transactions
          </h1>
          <p className="mt-2 text-slate-500">
            A summary of your recent expenses.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right font-semibold" scope="col">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-semibold" scope="col">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr
                    className="transition-colors hover:bg-slate-50"
                    key={`${transaction.date}-${transaction.category}`}
                  >
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700">
                      {transaction.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-semibold tabular-nums text-slate-950">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                        {transaction.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
