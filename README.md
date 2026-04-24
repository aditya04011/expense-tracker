# Expense Tracker

A full-stack personal finance tool designed to help users record and review their daily expenses, providing insights into their spending habits. This application aims for production-like quality, focusing on data correctness, reliability under realistic conditions, and a clear, maintainable codebase.

## Features

### Core Functionality
*   **Create Expense:** Users can add new expense entries including `amount`, `category`, `description`, and `date`.
*   **View Expenses:** Displays a list/table of existing expenses.
*   **Filter Expenses:** Ability to filter the expense list by `category`.
*   **Sort Expenses:** Expenses can be sorted by `date` in descending order (newest first).
*   **Total Expenses:** A live total sum of the currently displayed expenses (after filtering/sorting).

### Advanced / Production-like Features
*   **Robust Data Validation:** Both client-side (React) and server-side (Joi) validation ensures data integrity, preventing negative amounts, enforcing required fields, and validating data types (e.g., ISO date strings).
*   **Persistent Idempotency:** The backend handles client retries gracefully using an `X-Request-Id` header and a dedicated `ProcessedRequest` MongoDB collection with a TTL (Time-To-Live) index. This prevents duplicate entries even across server restarts.
*   **Persistent Storage:** All expense data is stored in a MongoDB database, ensuring data persistence.
*   **Modular Backend Architecture:** The backend is structured into `config`, `models`, `controllers`, `routes`, and `validations` directories for clear separation of concerns and maintainability.
*   **Modal-based UI Workflow:** Expense creation is handled via a clean, focused modal dialog, enhancing user experience and keeping the main dashboard decluttered.
*   **Environment Variables:** Configuration is managed using `.env` files for secure and flexible deployment.

## Technical Stack

### Backend
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js APIs.
*   **MongoDB:** NoSQL database for flexible and scalable data storage.
*   **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
*   **Joi:** Powerful schema description language and data validator.
*   **UUID:** For generating unique identifiers (`X-Request-Id` and expense IDs).
*   **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
*   **Dotenv:** For loading environment variables from a `.env` file.

### Frontend
*   **React:** JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in the frontend.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **UUID:** For generating `X-Request-Id` headers on the client-side.
*   **React Toastify:** For displaying user-friendly notifications (e.g., success messages, validation errors).

## Key Design Decisions

1.  **Monorepo Structure:** The project uses a monorepo approach (`backend/` and `frontend/` directories) for easier development and deployment of related services.
2.  **Persistent Idempotency:** Implemented by storing client-generated `X-Request-Id` headers in a `ProcessedRequest` MongoDB collection. A TTL index ensures this collection doesn't grow indefinitely, automatically cleaning old request IDs. This guarantees that duplicate `POST` requests (due to network issues or accidental double-clicks) result in only one expense entry.
3.  **Comprehensive Validation (Joi):** Server-side validation using Joi provides a robust layer of data integrity, preventing malformed or malicious data from reaching the database. Client-side validation with `react-toastify` enhances user feedback.
4.  **Modular Backend:** The backend is logically separated into distinct layers (models, controllers, routes, config, validations) to improve code organization, readability, and maintainability.
5.  **MongoDB for Persistence:** Chosen for its flexibility and ease of integration with Node.js/Mongoose, providing a scalable solution for storing expense data.
6.  **Modal-based Expense Creation:** The frontend employs a modal dialog for adding new expenses, offering a focused and less cluttered user experience compared to an inline form.
7.  **Real-time UI Updates:** The frontend automatically refetches and updates the expense list, filters, and total sum after any successful transaction, ensuring the UI always reflects the current state of the backend.

## Trade-offs Made (due to timebox)

Given the 3-hour time constraint, certain features and optimizations were prioritized or intentionally omitted:

