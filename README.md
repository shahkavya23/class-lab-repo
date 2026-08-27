# Customer Authentication API

A Node.js and Express REST API for customer registration, login, authenticated profile access, and logout. Customer records are stored in MongoDB, passwords are hashed with bcrypt, and authentication uses a JWT stored in an HTTP-only cookie.

## Features

- Customer registration with duplicate-email protection
- Password hashing with bcrypt
- Login with JWT cookie authentication
- Authenticated customer profile endpoint
- Logout with cookie clearing
- MongoDB persistence through Mongoose

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB connection string

## Installation

From this directory, install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
dbURL=mongodb://127.0.0.1:27017/customer_db
JWT_SECRET=replace-with-a-long-random-secret
```

Do not commit `.env` or share its values.

## Running the API

Start the server with Node:

```bash
node index.js
```

For development with automatic restarts:

```bash
npx nodemon index.js
```

The API listens on `http://localhost:8082`.

## API Endpoints

All customer routes use the `/customers` prefix.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/customers/register` | No | Create a customer account |
| `POST` | `/customers/login` | No | Log in and receive an HTTP-only JWT cookie |
| `GET` | `/customers/me` | Yes | Get the authenticated customer profile |
| `POST` | `/customers/logout` | No | Clear the authentication cookie |

### Register

Request body:

```json
{
  "fullName": "Kavya Shah",
  "email": "kavya@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Login

Request body:

```json
{
  "email": "kavya@example.com",
  "password": "password123"
}
```

The login response sets a `token` cookie. Send that cookie with requests to `/customers/me`.

## Project Structure

```text
backend/
├── controllers/       Request handlers
├── middlewares/       JWT authentication middleware
├── models/            Mongoose customer model
├── routes/            Customer route definitions
├── index.js           Express and MongoDB application entry point
├── package.json       Project metadata and dependencies
└── .env               Local environment variables (not committed)
```

## Notes

- The server starts listening on port `8082`.
- MongoDB must be reachable using the `dbURL` value before database operations can succeed.
- The test script is not configured yet.
