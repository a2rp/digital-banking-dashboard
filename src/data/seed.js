export const initialAccounts = [
    {
        id: "everyday",
        name: "Everyday checking",
        type: "Checking",
        lastFour: "4821",
        balance: 8420.63,
        available: 8420.63,
        color: "blue",
    },
    {
        id: "reserve",
        name: "High-yield reserve",
        type: "Savings",
        lastFour: "1937",
        balance: 13875.42,
        available: 13875.42,
        color: "violet",
    },
    {
        id: "joint",
        name: "Shared household",
        type: "Checking",
        lastFour: "2064",
        balance: 2840.14,
        available: 2840.14,
        color: "mint",
    },
];

export const initialTransactions = [
    { id: "tx-501", merchant: "Linden Market", category: "Groceries", amount: -68.22, date: "2026-10-11", accountId: "everyday", status: "Completed", method: "Card", note: "Weekly food shop" },
    { id: "tx-502", merchant: "Cedar & Stone", category: "Dining", amount: -34.8, date: "2026-10-11", accountId: "everyday", status: "Completed", method: "Card", note: "Lunch with Maya" },
    { id: "tx-503", merchant: "Northline Payroll", category: "Income", amount: 4250, date: "2026-10-10", accountId: "everyday", status: "Completed", method: "ACH", note: "Monthly salary" },
    { id: "tx-504", merchant: "Metro Transit", category: "Transport", amount: -42.5, date: "2026-10-10", accountId: "everyday", status: "Completed", method: "Card", note: "Transit pass" },
    { id: "tx-505", merchant: "Brightwell Energy", category: "Bills", amount: -116.38, date: "2026-10-09", accountId: "everyday", status: "Completed", method: "Direct debit", note: "October electricity" },
    { id: "tx-506", merchant: "Transfer from checking", category: "Transfer", amount: 500, date: "2026-10-08", accountId: "reserve", status: "Completed", method: "Internal transfer", note: "Monthly savings" },
    { id: "tx-507", merchant: "Juniper Books", category: "Shopping", amount: -28.75, date: "2026-10-08", accountId: "everyday", status: "Completed", method: "Card", note: "Two paperbacks" },
    { id: "tx-508", merchant: "Willow Health", category: "Health", amount: -64, date: "2026-10-07", accountId: "everyday", status: "Completed", method: "Card", note: "Pharmacy" },
    { id: "tx-509", merchant: "Transfer from reserve", category: "Transfer", amount: 325, date: "2026-10-06", accountId: "everyday", status: "Completed", method: "Internal transfer", note: "Home supplies" },
    { id: "tx-510", merchant: "Bluebird Wireless", category: "Bills", amount: -58, date: "2026-10-05", accountId: "everyday", status: "Pending", method: "Direct debit", note: "Mobile plan" },
    { id: "tx-511", merchant: "Elm Street Pharmacy", category: "Health", amount: -19.42, date: "2026-10-04", accountId: "joint", status: "Completed", method: "Card", note: "Household first aid" },
    { id: "tx-512", merchant: "Harbor Home", category: "Home", amount: -142.9, date: "2026-10-03", accountId: "joint", status: "Completed", method: "Card", note: "Kitchen light fixtures" },
    { id: "tx-513", merchant: "Interest earned", category: "Income", amount: 38.14, date: "2026-10-01", accountId: "reserve", status: "Completed", method: "Interest", note: "October savings interest" },
    { id: "tx-514", merchant: "Transfer to reserve", category: "Transfer", amount: -500, date: "2026-09-30", accountId: "everyday", status: "Completed", method: "Internal transfer", note: "Monthly savings" },
];

export const initialCards = [
    { id: "card-4821", name: "Everyday card", lastFour: "4821", kind: "Physical", accountId: "everyday", status: "Active", monthlyLimit: 4000, spent: 1284.6, color: "night" },
    { id: "card-9127", name: "Online card", lastFour: "9127", kind: "Virtual", accountId: "everyday", status: "Active", monthlyLimit: 1200, spent: 386.25, color: "blue" },
];

export const initialGoals = [
    { id: "goal-1", name: "A little more home", purpose: "Down payment", target: 18000, saved: 11250, dueDate: "2027-06-01", accountId: "reserve", color: "blue" },
    { id: "goal-2", name: "Coast weekend", purpose: "Travel", target: 2400, saved: 1460, dueDate: "2027-03-15", accountId: "reserve", color: "coral" },
    { id: "goal-3", name: "Quiet cushion", purpose: "Emergency fund", target: 6000, saved: 4200, dueDate: "2027-01-31", accountId: "reserve", color: "mint" },
];

export const beneficiaries = [
    { id: "maya", name: "Maya Chen", detail: "Cedar Bank ···· 7814", initials: "MC" },
    { id: "jonah", name: "Jonah Miles", detail: "Union Federal ···· 2049", initials: "JM" },
    { id: "home", name: "Rent and home", detail: "Saved payment ···· 8820", initials: "RH" },
];

export const transactionCategories = [
    "Bills", "Dining", "Groceries", "Health", "Home", "Income", "Shopping", "Transport", "Transfer", "Other",
];