*   **No User Authentication/Authorization:** The application is currently designed for a single user or assumes authentication is handled externally.
*   **Basic UI Styling:** While clean and functional, the styling is not highly elaborate or component-library-driven (e.g., Chakra UI, Material UI).
*   **Limited Automated Testing:** Focus was placed on manual end-to-end testing of API functionality and UI interactions rather than comprehensive unit or integration test suites.
*   **No Advanced Reporting/Charts:** While the foundation for data is there, advanced visualizations or summary dashboards (e.g., total per category charts) were not implemented.
*   **Simple Error Handling:** Error messages are displayed via toasts; more sophisticated error boundaries or dedicated error pages were not implemented.
*   **No Optimistic UI Updates:** The UI always waits for a server response and refetches data after a POST to guarantee data consistency, rather than optimistically updating and potentially rolling back.

## Setup and Run Instructions

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (v8 or higher recommended)
*   A running MongoDB instance (local or cloud-hosted like MongoDB Atlas).

### 1. Backend Setup

1.  Navigate into the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with your MongoDB URI.
    ```
    MONGO_URI="mongodb://localhost:27017/expenseTracker"
    PORT=9003
    ```
    *(Adjust `MONGO_URI` if your MongoDB instance is hosted elsewhere.)*
4.  Start the backend server:
    ```bash
    node server.js
    ```
    The server should be running on `http://localhost:9003` (or your specified PORT).

### 2. Frontend Setup

1.  Navigate into the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory to specify the backend API URL:
    ```
    REACT_APP_API_URL=http://localhost:9003
    ```
4.  Start the frontend development server:
    ```bash
    npm start
    ```
    The application should open in your browser, typically at `http://localhost:3000`.

## API Endpoints

### `POST /expenses`

*   **Description:** Creates a new expense entry. Supports idempotency using the `X-Request-Id` header.
*   **Method:** `POST`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `X-Request-Id: <unique-uuid>` (e.g., `X-Request-Id: 123e4567-e89b-12d3-a456-426614174000`)
*   **Request Body (JSON):**
    ```json
    {
        "amount": 50.75,
        "category": "Food",
        "description": "Coffee and pastry",
        "date": "2024-04-26T10:30:00Z"
    }
    ```
*   **Responses:**
    *   `201 Created`: Successfully created expense. Returns the new expense object.
    *   `200 OK`: Request with this `X-Request-Id` was already processed. Returns `{ "message": "Request already processed successfully." }`.
    *   `400 Bad Request`: Validation error (e.g., missing fields, invalid amount/date). Returns `{ "errors": ["Error message 1", "Error message 2"] }`.

### `GET /expenses`

*   **Description:** Retrieves a list of expenses. Supports optional filtering and sorting.
*   **Method:** `GET`
*   **Query Parameters:**
    *   `category`: (Optional) Filters expenses by category (case-insensitive).
    *   `sort`: (Optional) Sorts the expenses. Currently supports `date_desc` for newest first.
*   **Responses:**
    *   `200 OK`: Returns an array of expense objects.

#### Example Requests (using `curl` for backend testing):

**Create a new expense:**
```bash
curl -X POST http://localhost:9003/expenses \
-H "Content-Type: application/json" \
-H "X-Request-Id: $(uuidgen)" \
-d '{
    "amount": 100.50,
    "category": "Shopping",
    "description": "New shirt",
    "date": "2024-04-26T14:00:00Z"
}'
```

**Attempt an idempotent retry (re-use the same X-Request-Id):**
```bash
# First, generate a UUID and save it
export REQ_ID=$(uuidgen)

curl -X POST http://localhost:9003/expenses \
-H "Content-Type: application/json" \
-H "X-Request-Id: $REQ_ID" \
-d '{
    "amount": 75.00,
    "category": "Entertainment",
    "description": "Movie tickets",
    "date": "2024-04-25T19:00:00Z"
}'
```

**Get all expenses:**
```bash
curl http://localhost:9003/expenses
```

**Get expenses filtered by category "Food":**
```bash
curl "http://localhost:9003/expenses?category=Food"
```

**Get expenses sorted by date (newest first):**
```bash
curl "http://localhost:9003/expenses?sort=date_desc"
```
