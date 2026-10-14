# ShopEasy

A full-stack e-commerce web app built with the MERN stack. Users can browse products, manage a cart and wishlist, check out with Razorpay (test mode), and view their order history.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, React Router, Axios, Lucide icons |
| Backend | Node.js, Express 5, Mongoose, JWT (HTTP-only cookie), bcrypt |
| Database | MongoDB (MongoDB Atlas or local) |
| Payments | Razorpay (test mode) |

## Features

- Customer registration, login, logout, and profile (JWT stored in an HTTP-only cookie)
- Product catalog with product detail pages
- Cart: add, update quantity, remove
- Wishlist: add and remove
- Checkout with Razorpay payment, server-side payment verification
- Order history and order details
- Database seed script with a 20-product catalog

## Project Structure

```text
.
├── backend/
│   ├── config/          Razorpay client setup
│   ├── controllers/     Request handlers
│   ├── data/            Product seed data
│   ├── middlewares/     JWT authentication middleware
│   ├── models/          Mongoose models (customer, product, order)
│   ├── routes/          Express routes
│   ├── utils/
│   ├── index.js         Server entry point (port 8082)
│   ├── seed.js          Seeds the products collection
│   └── .env.example     Template for environment variables
└── frontend/
    └── shop-kart frontend/
        └── src/
            ├── components/
            ├── context/     Auth and toast contexts
            ├── features/    Redux slices
            ├── pages/       Home, Products, Cart, Checkout, Orders, Wishlist, Profile...
            └── store/       Redux store
```

## Prerequisites

- Node.js 18 or newer and npm
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB server
- A [Razorpay](https://razorpay.com/) account with **test mode** API keys (only needed for checkout)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend

```bash
cd backend
npm install
```

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `dbURL` | MongoDB connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>/shopkart` or `mongodb://127.0.0.1:27017/shopkart` |
| `JWT_SECRET` | Any long random string used to sign login tokens |
| `RAZORPAY_KEY_ID` | Razorpay test key ID (`rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |

> If you use MongoDB Atlas, add your IP address under **Network Access** in the Atlas dashboard.

Seed the database with products (optional; this replaces any existing products):

```bash
node seed.js
```

Start the API server:

```bash
npm run dev     # with auto-reload (nodemon)
# or
npm start
```

The API runs at `http://localhost:8082`.

### 3. Frontend

In a second terminal:

```bash
cd "frontend/shop-kart frontend"
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The backend must be running on port 8082.

## API Endpoints

Routes marked **Auth** require the login cookie.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/customers/register` | | Create an account |
| POST | `/customers/login` | | Log in and set the auth cookie |
| GET | `/customers/me` | Auth | Current user's profile |
| POST | `/customers/logout` | | Clear the auth cookie |
| GET | `/products` | | List all products |
| GET | `/products/:id` | | Get one product |
| POST | `/products` | | Create a product |
| GET | `/cart` | Auth | Get cart |
| POST | `/cart/:productId` | Auth | Add a product to the cart |
| PATCH | `/cart/:productId` | Auth | Update quantity |
| DELETE | `/cart/:productId` | Auth | Remove from cart |
| GET | `/wishlist` | Auth | Get wishlist |
| POST | `/wishlist/:productId` | Auth | Add to wishlist |
| DELETE | `/wishlist/:productId` | Auth | Remove from wishlist |
| POST | `/orders/create-payment-order` | Auth | Create a Razorpay order |
| POST | `/orders/verify-payment` | Auth | Verify payment and place the order |
| GET | `/orders` | Auth | List the user's orders |
| GET | `/orders/:id` | Auth | Get one order |

## Testing Payments

Checkout uses Razorpay **test mode**, so no real money is charged. Use the test cards and UPI IDs from the [Razorpay test documentation](https://razorpay.com/docs/payments/payments/test-card-details/).

## Security Notes

- `.env` is listed in `.gitignore` and is not committed. Only `.env.example` with placeholder values is included.
- Passwords are hashed with bcrypt, and the JWT is stored in an HTTP-only cookie.
