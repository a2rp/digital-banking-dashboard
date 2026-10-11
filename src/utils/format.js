const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
});

export const formatMoney = (value) => currencyFormatter.format(value);

export const formatSignedMoney = (value) => {
    if (value > 0) return `+${formatMoney(value)}`;
    return formatMoney(value);
};

export const formatDate = (value) => {
    if (!value) return "Not set";
    return dateFormatter.format(new Date(`${value}T12:00:00`));
};

export const todayAsISO = () => new Date().toISOString().slice(0, 10);

export const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
