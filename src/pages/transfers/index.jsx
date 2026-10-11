import { useEffect, useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiCheckCircle, FiInfo, FiRepeat, FiShield } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import { beneficiaries } from "../../data/seed";
import { formatDate, formatMoney, formatSignedMoney } from "../../utils/format";
import styles from "./styles.module.css";

const TransfersPage = ({ accounts, selectedAccountId, transactions, transferMoney }) => {
    const [fromAccountId, setFromAccountId] = useState(selectedAccountId);
    const [recipient, setRecipient] = useState("account:reserve");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [pendingTransfer, setPendingTransfer] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => setFromAccountId(selectedAccountId), [selectedAccountId]);

    const fromAccount = accounts.find((account) => account.id === fromAccountId) || accounts[0];
    const recentTransfers = useMemo(() => transactions
        .filter((item) => item.category === "Transfer")
        .sort((first, second) => second.date.localeCompare(first.date))
        .slice(0, 5), [transactions]);

    const resolveRecipient = () => {
        if (recipient.startsWith("account:")) {
            const account = accounts.find((item) => item.id === recipient.slice(8));
            return account ? { name: account.name, accountId: account.id, isInternal: true } : null;
        }
        const contact = beneficiaries.find((item) => item.id === recipient.slice(7));
        return contact ? { name: contact.name, accountId: null, isInternal: false } : null;
    };

    const validate = () => {
        const nextErrors = {};
        const value = Number(amount);
        const target = resolveRecipient();
        if (!fromAccount) nextErrors.fromAccount = "Choose an account to transfer from.";
        if (!target) nextErrors.recipient = "Choose a recipient.";
        if (!amount || !Number.isFinite(value) || value <= 0) nextErrors.amount = "Enter an amount greater than zero.";
        else if (value > fromAccount.available) nextErrors.amount = "The amount is above this account's available balance.";
        if (target?.isInternal && target.accountId === fromAccountId) nextErrors.recipient = "Choose a different account.";
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleContinue = (event) => {
        event.preventDefault();
        if (!validate()) return;
        const target = resolveRecipient();
        setPendingTransfer({
            fromAccountId,
            toAccountId: target.accountId,
            recipientName: target.name,
            amount: Number(amount),
            note: note.trim(),
        });
        setConfirmOpen(true);
    };

    const confirmTransfer = () => {
        const completed = transferMoney(pendingTransfer);
        setConfirmOpen(false);
        setPendingTransfer(null);
        if (completed) {
            setAmount("");
            setNote("");
            setErrors({});
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <h1>Move money</h1>
                    <p>Choose where it starts and where it should go.</p>
                </div>
                <span className={styles.demoTag}><FiInfo aria-hidden="true" /> Demo only</span>
            </div>

            <div className={styles.layout}>
                <section aria-label="Create a transfer" className={styles.transferPanel}>
                    <div className={styles.panelHeading}>
                        <span className={styles.panelIcon}><FiRepeat aria-hidden="true" /></span>
                        <div>
                            <h2>New transfer</h2>
                            <p>Move money between sample accounts or record a demo payment.</p>
                        </div>
                    </div>

                    <form onSubmit={handleContinue} noValidate>
                        <label className={styles.field}>
                            <span>From account</span>
                            <select onChange={(event) => setFromAccountId(event.target.value)} value={fromAccountId}>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ···· {account.lastFour} · {formatMoney(account.available)}
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccount && <small>{errors.fromAccount}</small>}
                        </label>

                        <label className={styles.field}>
                            <span>To</span>
                            <select onChange={(event) => setRecipient(event.target.value)} value={recipient}>
                                <optgroup label="Your Vela accounts">
                                    {accounts.map((account) => (
                                        <option key={account.id} value={"account:" + account.id}>
                                            {account.name} ···· {account.lastFour}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Saved demo recipients">
                                    {beneficiaries.map((contact) => (
                                        <option key={contact.id} value={"person:" + contact.id}>
                                            {contact.name} · {contact.detail}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            {errors.recipient && <small>{errors.recipient}</small>}
                        </label>

                        <label className={styles.field}>
                            <span>Amount</span>
                            <div className={styles.amountInput}>
                                <span aria-hidden="true">$</span>
                                <input
                                    aria-describedby={errors.amount ? "transfer-amount-error" : "available-balance"}
                                    aria-invalid={Boolean(errors.amount)}
                                    inputMode="decimal"
                                    min="0.01"
                                    onChange={(event) => {
                                        setAmount(event.target.value);
                                        setErrors((current) => ({ ...current, amount: "" }));
                                    }}
                                    placeholder="0.00"
                                    step="0.01"
                                    type="number"
                                    value={amount}
                                />
                            </div>
                            <span className={styles.availableText} id="available-balance">Available: {formatMoney(fromAccount?.available || 0)}</span>
                            {errors.amount && <small id="transfer-amount-error">{errors.amount}</small>}
                        </label>

                        <label className={styles.field}>
                            <span>Note <em>Optional</em></span>
                            <input
                                maxLength="80"
                                onChange={(event) => setNote(event.target.value)}
                                placeholder="Add a short note"
                                type="text"
                                value={note}
                            />
                        </label>

                        <div className={styles.demoNotice}>
                            <FiShield aria-hidden="true" />
                            <p>This preview updates sample balances and activity only. It does not send money or contact a bank.</p>
                        </div>

                        <button className={styles.continueButton} type="submit">
                            Review transfer <FiArrowUpRight aria-hidden="true" />
                        </button>
                    </form>
                </section>

                <aside className={styles.sidePanel}>
                    <section className={styles.destinationCard}>
                        <p className={styles.sideLabel}>Transfer path</p>
                        <div className={styles.pathRow}>
                            <span className={styles.pathIcon}><FiArrowUpRight aria-hidden="true" /></span>
                            <div><strong>{fromAccount.name}</strong><span>···· {fromAccount.lastFour}</span></div>
                        </div>
                        <div aria-hidden="true" className={styles.pathLine} />
                        <div className={styles.pathRow}>
                            <span className={styles.pathIcon}><FiArrowDownLeft aria-hidden="true" /></span>
                            <div><strong>{resolveRecipient()?.name || "Choose a recipient"}</strong><span>{resolveRecipient()?.isInternal ? "Your Vela account" : "Saved demo recipient"}</span></div>
                        </div>
                    </section>

                    <section className={styles.recentPanel}>
                        <div className={styles.recentHeading}>
                            <div><h2>Recent transfers</h2><p>Sample activity from this session.</p></div>
                        </div>
                        {recentTransfers.length ? recentTransfers.map((item) => (
                            <div className={styles.recentRow} key={item.id}>
                                <span className={item.amount < 0 ? styles.outIcon : styles.inIcon}>
                                    {item.amount < 0 ? <FiArrowUpRight aria-hidden="true" /> : <FiArrowDownLeft aria-hidden="true" />}
                                </span>
                                <span className={styles.recentInfo}>
                                    <strong>{item.merchant}</strong>
                                    <span>{formatDate(item.date)} · {item.method}</span>
                                </span>
                                <span className={item.amount < 0 ? styles.outAmount : styles.inAmount}>{formatSignedMoney(item.amount)}</span>
                            </div>
                        )) : (
                            <div className={styles.emptyTransfers}>
                                <span><FiCheckCircle aria-hidden="true" /></span>
                                <p>Your next transfer will appear here.</p>
                            </div>
                        )}
                    </section>
                </aside>
            </div>

            <ConfirmDialog
                cancelLabel="Go back"
                confirmLabel="Confirm demo transfer"
                description={pendingTransfer
                    ? "Move " + formatMoney(pendingTransfer.amount) + " from " + fromAccount.name + " to " + pendingTransfer.recipientName + "? This changes sample data only. No funds will be sent."
                    : ""}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmTransfer}
                open={confirmOpen}
                title="Review this transfer"
                tone="primary"
            />
        </div>
    );
};

export default TransfersPage;