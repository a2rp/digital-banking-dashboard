import { useMemo, useState } from "react";
import { initialAccounts, initialCards, initialGoals, initialTransactions } from "../data/seed";
import { makeId, todayAsISO } from "../utils/format";

const cents = (value) => Math.round(value * 100) / 100;

const useBankingState = (notify) => {
    const [accounts, setAccounts] = useState(initialAccounts);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [cards, setCards] = useState(initialCards);
    const [goals, setGoals] = useState(initialGoals);

    const totalBalance = useMemo(
        () => accounts.reduce((total, account) => total + account.available, 0),
        [accounts],
    );

    const transferMoney = ({ fromAccountId, toAccountId, recipientName, amount, note }) => {
        const value = cents(Number(amount));
        const source = accounts.find((account) => account.id === fromAccountId);
        const destination = accounts.find((account) => account.id === toAccountId);
        const isInternal = Boolean(destination);

        if (!source || !recipientName || value <= 0) {
            notify("Choose a recipient and enter an amount greater than zero.", "error");
            return false;
        }
        if (source.available < value) {
            notify("This transfer is above the available balance.", "error");
            return false;
        }
        if (isInternal && source.id === destination.id) {
            notify("Choose a different account to move money.", "error");
            return false;
        }

        setAccounts((current) => current.map((account) => {
            if (account.id === fromAccountId) return { ...account, balance: cents(account.balance - value), available: cents(account.available - value) };
            if (isInternal && account.id === toAccountId) return { ...account, balance: cents(account.balance + value), available: cents(account.available + value) };
            return account;
        }));

        const date = todayAsISO();
        const outgoing = {
            id: makeId("transfer"),
            merchant: isInternal ? "Transfer to " + destination.name : recipientName,
            category: "Transfer",
            amount: -value,
            date,
            accountId: fromAccountId,
            status: "Completed",
            method: isInternal ? "Internal transfer" : "Demo external transfer",
            note: note || "Demo transfer",
            reviewed: false,
        };
        const incoming = isInternal ? {
            ...outgoing,
            id: makeId("transfer"),
            merchant: "Transfer from " + source.name,
            amount: value,
            accountId: toAccountId,
            note: note || "Demo transfer",
        } : null;
        setTransactions((current) => [outgoing, ...(incoming ? [incoming] : []), ...current]);
        notify(isInternal ? "Money moved between your Vela accounts." : "Demo transfer recorded. No funds were sent.", "success");
        return true;
    };

    const updateTransaction = (transactionId, updates) => {
        setTransactions((current) => current.map((transaction) => (
            transaction.id === transactionId ? { ...transaction, ...updates } : transaction
        )));
        notify("Activity details updated.");
    };

    const toggleCard = (cardId) => {
        let nextStatus = "Active";
        setCards((current) => current.map((card) => {
            if (card.id !== cardId) return card;
            nextStatus = card.status === "Locked" ? "Active" : "Locked";
            return { ...card, status: nextStatus };
        }));
        notify(nextStatus === "Locked" ? "Card locked for new demo purchases." : "Card unlocked for demo use.");
    };

    const saveCard = (cardInput) => {
        if (cardInput.id) {
            setCards((current) => current.map((card) => card.id === cardInput.id
                ? { ...card, ...cardInput, monthlyLimit: Number(cardInput.monthlyLimit) }
                : card));
            notify("Card settings updated.");
            return;
        }

        const newCard = {
            ...cardInput,
            id: makeId("card"),
            lastFour: String(Math.floor(1000 + Math.random() * 9000)),
            kind: "Virtual",
            status: "Active",
            spent: 0,
            color: "blue",
            monthlyLimit: Number(cardInput.monthlyLimit),
        };
        setCards((current) => [newCard, ...current]);
        notify("Virtual card created for this demo session.");
    };

    const deleteCard = (cardId) => {
        setCards((current) => current.filter((card) => card.id !== cardId));
        notify("Demo card removed.");
    };

    const saveGoal = (goalInput) => {
        if (goalInput.id) {
            setGoals((current) => current.map((goal) => goal.id === goalInput.id
                ? { ...goal, ...goalInput, target: Number(goalInput.target) }
                : goal));
            notify("Savings goal updated.");
            return;
        }

        setGoals((current) => [{
            ...goalInput,
            id: makeId("goal"),
            target: Number(goalInput.target),
            saved: 0,
            color: ["blue", "coral", "mint"][current.length % 3],
        }, ...current]);
        notify("Savings goal created.");
    };

    const moveGoalFunds = ({ goalId, amount, direction, accountId }) => {
        const value = cents(Number(amount));
        const goal = goals.find((item) => item.id === goalId);
        const account = accounts.find((item) => item.id === accountId);
        const goalAccount = accounts.find((item) => item.id === goal?.accountId);

        if (!goal || !account || !goalAccount || value <= 0) {
            notify("Choose a goal and enter an amount greater than zero.", "error");
            return false;
        }
        if (direction === "add" && account.available < value) {
            notify("This amount is above the available balance.", "error");
            return false;
        }
        if (direction === "take" && goal.saved < value) {
            notify("This is more than the amount saved in this goal.", "error");
            return false;
        }

        const isAdd = direction === "add";
        const fromAccountId = isAdd ? account.id : goalAccount.id;
        const toAccountId = isAdd ? goalAccount.id : account.id;
        if (fromAccountId !== toAccountId) {
            setAccounts((current) => current.map((item) => {
                if (item.id === fromAccountId) return { ...item, balance: cents(item.balance - value), available: cents(item.available - value) };
                if (item.id === toAccountId) return { ...item, balance: cents(item.balance + value), available: cents(item.available + value) };
                return item;
            }));
        }
        setGoals((current) => current.map((item) => item.id === goalId
            ? { ...item, saved: cents(item.saved + (isAdd ? value : -value)) }
            : item));

        if (fromAccountId !== toAccountId) {
            const date = todayAsISO();
            const outgoing = {
                id: makeId("goal"),
                merchant: isAdd ? "Moved to " + goal.name : "From " + goal.name,
                category: "Transfer",
                amount: -value,
                date,
                accountId: fromAccountId,
                status: "Completed",
                method: "Savings goal transfer",
                note: isAdd ? "Savings contribution" : "Goal withdrawal",
                reviewed: false,
            };
            const incoming = {
                ...outgoing,
                id: makeId("goal"),
                merchant: isAdd ? "From " + goal.name : "Moved to " + goal.name,
                amount: value,
                accountId: toAccountId,
            };
            setTransactions((current) => [outgoing, incoming, ...current]);
        }

        notify(isAdd ? "Contribution added to your goal." : "Money returned from your goal.");
        return true;
    };

    const deleteGoal = (goalId) => {
        const goal = goals.find((item) => item.id === goalId);
        setGoals((current) => current.filter((goalItem) => goalItem.id !== goalId));
        notify(goal?.saved
            ? "Goal removed. Its allocated money is available in your account."
            : "Savings goal removed.");
    };

    return {
        accounts,
        cards,
        deleteCard,
        deleteGoal,
        goals,
        moveGoalFunds,
        saveCard,
        saveGoal,
        totalBalance,
        transactions,
        transferMoney,
        toggleCard,
        updateTransaction,
    };
};

export default useBankingState;