import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiDownload, FiSearch, FiSliders, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import Dialog from "../../components/dialog";
import { transactionCategories } from "../../data/seed";
import { downloadCsv } from "../../utils/downloadCsv";
import { formatDate, formatMoney, formatSignedMoney } from "../../utils/format";
import styles from "./styles.module.css";

const ActivityPage = ({ accounts, onSelectAccount, onUpdateTransaction, selectedAccountId, transactions }) => {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState("All status");
    const [categoryFilter, setCategoryFilter] = useState("All categories");
    const [allAccounts, setAllAccounts] = useState(false);
    const [sortBy, setSortBy] = useState("Newest first");
    const [selectedId, setSelectedId] = useState(null);
    const accountFilter = allAccounts ? "all" : selectedAccountId;
    const selectedTransaction = transactions.find((item) => item.id === selectedId);

    const filtered = useMemo(() => transactions
        .filter((item) => accountFilter === "all" || item.accountId === accountFilter)
        .filter((item) => statusFilter === "All status" || item.status === statusFilter)
        .filter((item) => categoryFilter === "All categories" || item.category === categoryFilter)
        .filter((item) => {
            const search = query.trim().toLowerCase();
            return !search || [item.merchant, item.category, item.note, item.method].some((value) => value?.toLowerCase().includes(search));
        })
        .sort((first, second) => {
            if (sortBy === "Oldest first") return first.date.localeCompare(second.date);
            if (sortBy === "Largest amount") return Math.abs(second.amount) - Math.abs(first.amount);
            return second.date.localeCompare(first.date);
        }), [accountFilter, categoryFilter, query, sortBy, statusFilter, transactions]);

    const totalIn = filtered.reduce((sum, item) => sum + Math.max(0, item.amount), 0);
    const totalOut = filtered.reduce((sum, item) => sum + Math.max(0, -item.amount), 0);
    const clearFilters = () => {
        setQuery("");
        setStatusFilter("All status");
        setCategoryFilter("All categories");
        setAllAccounts(true);
        setSortBy("Newest first");
    };

    const exportActivity = () => {
        const rows = filtered.map((item) => {
            const account = accounts.find((entry) => entry.id === item.accountId);
            return [item.date, item.merchant, item.category, item.status, item.amount, account?.name, item.method, item.note];
        });
        downloadCsv("vela-activity.csv", ["Date", "Description", "Category", "Status", "Amount", "Account", "Method", "Note"], rows);
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <h1>Activity</h1>
                    <p>Every move, with the details close at hand.</p>
                </div>
                <button className={styles.exportButton} onClick={exportActivity} type="button">
                    <FiDownload aria-hidden="true" /> Export CSV
                </button>
            </div>

            <section aria-label="Activity totals" className={styles.summary}>
                <div><span>Entries in view</span><strong>{filtered.length}</strong></div>
                <div><span>Money in</span><strong className={styles.income}>{formatMoney(totalIn)}</strong></div>
                <div><span>Money out</span><strong>{formatMoney(totalOut)}</strong></div>
                <div><span>Accounts</span><strong>{accounts.length}</strong></div>
            </section>

            <section aria-label="Filter activity" className={styles.filterPanel}>
                <div className={styles.searchField}>
                    <FiSearch aria-hidden="true" />
                    <input
                        aria-label="Search activity"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search merchants, notes, or categories"
                        type="search"
                        value={query}
                    />
                    {query && <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><FiX /></button>}
                </div>
                <label className={styles.selectField}>
                    <span>Account</span>
                    <select
                        onChange={(event) => {
                            if (event.target.value === "all") {
                                setAllAccounts(true);
                            } else {
                                setAllAccounts(false);
                                onSelectAccount(event.target.value);
                            }
                        }}
                        value={accountFilter}
                    >
                        <option value="all">All accounts</option>
                        {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                    </select>
                </label>
                <label className={styles.selectField}>
                    <span>Status</span>
                    <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                        <option>All status</option>
                        <option>Completed</option>
                        <option>Pending</option>
                    </select>
                </label>
                <label className={styles.selectField}>
                    <span>Category</span>
                    <select onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
                        <option>All categories</option>
                        {transactionCategories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                </label>
                <label className={styles.selectField}>
                    <span>Sort</span>
                    <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
                        <option>Newest first</option>
                        <option>Oldest first</option>
                        <option>Largest amount</option>
                    </select>
                </label>
                <button className={styles.clearButton} onClick={clearFilters} type="button">
                    <FiSliders aria-hidden="true" /> Clear filters
                </button>
            </section>

            <section aria-label="Banking activity" className={styles.resultsPanel}>
                <div className={styles.resultsHeader}>
                    <div>
                        <h2>All activity</h2>
                        <p>{filtered.length} {filtered.length === 1 ? "entry" : "entries"} match these filters.</p>
                    </div>
                    <span className={styles.updated}><i /> Updated just now</span>
                </div>

                {filtered.length ? (
                    <>
                        <div className={styles.tableWrap}>
                            <table>
                                <thead>
                                    <tr><th>Description</th><th>Account</th><th>Date</th><th>Status</th><th className={styles.amountHead}>Amount</th><th><span className={styles.srOnly}>Details</span></th></tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => {
                                        const account = accounts.find((entry) => entry.id === item.accountId);
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <button className={styles.transactionButton} onClick={() => setSelectedId(item.id)} type="button">
                                                        <span className={item.amount > 0 ? styles.incomeIcon : styles.expenseIcon}>
                                                            {item.amount > 0 ? <FiArrowDownLeft aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}
                                                        </span>
                                                        <span className={styles.transactionInfo}>
                                                            <strong>{item.merchant}</strong>
                                                            <span>{item.category} · {item.method}</span>
                                                        </span>
                                                    </button>
                                                </td>
                                                <td>{account?.name}</td>
                                                <td>{formatDate(item.date)}</td>
                                                <td><span className={item.status === "Pending" ? styles.pendingStatus : styles.completeStatus}>{item.status}</span></td>
                                                <td className={item.amount > 0 ? styles.incomeAmount : styles.amount}>{formatSignedMoney(item.amount)}</td>
                                                <td><button aria-label={"View " + item.merchant} className={styles.detailButton} onClick={() => setSelectedId(item.id)} type="button">Details</button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.mobileList}>
                            {filtered.map((item) => {
                                const account = accounts.find((entry) => entry.id === item.accountId);
                                return (
                                    <button className={styles.mobileRow} key={item.id} onClick={() => setSelectedId(item.id)} type="button">
                                        <span className={item.amount > 0 ? styles.incomeIcon : styles.expenseIcon}>
                                            {item.amount > 0 ? <FiArrowDownLeft aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}
                                        </span>
                                        <span className={styles.mobileInfo}>
                                            <strong>{item.merchant}</strong>
                                            <span>{item.category} · {account?.name}</span>
                                            <span>{formatDate(item.date)} · {item.status}</span>
                                        </span>
                                        <span className={item.amount > 0 ? styles.incomeAmount : styles.amount}>{formatSignedMoney(item.amount)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <span><FiSearch aria-hidden="true" /></span>
                        <h3>No activity found</h3>
                        <p>Try a different search or clear one of the filters.</p>
                        <button onClick={clearFilters} type="button">Clear filters</button>
                    </div>
                )}
            </section>

            <Dialog
                description={selectedTransaction ? selectedTransaction.merchant + " · " + selectedTransaction.method : ""}
                onClose={() => setSelectedId(null)}
                open={Boolean(selectedTransaction)}
                size="narrow"
                title="Activity details"
            >
                {selectedTransaction && (
                    <div className={styles.detailContent}>
                        <div className={styles.detailAmount} data-positive={selectedTransaction.amount > 0}>
                            {formatSignedMoney(selectedTransaction.amount)}
                        </div>
                        <dl>
                            <div><dt>Account</dt><dd>{accounts.find((account) => account.id === selectedTransaction.accountId)?.name}</dd></div>
                            <div><dt>Date</dt><dd>{formatDate(selectedTransaction.date)}</dd></div>
                            <div><dt>Status</dt><dd>{selectedTransaction.status}</dd></div>
                            <div><dt>Reference</dt><dd>{selectedTransaction.id.toUpperCase()}</dd></div>
                        </dl>
                        <label className={styles.detailCategory}>
                            <span>Category</span>
                            <select
                                onChange={(event) => onUpdateTransaction(selectedTransaction.id, { category: event.target.value })}
                                value={selectedTransaction.category}
                            >
                                {transactionCategories.map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </label>
                        <div className={styles.noteBox}>
                            <span>Note</span>
                            <p>{selectedTransaction.note || "No note added."}</p>
                        </div>
                        <button
                            className={selectedTransaction.reviewed ? styles.reviewedButton : styles.reviewButton}
                            onClick={() => onUpdateTransaction(selectedTransaction.id, { reviewed: !selectedTransaction.reviewed })}
                            type="button"
                        >
                            {selectedTransaction.reviewed ? "Reviewed" : "Mark as reviewed"}
                        </button>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default ActivityPage;
