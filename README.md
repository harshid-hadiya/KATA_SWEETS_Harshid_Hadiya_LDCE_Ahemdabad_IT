# Sweet Shop Management System

A simple backend API to manage sweets in a shop. Built with Node.js, Express, Mongoose, and tested using Jest.

## Features

- Add new sweets (owner only, with validation for name, category, price, and quantity)
- Delete sweets (owner only)
- View all sweets (public)
- Search and sort sweets by name, category, price range, and sort by price or name (public)
- Purchase sweets as a customer (decreases stock, checks for enough stock)
- Restock sweets (owner only, increases stock)
- Customer registration/login by name and unique mobile number
- All features are fully tested with edge cases

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start MongoDB** (make sure it's running locally or set `MONGO_URL` in your environment)
3. **Run tests:**
   ```bash
   "npm test -- --runInBand"
   ```
4. **Start the server:**
   ```bash
   node src/app.js
   ```

## Authentication

- **Shop Owner:**
  - Login: `POST /api/owner/login` with `{ username, password }` (default: `shopowner`/`ownerpass`)
  - Use the returned JWT as `Authorization: Bearer <token>` for all protected endpoints (add, delete, restock sweets).
- **Customer:**
  - Register/Login: `POST /api/customers/login` with `{ name, mobile }` (mobile must be unique)

## API Endpoints

### Sweets

- `POST /api/sweets` (owner only, JWT required) — Add a new sweet
- `DELETE /api/sweets/:id` (owner only, JWT required) — Delete a sweet by ID
- `PATCH /api/sweets/:id/restock` (owner only, JWT required) — Restock a sweet (increase quantity)
- `GET /api/sweets` — View all sweets
- `GET /api/sweets/search?name=&category=&minPrice=&maxPrice=&sortBy=&sortOrder=` — Search and sort sweets

### Customers

- `POST /api/customers/login` — Register or login a customer (by name and unique mobile)

### Purchase

- `POST /api/sweets/:id/purchase` — Customer purchases a sweet (body: `{ customerMobile, quantity }`)

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Jest (for testing)

## Testing

- All features are covered by Jest test suites, including edge cases for validation, authentication, and business logic.
- To run all tests:
  ```bash
  npm test
  ```

---

**Note:** This project is backend-only. All requirements from the kata are fully implemented and tested.