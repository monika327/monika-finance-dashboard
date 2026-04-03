import { useState, useMemo } from "react";


const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2025-01-05", desc: "Salary",           category: "Income",        type: "income",  amount: 85000 },
  { id: 2,  date: "2025-01-08", desc: "AWS Bill",          category: "Tech",          type: "expense", amount: 4200  },
  { id: 3,  date: "2025-01-12", desc: "Groceries",         category: "Food",          type: "expense", amount: 3800  },
  { id: 4,  date: "2025-01-15", desc: "Netflix",           category: "Entertainment", type: "expense", amount: 649   },
  { id: 5,  date: "2025-01-18", desc: "Freelance Project", category: "Income",        type: "income",  amount: 25000 },
  { id: 6,  date: "2025-01-22", desc: "Zomato",            category: "Food",          type: "expense", amount: 1200  },
  { id: 7,  date: "2025-01-25", desc: "Metro Pass",        category: "Transport",     type: "expense", amount: 600   },
  { id: 8,  date: "2025-02-01", desc: "Salary",            category: "Income",        type: "income",  amount: 85000 },
  { id: 9,  date: "2025-02-05", desc: "Rent",              category: "Housing",       type: "expense", amount: 22000 },
  { id: 10, date: "2025-02-10", desc: "Udemy Course",      category: "Education",     type: "expense", amount: 1499  },
  { id: 11, date: "2025-02-14", desc: "Dining Out",        category: "Food",          type: "expense", amount: 2800  },
  { id: 12, date: "2025-02-18", desc: "Topmate Income",    category: "Income",        type: "income",  amount: 12000 },
  { id: 13, date: "2025-02-22", desc: "Electricity Bill",  category: "Utilities",     type: "expense", amount: 1800  },
  { id: 14, date: "2025-02-26", desc: "Spotify",           category: "Entertainment", type: "expense", amount: 119   },
  { id: 15, date: "2025-03-01", desc: "Salary",            category: "Income",        type: "income",  amount: 85000 },
  { id: 16, date: "2025-03-04", desc: "Azure Certification",category: "Education",    type: "expense", amount: 4500  },
  { id: 17, date: "2025-03-08", desc: "Groceries",         category: "Food",          type: "expense", amount: 4100  },
  { id: 18, date: "2025-03-12", desc: "Cab Rides",         category: "Transport",     type: "expense", amount: 1500  },
  { id: 19, date: "2025-03-15", desc: "Training Income",   category: "Income",        type: "income",  amount: 18000 },
  { id: 20, date: "2025-03-20", desc: "New Laptop Parts",  category: "Tech",          type: "expense", amount: 8500  },
];

const CATEGORIES = ["Food", "Tech", "Housing", "Transport", "Entertainment", "Education", "Utilities", "Income"];
const MONTHS = ["Jan 2025", "Feb 2025", "Mar 2025"];

const CATEGORY_COLORS = {
  Food:          "#f97316",
  Tech:          "#3b82f6",
  Housing:       "#8b5cf6",
  Transport:     "#06b6d4",
  Entertainment: "#ec4899",
  Education:     "#10b981",
  Utilities:     "#f59e0b",
  Income:        "#22c55e",
};


const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

function getMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short", year: "numeric" });
}



function SummaryCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: "#1e2530",
      border: `1px solid #2a3340`,
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: color, borderRadius: "12px 0 0 12px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ color: "#8899aa", fontSize: 13, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ color: "#f0f4f8", fontSize: 26, fontWeight: 700, letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ color: "#556677", fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#8899aa", fontSize: 11 }}>{fmt(d.value)}</span>
          <div style={{
            width: "100%",
            height: `${Math.max((d.value / max) * 90, 4)}px`,
            background: d.color || "#3b82f6",
            borderRadius: "4px 4px 0 0",
            transition: "height 0.4s ease",
            minHeight: 4,
          }} />
          <span style={{ color: "#667788", fontSize: 12 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumPct = 0;
  const slices = data.map(d => {
    const pct = total ? d.value / total : 0;
    const start = cumPct;
    cumPct += pct;
    return { ...d, start, end: cumPct, pct };
  });

  const r = 60, cx = size / 2, cy = size / 2;

  function arc(start, end) {
    if (end - start >= 1) end = 0.9999;
    const s = start * 2 * Math.PI - Math.PI / 2;
    const e = end * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={arc(s.start, s.end)} fill={s.color} opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={36} fill="#1e2530" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#f0f4f8" fontSize={11} fontWeight={700}>TOTAL</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#8899aa" fontSize={9}>EXPENSES</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: "#8899aa", fontSize: 12, minWidth: 90 }}>{s.label}</span>
            <span style={{ color: "#c8d8e8", fontSize: 12, fontFamily: "monospace" }}>{(s.pct * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionRow({ tx, isAdmin, onEdit }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "90px 1fr 110px 80px 70px",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 8,
      background: "#181e27",
      alignItems: "center",
      fontSize: 13,
    }}>
      <span style={{ color: "#667788", fontFamily: "monospace" }}>{tx.date.slice(5)}.{tx.date.slice(0,4)}</span>
      <span style={{ color: "#c8d8e8" }}>{tx.desc}</span>
      <span style={{
        background: CATEGORY_COLORS[tx.category] + "22",
        color: CATEGORY_COLORS[tx.category],
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        textAlign: "center",
      }}>{tx.category}</span>
      <span style={{
        color: tx.type === "income" ? "#22c55e" : "#f87171",
        fontFamily: "monospace",
        fontWeight: 600,
        textAlign: "right",
      }}>
        {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
      </span>
      {isAdmin ? (
        <button onClick={() => onEdit(tx)} style={{
          background: "#2a3340",
          color: "#8899aa",
          border: "none",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          cursor: "pointer",
        }}>Edit</button>
      ) : <span />}
    </div>
  );
}

function EditModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState({ ...tx });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000a", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#1e2530", borderRadius: 12, padding: 28, width: 340,
        border: "1px solid #2a3340", display: "flex", flexDirection: "column", gap: 14,
      }}>
        <div style={{ color: "#f0f4f8", fontWeight: 700, fontSize: 16 }}>
          {tx.id ? "Edit Transaction" : "Add Transaction"}
        </div>

        {[["Date", "date", "date"], ["Description", "desc", "text"], ["Amount (₹)", "amount", "number"]].map(([label, key, type]) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ color: "#667788", fontSize: 12 }}>{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => set(key, type === "number" ? +e.target.value : e.target.value)}
              style={{
                background: "#12181f", border: "1px solid #2a3340", borderRadius: 6,
                color: "#f0f4f8", padding: "8px 10px", fontSize: 13, outline: "none",
              }}
            />
          </div>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ color: "#667788", fontSize: 12 }}>Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value)}
            style={{ background: "#12181f", border: "1px solid #2a3340", borderRadius: 6, color: "#f0f4f8", padding: "8px 10px", fontSize: 13 }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ color: "#667788", fontSize: 12 }}>Type</label>
          <select value={form.type} onChange={e => set("type", e.target.value)}
            style={{ background: "#12181f", border: "1px solid #2a3340", borderRadius: 6, color: "#f0f4f8", padding: "8px 10px", fontSize: 13 }}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={onClose} style={{ background: "#2a3340", color: "#8899aa", border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontWeight: 600 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState("viewer");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [tab, setTab] = useState("dashboard");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [editTx, setEditTx] = useState(null);

  const isAdmin = role === "admin";

  // ── Derived stats ──
  const totalIncome   = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance       = totalIncome - totalExpenses;

  // Monthly bar data
  const monthlyData = useMemo(() => MONTHS.map(m => {
    const [mon, yr] = m.split(" ");
    const monIdx = new Date(`${mon} 1 ${yr}`).getMonth();
    const txs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === monIdx && d.getFullYear() === parseInt(yr);
    });
    return {
      label: mon,
      income:   txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expenses: txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  }), [transactions]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#666" }));
  }, [transactions]);

  const topCategory = categoryData[0];
  const jan = monthlyData[0], feb = monthlyData[1], mar = monthlyData[2];
  const expenseTrend = mar.expenses > feb.expenses ? "↑ Up" : "↓ Down";


  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCategory !== "all") list = list.filter(t => t.category === filterCategory);
    if (search) list = list.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      if (sortBy === "date")   return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount") return b.amount - a.amount;
      return a.desc.localeCompare(b.desc);
    });
    return list;
  }, [transactions, filterType, filterCategory, search, sortBy]);

  function handleSave(form) {
    setTransactions(prev => {
      if (form.id) return prev.map(t => t.id === form.id ? form : t);
      return [...prev, { ...form, id: Date.now() }];
    });
    setEditTx(null);
  }

  const s = {
    page: { background: "#12181f", minHeight: "100vh", color: "#f0f4f8", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "0 0 40px" },
    header: { background: "#1a2030", borderBottom: "1px solid #2a3340", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    logo: { color: "#3b82f6", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 },
    nav: { display: "flex", gap: 4 },
    navBtn: (active) => ({
      background: active ? "#3b82f630" : "transparent",
      color: active ? "#60a5fa" : "#667788",
      border: active ? "1px solid #3b82f650" : "1px solid transparent",
      borderRadius: 7, padding: "6px 16px", fontSize: 13, cursor: "pointer", fontWeight: active ? 600 : 400,
    }),
    roleWrap: { display: "flex", alignItems: "center", gap: 10 },
    select: { background: "#1e2530", border: "1px solid #2a3340", color: "#c8d8e8", borderRadius: 7, padding: "6px 10px", fontSize: 13 },
    main: { padding: "24px 28px", maxWidth: 1100, margin: "0 auto" },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 24 },
    card: { background: "#1e2530", border: "1px solid #2a3340", borderRadius: 12, padding: "20px 22px" },
    cardTitle: { color: "#667788", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, fontFamily: "monospace" },
    row: { display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" },
    filterBar: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" },
    input: { background: "#1e2530", border: "1px solid #2a3340", color: "#c8d8e8", borderRadius: 7, padding: "7px 12px", fontSize: 13, outline: "none", minWidth: 180 },
    txList: { display: "flex", flexDirection: "column", gap: 6 },
    sectionTitle: { color: "#f0f4f8", fontWeight: 700, fontSize: 16, marginBottom: 14 },
    insightCard: (color) => ({
      background: "#1e2530", border: `1px solid ${color}40`, borderRadius: 10,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 200,
    }),
    badge: (color) => ({ color, fontSize: 11, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }),
    addBtn: {
      background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8,
      padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 16,
    },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>💰 FinTrack</div>
        <div style={s.nav}>
          {["dashboard", "transactions", "insights"].map(t => (
            <button key={t} style={s.navBtn(tab === t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={s.roleWrap}>
          <span style={{ color: "#556677", fontSize: 12 }}>Role:</span>
          <select value={role} onChange={e => setRole(e.target.value)} style={s.select}>
            <option value="viewer">👁 Viewer</option>
            <option value="admin">🛡 Admin</option>
          </select>
          {isAdmin && <span style={{ background: "#3b82f620", color: "#60a5fa", border: "1px solid #3b82f640", borderRadius: 5, padding: "2px 8px", fontSize: 11 }}>Admin Mode</span>}
        </div>
      </div>

      <div style={s.main}>
        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <>
            <div style={s.grid2}>
              <SummaryCard label="Balance"  value={fmt(balance)}       icon="🏦" color="#3b82f6" sub="Income minus expenses" />
              <SummaryCard label="Income"   value={fmt(totalIncome)}   icon="📈" color="#22c55e" sub={`${transactions.filter(t=>t.type==="income").length} transactions`} />
              <SummaryCard label="Expenses" value={fmt(totalExpenses)} icon="📉" color="#f87171" sub={`${transactions.filter(t=>t.type==="expense").length} transactions`} />
              <SummaryCard label="Savings Rate" value={totalIncome ? ((balance/totalIncome)*100).toFixed(1)+"%" : "—"} icon="💡" color="#f59e0b" sub="Of total income saved" />
            </div>

            <div style={s.row}>
              <div style={{ ...s.card, flex: 2, minWidth: 280 }}>
                <div style={s.cardTitle}>Monthly Income vs Expenses</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 130, paddingTop: 10 }}>
                  {monthlyData.map((m, i) => {
                    const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)));
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 90 }}>
                          <div style={{ width: 18, height: `${(m.income/maxVal)*90}px`, background: "#22c55e", borderRadius: "3px 3px 0 0", minHeight: 4 }} />
                          <div style={{ width: 18, height: `${(m.expenses/maxVal)*90}px`, background: "#f87171", borderRadius: "3px 3px 0 0", minHeight: 4 }} />
                        </div>
                        <span style={{ color: "#667788", fontSize: 11 }}>{m.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <span style={{ color: "#22c55e", fontSize: 11 }}>● Income</span>
                  <span style={{ color: "#f87171", fontSize: 11 }}>● Expenses</span>
                </div>
              </div>

              <div style={{ ...s.card, flex: 3, minWidth: 280 }}>
                <div style={s.cardTitle}>Spending by Category</div>
                <DonutChart data={categoryData.slice(0, 6)} />
              </div>
            </div>
          </>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {tab === "transactions" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <div style={s.sectionTitle}>Transactions ({filtered.length})</div>
              {isAdmin && (
                <button style={s.addBtn} onClick={() => setEditTx({ id: null, date: "", desc: "", category: "Food", type: "expense", amount: 0 })}>
                  + Add Transaction
                </button>
              )}
            </div>

            <div style={s.filterBar}>
              <input
                placeholder="Search description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={s.input}
              />
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...s.select, height: 34 }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...s.select, height: 34 }}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...s.select, height: 34 }}>
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
                <option value="desc">Sort: Name</option>
              </select>
            </div>

            <div style={{ color: "#556677", fontSize: 11, fontFamily: "monospace", display: "grid", gridTemplateColumns: "90px 1fr 110px 80px 70px", gap: 12, padding: "6px 16px", marginBottom: 4 }}>
              <span>DATE</span><span>DESCRIPTION</span><span>CATEGORY</span><span style={{ textAlign: "right" }}>AMOUNT</span><span />
            </div>

            <div style={s.txList}>
              {filtered.length === 0
                ? <div style={{ color: "#445566", textAlign: "center", padding: 40 }}>No transactions match your filters.</div>
                : filtered.map(tx => (
                    <TransactionRow key={tx.id} tx={tx} isAdmin={isAdmin} onEdit={setEditTx} />
                  ))
              }
            </div>
          </>
        )}

        {/* ── INSIGHTS TAB ── */}
        {tab === "insights" && (
          <>
            <div style={s.sectionTitle}>Spending Insights</div>

            <div style={{ ...s.row, gap: 14, marginBottom: 24 }}>
              <div style={s.insightCard("#f97316")}>
                <span style={s.badge("#f97316")}>🔥 Top Spend</span>
                <div style={{ color: "#f0f4f8", fontSize: 18, fontWeight: 700 }}>{topCategory?.label}</div>
                <div style={{ color: "#8899aa", fontSize: 13 }}>{fmt(topCategory?.value || 0)} total</div>
                <div style={{ color: "#556677", fontSize: 11 }}>Your biggest expense category</div>
              </div>

              <div style={s.insightCard("#3b82f6")}>
                <span style={s.badge("#3b82f6")}>📅 Monthly Trend</span>
                <div style={{ color: "#f0f4f8", fontSize: 18, fontWeight: 700 }}>{expenseTrend}</div>
                <div style={{ color: "#8899aa", fontSize: 13 }}>Mar vs Feb expenses</div>
                <div style={{ color: "#556677", fontSize: 11 }}>
                  Feb: {fmt(feb.expenses)} → Mar: {fmt(mar.expenses)}
                </div>
              </div>

              <div style={s.insightCard("#22c55e")}>
                <span style={s.badge("#22c55e")}>💼 Best Month</span>
                <div style={{ color: "#f0f4f8", fontSize: 18, fontWeight: 700 }}>
                  {MONTHS[monthlyData.reduce((best, m, i) => m.income - m.expenses > monthlyData[best].income - monthlyData[best].expenses ? i : best, 0)]}
                </div>
                <div style={{ color: "#8899aa", fontSize: 13 }}>Highest net savings</div>
                <div style={{ color: "#556677", fontSize: 11 }}>By income minus expenses</div>
              </div>

              <div style={s.insightCard("#8b5cf6")}>
                <span style={s.badge("#8b5cf6")}>📊 Avg Monthly Spend</span>
                <div style={{ color: "#f0f4f8", fontSize: 18, fontWeight: 700 }}>
                  {fmt(Math.round(totalExpenses / MONTHS.length))}
                </div>
                <div style={{ color: "#8899aa", fontSize: 13 }}>Across 3 months</div>
                <div style={{ color: "#556677", fontSize: 11 }}>Based on all recorded data</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>Category Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categoryData.map((c, i) => {
                  const pct = totalExpenses ? (c.value / totalExpenses) * 100 : 0;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#8899aa", fontSize: 12, minWidth: 110 }}>{c.label}</span>
                      <div style={{ flex: 1, background: "#12181f", borderRadius: 4, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: c.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                      </div>
                      <span style={{ color: c.color, fontSize: 12, fontFamily: "monospace", minWidth: 40 }}>{pct.toFixed(1)}%</span>
                      <span style={{ color: "#667788", fontSize: 12, fontFamily: "monospace", minWidth: 80, textAlign: "right" }}>{fmt(c.value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {editTx && <EditModal tx={editTx} onSave={handleSave} onClose={() => setEditTx(null)} />}
    </div>
  );
}
