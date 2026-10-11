![Vela digital banking dashboard](./screenshot.png)

# Vela

Vela is a frontend-only digital banking workspace for reviewing sample accounts, tracking activity, moving demo money, managing card controls, and planning savings goals.

**Live demo:** [https://a2rp.github.io/digital-banking-dashboard/](https://a2rp.github.io/digital-banking-dashboard/)  
**Public repository:** [https://github.com/a2rp/digital-banking-dashboard](https://github.com/a2rp/digital-banking-dashboard)

## Pages and features

| Page | What you can do |
| --- | --- |
| Home | Switch between three sample accounts, view available and total balances, inspect recent activity and weekly movement, and download an account statement as CSV. |
| Activity | Search transactions, filter by account, status, and category, sort by date or amount, open transaction details, change a category, mark an item reviewed, and export the current results to CSV. |
| Move money | Validate a transfer between sample accounts or to a saved demo recipient, review it in a confirmation dialog, and update sample balances and activity after confirmation. |
| Cards | Lock or unlock a demo card, edit its monthly limit, create a masked virtual card for the session, or remove a card after confirmation. |
| Savings goals | Create, edit, and delete goals; contribute from a sample account; or withdraw saved funds. Contributions and withdrawals update goal allocations, sample account balances, and activity together. |
| Not Found | Return to the account overview from an unknown route. |

## Demo behavior

All records are sample data held in React state for the current browser session. No bank account is connected, no funds are sent, and no card is issued. Refreshing the page resets changes to the original sample data. CSV downloads contain only the currently displayed demo records.

The demo uses no backend or persistent browser storage. Account balances, transfers, card settings, goal allocations, and activity changes are not saved after a refresh and are not shared across users or devices.

## Screenshots

The captures below show the implemented pages and every dialog state in the app.

### Pages

**Home - account overview, balances, weekly movement, and recent activity**

![Vela home page and account overview](./screenshot.png)

**Activity - searchable and filterable transaction register**

![Vela activity page with transaction filters and records](./screenshots/activity.png)

**Move money - transfer form and recent demo transfers**

![Vela transfer page with source, recipient, and amount fields](./screenshots/transfers.png)

**Cards - card controls and spending limits**

![Vela cards page with demo card controls](./screenshots/cards.png)

**Savings goals - balances, targets, and goal actions**

![Vela savings goals page](./screenshots/goals.png)

**Not Found - route recovery page**

![Vela not found page](./screenshots/not-found.png)

### Dialogs

**Demo information**

![Dialog explaining the sample banking experience](./screenshots/demo-info.png)

**Transaction details**

![Transaction details dialog with category and review controls](./screenshots/activity-detail.png)

**Review transfer**

![Transfer confirmation dialog with the sample amount and accounts](./screenshots/transfer-confirmation.png)

**Create a virtual card**

![New virtual card dialog with card name, account, and monthly limit](./screenshots/new-virtual-card.png)

**Set a card spending limit**

![Spending limit dialog for a selected demo card](./screenshots/spending-limit.png)

**Remove a card**

![Confirmation dialog before removing a demo card](./screenshots/remove-card-confirmation.png)

**Create a savings goal**

![New savings goal dialog with name, purpose, target, and date](./screenshots/new-goal.png)

**Edit a savings goal**

![Edit savings goal dialog](./screenshots/edit-goal.png)

**Add money to a goal**

![Contribution dialog for choosing an account and amount](./screenshots/add-money-to-goal.png)

**Confirm a contribution**

![Confirmation dialog before adding money to a savings goal](./screenshots/goal-contribution-confirmation.png)

**Withdraw from a goal**

![Withdrawal dialog for choosing a destination account and amount](./screenshots/withdraw-from-goal.png)

**Confirm a withdrawal**

![Confirmation dialog before returning goal funds to an account](./screenshots/goal-withdrawal-confirmation.png)

**Delete a savings goal**

![Confirmation dialog before deleting a savings goal](./screenshots/delete-goal-confirmation.png)

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Other project commands:

```bash
npm run lint
npm run build
npm run deploy
```

The deploy command builds the app, adds the GitHub Pages fallback, and publishes `dist` to the `gh-pages` branch. The configured base path is `/digital-banking-dashboard/`.

## Image credit

The locally stored card image is “Person using smartphone and credit card with laptop” by [Michael Lima on Unsplash](https://unsplash.com/photos/person-using-smartphone-and-credit-card-with-laptop-Q9aqU6g49iw). It is used under the [Unsplash License](https://unsplash.com/license).

## Future improvements

These ideas are not implemented in this frontend demo:

- Add secure, server-backed user accounts with shared data, sign-in, and permissions.
- Connect a regulated banking provider through a secure backend with user consent and appropriate safeguards.
- Add server-side transaction history, statements, and audit records that persist across devices.
- Add verified identity, account support, and fraud review workflows backed by a real service.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
