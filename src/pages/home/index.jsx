import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiEye, FiEyeOff, FiFileText, FiPlus, FiRepeat, FiTarget } from "react-icons/fi";
import { Link } from "react-router-dom";
import { downloadCsv } from "../../utils/downloadCsv";
import { formatDate, formatMoney, formatSignedMoney } from "../../utils/format";
import styles from "./styles.module.css";

const HomePage = ({ accounts, goals, onSelectAccount, selectedAccountId, totalBalance, transactions }) => {
    const [balanceVisible, setBalanceVisible] = useState(true);
    const account = accounts.find((item) => item.id === selectedAccountId) || accounts[0];
    const accountActivity = transactions
        .filter((item) => item.accountId === account.id)
        .sort((first, second) => second.date.localeCompare(first.date));
    const recentActivity = accountActivity.slice(0, 6);
    const topGoal = [...goals].sort((first, second) => (second.saved / second.target) - (first.saved / first.target))[0];

    const week = useMemo(() => {
        const today = new Date();
        const days = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));
            const iso = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
            const items = accountActivity.filter((item) => item.date === iso);
            return {
                label: date.toLocaleDateString("en-US", { weekday: "short" }),
                income: items.reduce((sum, item) => sum + Math.max(0, item.amount), 0),
                spending: items.reduce((sum, item) => sum + Math.max(0, -item.amount), 0),
            };
        });
        return { days, maximum: Math.max(...days.map((day) => Math.max(day.income, day.spending)), 1) };
    }, [accountActivity]);

    const exportStatement = () => {
        const rows = accountActivity.map((item) => [
            item.date, item.merchant, item.category, item.status, item.amount, item.method, item.note,
        ]);
        downloadCsv("vela-" + account.id + "-activity.csv", ["Date", "Description", "Category", "Status", "Amount", "Method", "Note"], rows);
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <p className={styles.date}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    <h1>Good morning, Olivia</h1>
                    <p className={styles.subtitle}>Your accounts, cards, and everyday money in one place.</p>
                </div>
                <button className={styles.exportButton} onClick={exportStatement} type="button">
                    <FiFileText aria-hidden="true" />
                    <span>Download statement</span>
                </button>
            </div>

            <section aria-label="Account balance and accounts" className={styles.accountWorkspace}>
                <article className={styles.balanceCard}>
                    <div className={styles.balanceTop}>
                        <div className={styles.balanceLabel}>
                            <span className={styles.liveDot} />
                            <span>Available in {account.name}</span>
                        </div>
                        <button
                            aria-label={balanceVisible ? "Hide account balance" : "Show account balance"}
                            className={styles.balanceToggle}
                            onClick={() => setBalanceVisible((visible) => !visible)}
                            type="button"
                        >
                            {balanceVisible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                            <span>{balanceVisible ? "Hide" : "Show"}</span>
                        </button>
                    </div>
                    <p className={styles.balance}>{balanceVisible ? formatMoney(account.available) : "••••••"}</p>
                    <p className={styles.accountNumber}>{account.type} account ···· {account.lastFour}</p>
                    <div className={styles.balanceBottom}>
                        <span>Across all Vela accounts</span>
                        <strong>{balanceVisible ? formatMoney(totalBalance) : "••••••"}</strong>
                    </div>
                    <svg aria-hidden="true" className={styles.balanceLine} viewBox="0 0 380 140">
                        <path d="M2 112 C40 102 44 84 81 92 S126 115 160 71 S214 83 245 46 S292 72 327 33 S359 39 378 8" />
                        <path className={styles.lineGlow} d="M2 112 C40 102 44 84 81 92 S126 115 160 71 S214 83 245 46 S292 72 327 33 S359 39 378 8" />
                    </svg>
                </article>

                <article className={styles.accountsPanel}>
                    <div className={styles.sectionHeading}>
                        <div>
                            <h2>Your accounts</h2>
                            <p>Choose an account to view its activity.</p>
                        </div>
                        <span className={styles.accountCount}>{accounts.length} accounts</span>
                    </div>
                    <div className={styles.accountsList}>
                        {accounts.map((item) => (
                            <button
                                aria-pressed={item.id === account.id}
                                className={item.id === account.id ? styles.selectedAccount : styles.accountRow}
                                key={item.id}
                                onClick={() => onSelectAccount(item.id)}
                                type="button"
                            >
                                <span className={styles.accountGlyph} data-color={item.color}>
                                    {item.type === "Savings" ? <FiTarget aria-hidden="true" /> : <FiRepeat aria-hidden="true" />}
                                </span>
                                <span className={styles.accountName}>
                                    <strong>{item.name}</strong>
                                    <span>{item.type} ···· {item.lastFour}</span>
                                </span>
                                <span className={styles.accountBalance}>{formatMoney(item.available)}</span>
                            </button>
                        ))}
                    </div>
                    <Link className={styles.accountFootLink} to="/activity">
                        View account activity <FiArrowUpRight aria-hidden="true" />
                    </Link>
                </article>
            </section>

            <section aria-label="Cash flow and savings goal" className={styles.insightsGrid}>
                <article className={styles.flowPanel}>
                    <div className={styles.sectionHeading}>
                        <div>
                            <h2>In and out this week</h2>
                            <p>Recent movement in {account.name.toLowerCase()}.</p>
                        </div>
                        <Link aria-label="See all account activity" className={styles.iconLink} to="/activity">
                            <FiArrowUpRight aria-hidden="true" />
                        </Link>
                    </div>
                    <div className={styles.flowTotals}>
                        <div><span><i className={styles.incomeKey} /> Money in</span><strong>{formatMoney(week.days.reduce((sum, day) => sum + day.income, 0))}</strong></div>
                        <div><span><i className={styles.spendingKey} /> Money out</span><strong>{formatMoney(week.days.reduce((sum, day) => sum + day.spending, 0))}</strong></div>
                    </div>
                    <div aria-label="Income and spending for the last seven days" className={styles.chart}>
                        {week.days.map((day, index) => (
                            <div className={styles.chartDay} key={day.label + index}>
                                <div className={styles.barArea}>
                                    <span
                                        className={styles.incomeBar}
                                        style={{ height: Math.max(day.income ? (day.income / week.maximum) * 100 : 4, 4) + "%" }}
                                        title={"Money in " + formatMoney(day.income)}
                                    />
                                    <span
                                        className={styles.spendingBar}
                                        style={{ height: Math.max(day.spending ? (day.spending / week.maximum) * 100 : 4, 4) + "%" }}
                                        title={"Money out " + formatMoney(day.spending)}
                                    />
                                </div>
                                <span className={styles.dayLabel}>{day.label}</span>
                            </div>
                        ))}
                    </div>
                </article>

                {topGoal ? (
                    <article className={styles.goalPanel}>
                        <div className={styles.goalTop}>
                            <span className={styles.goalIcon}><FiTarget aria-hidden="true" /></span>
                            <Link className={styles.iconLink} to="/goals" aria-label="See all savings goals">
                                <FiArrowUpRight aria-hidden="true" />
                            </Link>
                        </div>
                        <p className={styles.goalIntro}>Savings goal</p>
                        <h2>{topGoal.name}</h2>
                        <div className={styles.goalAmounts}>
                            <strong>{formatMoney(topGoal.saved)}</strong>
                            <span>of {formatMoney(topGoal.target)}</span>
                        </div>
                        <div
                            aria-label={Math.round((topGoal.saved / topGoal.target) * 100) + "% saved"}
                            aria-valuemax="100"
                            aria-valuemin="0"
                            aria-valuenow={Math.round((topGoal.saved / topGoal.target) * 100)}
                            className={styles.goalTrack}
                            role="progressbar"
                        >
                            <span style={{ width: Math.min((topGoal.saved / topGoal.target) * 100, 100) + "%" }} />
                        </div>
                        <Link className={styles.goalLink} to="/goals">Keep building this goal <FiArrowUpRight aria-hidden="true" /></Link>
                    </article>
                ) : (
                    <article className={styles.goalPanel}>
                        <span className={styles.goalIcon}><FiTarget aria-hidden="true" /></span>
                        <h2>Start a savings goal</h2>
                        <p>Give your next milestone a clear place to grow.</p>
                        <Link className={styles.goalLink} to="/goals"><FiPlus aria-hidden="true" /> Create a goal</Link>
                    </article>
                )}
            </section>

            <section aria-label="Recent activity" className={styles.activityPanel}>
                <div className={styles.activityHeading}>
                    <div>
                        <h2>Recent activity</h2>
                        <p>Latest entries for {account.name}.</p>
                    </div>
                    <Link className={styles.viewAll} to="/activity">View all activity <FiArrowUpRight aria-hidden="true" /></Link>
                </div>
                <div className={styles.transactionList}>
                    {recentActivity.length ? recentActivity.map((transaction) => (
                        <Link
                            className={styles.transaction}
                            key={transaction.id}
                            to={"/activity?search=" + encodeURIComponent(transaction.merchant)}
                        >
                            <span className={transaction.amount > 0 ? styles.incomeIcon : styles.spendingIcon}>
                                {transaction.amount > 0 ? <FiArrowDownLeft aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}
                            </span>
                            <span className={styles.transactionInfo}>
                                <strong>{transaction.merchant}</strong>
                                <span>{transaction.category} · {formatDate(transaction.date)} · {transaction.status}</span>
                            </span>
                            <span className={transaction.amount > 0 ? styles.incomeAmount : styles.spendingAmount}>
                                {formatSignedMoney(transaction.amount)}
                            </span>
                            <FiArrowUpRight aria-hidden="true" className={styles.rowArrow} />
                        </Link>
                    )) : (
                        <div className={styles.emptyActivity}>
                            <p>No activity is linked to this account yet.</p>
                            <Link to="/transfers">Move money between accounts <FiArrowUpRight aria-hidden="true" /></Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;