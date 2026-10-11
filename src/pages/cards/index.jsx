import { useState } from "react";
import { FiArrowUpRight, FiCreditCard, FiLock, FiPlus, FiSettings, FiUnlock, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { formatMoney } from "../../utils/format";
import styles from "./styles.module.css";

const CardsPage = ({ accounts, cards, deleteCard, saveCard, toggleCard }) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [newCardName, setNewCardName] = useState("");
    const [newCardAccount, setNewCardAccount] = useState("everyday");
    const [newCardLimit, setNewCardLimit] = useState("1200");
    const [newCardError, setNewCardError] = useState("");
    const [editingCard, setEditingCard] = useState(null);
    const [limitValue, setLimitValue] = useState("");
    const [limitError, setLimitError] = useState("");
    const [removeCard, setRemoveCard] = useState(null);

    const createVirtualCard = (event) => {
        event.preventDefault();
        const monthlyLimit = Number(newCardLimit);
        if (!newCardName.trim()) {
            setNewCardError("Add a name for this virtual card.");
            return;
        }
        if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
            setNewCardError("Enter a spending limit greater than zero.");
            return;
        }
        saveCard({ name: newCardName.trim(), accountId: newCardAccount, monthlyLimit });
        setCreateOpen(false);
        setNewCardName("");
        setNewCardLimit("1200");
        setNewCardError("");
    };

    const openLimitEditor = (card) => {
        setEditingCard(card);
        setLimitValue(String(card.monthlyLimit));
        setLimitError("");
    };

    const saveLimit = (event) => {
        event.preventDefault();
        const monthlyLimit = Number(limitValue);
        if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
            setLimitError("Enter an amount greater than zero.");
            return;
        }
        if (monthlyLimit < editingCard.spent) {
            setLimitError("The limit cannot be below this month's card spending.");
            return;
        }
        saveCard({ ...editingCard, monthlyLimit });
        setEditingCard(null);
    };

    const confirmRemove = () => {
        if (!removeCard) return;
        deleteCard(removeCard.id);
        setRemoveCard(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <h1>Cards</h1>
                    <p>Keep spending controls simple and close by.</p>
                </div>
                <button className={styles.addButton} onClick={() => setCreateOpen(true)} type="button">
                    <FiPlus aria-hidden="true" /> New virtual card
                </button>
            </div>

            <section className={styles.paymentFeature}>
                <img alt="A person using a phone and card for a digital payment" src={import.meta.env.BASE_URL + "mobile-payment.jpg"} />
                <div className={styles.featureShade} />
                <div className={styles.featureContent}>
                    <span className={styles.featureIcon}><FiCreditCard aria-hidden="true" /></span>
                    <div>
                        <h2>One card, more control.</h2>
                        <p>Lock a card or adjust its monthly spending limit right here.</p>
                    </div>
                    <Link to="/activity">Review card activity <FiArrowUpRight aria-hidden="true" /></Link>
                </div>
            </section>

            <div className={styles.cardSectionHeading}>
                <div>
                    <h2>Your cards</h2>
                    <p>{cards.length} demo {cards.length === 1 ? "card" : "cards"} connected to your accounts.</p>
                </div>
                <span className={styles.demoLabel}>Sample cards</span>
            </div>

            {cards.length ? (
                <section aria-label="Manage cards" className={styles.cardGrid}>
                    {cards.map((card) => {
                        const linkedAccount = accounts.find((account) => account.id === card.accountId);
                        const usedPercent = Math.min((card.spent / card.monthlyLimit) * 100, 100);
                        return (
                            <article className={styles.cardPanel} key={card.id}>
                                <div className={styles.bankCard} data-color={card.color}>
                                    <div className={styles.bankCardTop}>
                                        <span className={styles.cardMark}><img alt="" src={import.meta.env.BASE_URL + "vela-mark.svg"} /></span>
                                        <span className={styles.cardKind}>{card.kind} card</span>
                                    </div>
                                    <span className={styles.chip} aria-hidden="true" />
                                    <span className={styles.cardNumber}>•••• &nbsp;•••• &nbsp;•••• &nbsp;{card.lastFour}</span>
                                    <div className={styles.bankCardBottom}>
                                        <span>{card.name}</span>
                                        <span>VISA</span>
                                    </div>
                                    <span className={styles.cardRing} aria-hidden="true" />
                                </div>

                                <div className={styles.cardMeta}>
                                    <div>
                                        <h3>{card.name}</h3>
                                        <p>{linkedAccount?.name} ···· {linkedAccount?.lastFour}</p>
                                    </div>
                                    <span className={card.status === "Locked" ? styles.lockedBadge : styles.activeBadge}>
                                        {card.status}
                                    </span>
                                </div>

                                <div className={styles.limitSummary}>
                                    <div className={styles.limitLabels}>
                                        <span>Monthly spending</span>
                                        <strong>{formatMoney(card.spent)} <span>of {formatMoney(card.monthlyLimit)}</span></strong>
                                    </div>
                                    <div
                                        aria-label={Math.round(usedPercent) + "% of monthly card limit used"}
                                        aria-valuemax="100"
                                        aria-valuemin="0"
                                        aria-valuenow={Math.round(usedPercent)}
                                        className={styles.limitTrack}
                                        role="progressbar"
                                    >
                                        <span style={{ width: usedPercent + "%" }} />
                                    </div>
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={card.status === "Locked" ? styles.unlockButton : styles.lockButton}
                                        onClick={() => toggleCard(card.id)}
                                        type="button"
                                    >
                                        {card.status === "Locked" ? <FiUnlock aria-hidden="true" /> : <FiLock aria-hidden="true" />}
                                        {card.status === "Locked" ? "Unlock" : "Lock"}
                                    </button>
                                    <button className={styles.settingsButton} onClick={() => openLimitEditor(card)} type="button">
                                        <FiSettings aria-hidden="true" /> Spending limit
                                    </button>
                                    <button aria-label={"Remove " + card.name} className={styles.removeButton} onClick={() => setRemoveCard(card)} type="button">
                                        <FiX aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <section className={styles.emptyCards}>
                    <span><FiCreditCard aria-hidden="true" /></span>
                    <h2>No cards in this session</h2>
                    <p>Create a virtual card to explore the card controls.</p>
                    <button className={styles.addButton} onClick={() => setCreateOpen(true)} type="button"><FiPlus aria-hidden="true" /> New virtual card</button>
                </section>
            )}

            <div className={styles.notice}>
                <span><FiLock aria-hidden="true" /></span>
                <p>These controls change sample data only. No physical or virtual bank card is issued.</p>
            </div>

            <Dialog
                description="Create a masked virtual card for this frontend session."
                onClose={() => setCreateOpen(false)}
                open={createOpen}
                size="narrow"
                title="New virtual card"
            >
                <form className={styles.dialogForm} onSubmit={createVirtualCard} noValidate>
                    <label>
                        <span>Card name</span>
                        <input maxLength="32" onChange={(event) => setNewCardName(event.target.value)} placeholder="e.g. Online purchases" value={newCardName} />
                    </label>
                    <label>
                        <span>Linked account</span>
                        <select onChange={(event) => setNewCardAccount(event.target.value)} value={newCardAccount}>
                            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name} ···· {account.lastFour}</option>)}
                        </select>
                    </label>
                    <label>
                        <span>Monthly spending limit</span>
                        <input min="1" onChange={(event) => setNewCardLimit(event.target.value)} step="0.01" type="number" value={newCardLimit} />
                    </label>
                    {newCardError && <p className={styles.formError} role="alert">{newCardError}</p>}
                    <div className={styles.dialogActions}>
                        <button className={styles.cancelButton} data-initial-focus onClick={() => setCreateOpen(false)} type="button">Cancel</button>
                        <button className={styles.saveButton} type="submit">Create virtual card</button>
                    </div>
                </form>
            </Dialog>

            <Dialog
                description={editingCard ? "Set a monthly limit for " + editingCard.name + "." : ""}
                onClose={() => setEditingCard(null)}
                open={Boolean(editingCard)}
                size="narrow"
                title="Spending limit"
            >
                {editingCard && (
                    <form className={styles.dialogForm} onSubmit={saveLimit} noValidate>
                        <div className={styles.currentSpend}>Spent this month <strong>{formatMoney(editingCard.spent)}</strong></div>
                        <label>
                            <span>Monthly limit</span>
                            <input min="1" onChange={(event) => setLimitValue(event.target.value)} step="0.01" type="number" value={limitValue} />
                        </label>
                        {limitError && <p className={styles.formError} role="alert">{limitError}</p>}
                        <div className={styles.dialogActions}>
                            <button className={styles.cancelButton} data-initial-focus onClick={() => setEditingCard(null)} type="button">Cancel</button>
                            <button className={styles.saveButton} type="submit">Save limit</button>
                        </div>
                    </form>
                )}
            </Dialog>

            <ConfirmDialog
                description={removeCard
                    ? "Remove " + removeCard.name + " ending in " + removeCard.lastFour + " from this session? This does not change any account balance."
                    : ""}
                onClose={() => setRemoveCard(null)}
                onConfirm={confirmRemove}
                open={Boolean(removeCard)}
                title="Remove demo card?"
                confirmLabel="Remove card"
            />
        </div>
    );
};

export default CardsPage;