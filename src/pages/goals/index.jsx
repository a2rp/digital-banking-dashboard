import { useMemo, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiCalendar, FiEdit2, FiPlus, FiTarget, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { formatDate, formatMoney } from "../../utils/format";
import styles from "./styles.module.css";

const blankGoal = {
    name: "",
    purpose: "",
    target: "",
    dueDate: "",
    accountId: "reserve",
};

const GoalsPage = ({ accounts, deleteGoal, goals, moveGoalFunds, saveGoal }) => {
    const [goalDialogOpen, setGoalDialogOpen] = useState(false);
    const [goalForm, setGoalForm] = useState(blankGoal);
    const [goalFormError, setGoalFormError] = useState("");
    const [moveDialog, setMoveDialog] = useState(null);
    const [moveAmount, setMoveAmount] = useState("");
    const [moveAccountId, setMoveAccountId] = useState("everyday");
    const [moveError, setMoveError] = useState("");
    const [moveConfirmation, setMoveConfirmation] = useState(null);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    const totals = useMemo(() => ({
        saved: goals.reduce((sum, goal) => sum + goal.saved, 0),
        target: goals.reduce((sum, goal) => sum + goal.target, 0),
    }), [goals]);

    const openNewGoal = () => {
        setGoalForm(blankGoal);
        setGoalFormError("");
        setGoalDialogOpen(true);
    };

    const openEditGoal = (goal) => {
        setGoalForm({ ...goal });
        setGoalFormError("");
        setGoalDialogOpen(true);
    };

    const saveGoalForm = (event) => {
        event.preventDefault();
        const target = Number(goalForm.target);
        if (!goalForm.name.trim()) {
            setGoalFormError("Give this goal a name.");
            return;
        }
        if (!Number.isFinite(target) || target <= 0) {
            setGoalFormError("Set a target greater than zero.");
            return;
        }
        if (goalForm.id && target < goalForm.saved) {
            setGoalFormError("The target cannot be below the amount already saved.");
            return;
        }
        saveGoal({ ...goalForm, name: goalForm.name.trim(), purpose: goalForm.purpose.trim(), target });
        setGoalDialogOpen(false);
        setGoalForm(blankGoal);
    };

    const openMoveDialog = (goal, direction) => {
        setMoveDialog({ goal, direction });
        setMoveAmount("");
        setMoveAccountId(direction === "add" ? "everyday" : goal.accountId);
        setMoveError("");
    };

    const reviewMove = (event) => {
        event.preventDefault();
        const amount = Number(moveAmount);
        const account = accounts.find((item) => item.id === moveAccountId);
        if (!Number.isFinite(amount) || amount <= 0) {
            setMoveError("Enter an amount greater than zero.");
            return;
        }
        if (moveDialog.direction === "add" && amount > (account?.available || 0)) {
            setMoveError("This amount is above the available balance.");
            return;
        }
        if (moveDialog.direction === "add" && amount > moveDialog.goal.target - moveDialog.goal.saved) {
            setMoveError("This contribution is above the amount left to reach your goal.");
            return;
        }
        if (moveDialog.direction === "take" && amount > moveDialog.goal.saved) {
            setMoveError("This is more than the amount saved in this goal.");
            return;
        }

        setMoveConfirmation({
            goalId: moveDialog.goal.id,
            goalName: moveDialog.goal.name,
            direction: moveDialog.direction,
            amount,
            accountId: moveAccountId,
        });
        setMoveDialog(null);
    };

    const confirmMove = () => {
        if (!moveConfirmation) return;
        moveGoalFunds(moveConfirmation);
        setMoveConfirmation(null);
    };

    const confirmDelete = () => {
        if (!deleteCandidate) return;
        deleteGoal(deleteCandidate.id);
        setDeleteCandidate(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <h1>Savings goals</h1>
                    <p>Give the things you care about a clear place to grow.</p>
                </div>
                <button className={styles.createButton} onClick={openNewGoal} type="button">
                    <FiPlus aria-hidden="true" /> New goal
                </button>
            </div>

            <section aria-label="Savings progress" className={styles.summary}>
                <div className={styles.summaryTotal}>
                    <span className={styles.summaryIcon}><FiTarget aria-hidden="true" /></span>
                    <div><span>Saved across goals</span><strong>{formatMoney(totals.saved)}</strong></div>
                </div>
                <div><span>Combined targets</span><strong>{formatMoney(totals.target)}</strong></div>
                <div><span>Goals in progress</span><strong>{goals.length}</strong></div>
                <div className={styles.summaryPercent}>
                    <span>Overall progress</span>
                    <strong>{totals.target ? Math.round((totals.saved / totals.target) * 100) : 0}%</strong>
                </div>
            </section>

            {goals.length ? (
                <section aria-label="Manage savings goals" className={styles.goalGrid}>
                    {goals.map((goal) => {
                        const percent = Math.min((goal.saved / goal.target) * 100, 100);
                        return (
                            <article className={styles.goalCard} data-color={goal.color} key={goal.id}>
                                <div className={styles.goalHeader}>
                                    <span className={styles.goalIcon}><FiTarget aria-hidden="true" /></span>
                                    <div className={styles.goalActions}>
                                        <button aria-label={"Edit " + goal.name} onClick={() => openEditGoal(goal)} type="button"><FiEdit2 aria-hidden="true" /></button>
                                        <button aria-label={"Delete " + goal.name} onClick={() => setDeleteCandidate(goal)} type="button"><FiTrash2 aria-hidden="true" /></button>
                                    </div>
                                </div>
                                <p className={styles.goalPurpose}>{goal.purpose || "Personal goal"}</p>
                                <h2>{goal.name}</h2>
                                <div className={styles.savedAmount}>
                                    <strong>{formatMoney(goal.saved)}</strong>
                                    <span>of {formatMoney(goal.target)}</span>
                                </div>
                                <div
                                    aria-label={Math.round(percent) + "% saved"}
                                    aria-valuemax="100"
                                    aria-valuemin="0"
                                    aria-valuenow={Math.round(percent)}
                                    className={styles.progressTrack}
                                    role="progressbar"
                                >
                                    <span style={{ width: percent + "%" }} />
                                </div>
                                <div className={styles.goalMeta}>
                                    <span><FiCalendar aria-hidden="true" /> {goal.dueDate ? "Target " + formatDate(goal.dueDate) : "No target date"}</span>
                                    <strong>{formatMoney(Math.max(goal.target - goal.saved, 0))} left</strong>
                                </div>
                                <div className={styles.goalButtons}>
                                    <button className={styles.addFundsButton} disabled={goal.saved >= goal.target} onClick={() => openMoveDialog(goal, "add")} type="button">
                                        <FiArrowDownLeft aria-hidden="true" /> Add money
                                    </button>
                                    <button className={styles.withdrawButton} disabled={goal.saved <= 0} onClick={() => openMoveDialog(goal, "take")} type="button">
                                        <FiArrowUpRight aria-hidden="true" /> Withdraw
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <section className={styles.emptyState}>
                    <span><FiTarget aria-hidden="true" /></span>
                    <h2>Start with one goal</h2>
                    <p>Create a savings target and decide how much to set aside.</p>
                    <button className={styles.createButton} onClick={openNewGoal} type="button"><FiPlus aria-hidden="true" /> Create a goal</button>
                </section>
            )}

            <div className={styles.accountNote}>
                <FiTarget aria-hidden="true" />
                <p>Goal amounts are allocations within your sample accounts. Adding or withdrawing funds updates account balances and activity in this session.</p>
            </div>

            <Dialog
                description={goalForm.id ? "Update the name, target, and timing for this goal." : "Set a target for something you want to make room for."}
                onClose={() => setGoalDialogOpen(false)}
                open={goalDialogOpen}
                size="narrow"
                title={goalForm.id ? "Edit savings goal" : "New savings goal"}
            >
                <form className={styles.goalForm} onSubmit={saveGoalForm} noValidate>
                    <label>
                        <span>Goal name</span>
                        <input autoComplete="off" maxLength="36" onChange={(event) => setGoalForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. A place by the coast" value={goalForm.name} />
                    </label>
                    <label>
                        <span>Purpose</span>
                        <input maxLength="48" onChange={(event) => setGoalForm((current) => ({ ...current, purpose: event.target.value }))} placeholder="Travel, home, emergency fund" value={goalForm.purpose} />
                    </label>
                    <label>
                        <span>Target amount</span>
                        <input min="1" onChange={(event) => setGoalForm((current) => ({ ...current, target: event.target.value }))} placeholder="0.00" step="0.01" type="number" value={goalForm.target} />
                    </label>
                    <label>
                        <span>Target date <em>Optional</em></span>
                        <input onChange={(event) => setGoalForm((current) => ({ ...current, dueDate: event.target.value }))} type="date" value={goalForm.dueDate} />
                    </label>
                    {goalFormError && <p className={styles.formError} role="alert">{goalFormError}</p>}
                    <div className={styles.formActions}>
                        <button className={styles.cancelButton} data-initial-focus onClick={() => setGoalDialogOpen(false)} type="button">Cancel</button>
                        <button className={styles.saveButton} type="submit">{goalForm.id ? "Save goal" : "Create goal"}</button>
                    </div>
                </form>
            </Dialog>

            <Dialog
                description={moveDialog ? (moveDialog.direction === "add" ? "Choose an account to contribute from." : "Choose an account to receive the withdrawal.") : ""}
                onClose={() => setMoveDialog(null)}
                open={Boolean(moveDialog)}
                size="narrow"
                title={moveDialog?.direction === "add" ? "Add money to goal" : "Withdraw from goal"}
            >
                {moveDialog && (
                    <form className={styles.goalForm} onSubmit={reviewMove} noValidate>
                        <div className={styles.moveContext}>
                            <span>{moveDialog.goal.name}</span>
                            <strong>{moveDialog.direction === "add"
                                ? formatMoney(moveDialog.goal.target - moveDialog.goal.saved) + " left to target"
                                : formatMoney(moveDialog.goal.saved) + " saved"}</strong>
                        </div>
                        <label>
                            <span>{moveDialog.direction === "add" ? "Take from account" : "Return to account"}</span>
                            <select onChange={(event) => setMoveAccountId(event.target.value)} value={moveAccountId}>
                                {accounts.map((account) => <option key={account.id} value={account.id}>{account.name} ···· {account.lastFour}</option>)}
                            </select>
                        </label>
                        <label>
                            <span>Amount</span>
                            <input min="0.01" onChange={(event) => setMoveAmount(event.target.value)} placeholder="0.00" step="0.01" type="number" value={moveAmount} />
                        </label>
                        {moveError && <p className={styles.formError} role="alert">{moveError}</p>}
                        <div className={styles.formActions}>
                            <button className={styles.cancelButton} data-initial-focus onClick={() => setMoveDialog(null)} type="button">Cancel</button>
                            <button className={styles.saveButton} type="submit">Review amount</button>
                        </div>
                    </form>
                )}
            </Dialog>

            <ConfirmDialog
                cancelLabel="Go back"
                confirmLabel={moveConfirmation?.direction === "add" ? "Confirm contribution" : "Confirm withdrawal"}
                description={moveConfirmation
                    ? (moveConfirmation.direction === "add" ? "Move " : "Return ") + formatMoney(moveConfirmation.amount) + (moveConfirmation.direction === "add" ? " from " : " to ") + (accounts.find((account) => account.id === moveConfirmation.accountId)?.name || "your account") + " for " + moveConfirmation.goalName + "? This updates sample balances only."
                    : ""}
                onClose={() => setMoveConfirmation(null)}
                onConfirm={confirmMove}
                open={Boolean(moveConfirmation)}
                title={moveConfirmation?.direction === "add" ? "Confirm contribution" : "Confirm withdrawal"}
                tone="primary"
            />

            <ConfirmDialog
                description={deleteCandidate
                    ? "Remove " + deleteCandidate.name + " from this session? The goal allocation becomes available in its linked account."
                    : ""}
                onClose={() => setDeleteCandidate(null)}
                onConfirm={confirmDelete}
                open={Boolean(deleteCandidate)}
                title="Delete savings goal?"
                confirmLabel="Delete goal"
            />
        </div>
    );
};

export default GoalsPage;