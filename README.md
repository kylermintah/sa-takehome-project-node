# To Run this Project

Clone the repository and run `npm install` to install dependencies:

```
git clone https://github.com/kylermintah/sa-takehome-project-node.git && cd sa-takehome-project-node
npm install
```

Create a `.env` file in the project root directory and add your **Stripe test API keys** to it as follows:

```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
```


Then run the application locally:

```
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the index page.

# Test Cards

Here are some card numbers you can use for testing the integration

| Outcome | Card Number |
| --- | --- |
| Successful Paymenet | `4242 4242 4242 4242` |
| Failed Payment | `4000 0000 0000 9995` |
| Require Authentication| `4000 0025 0000 3155` |
