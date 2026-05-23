# REST API Interface Contracts

All API endpoints return JSON. Non-GET endpoints that write or delete data require a valid Bearer JWT token with Admin permissions.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123",
    "role": "Viewer"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "user_id": 1
  }
  ```

### `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "role": "Viewer"
  }
  ```

---

## 2. Suppliers Endpoint

### `GET /api/suppliers`
* **Success Response (200 OK)**:
  ```json
  [
    {
      "supplier_id": 1,
      "contact_id": 101,
      "rating": 5,
      "contact_email": "supply@globex.com"
    }
  ]
  ```

### `POST /api/suppliers` (Admin Only)
* **Request Body**:
  ```json
  {
    "contact_id": 102,
    "rating": 4,
    "contact_email": "sales@acme.com"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "supplier_id": 2,
    "message": "Supplier created successfully"
  }
  ```

---

## 3. Query Lab Endpoint

### `POST /api/queries/execute`
* **Request Body**:
  ```json
  {
    "query_id": "top_suppliers"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "sql": "SELECT s.supplier_id, s.contact_email, COUNT(p.product_id) as total_products FROM Suppliers s LEFT JOIN Product p ON s.supplier_id = p.supplier_id GROUP BY s.supplier_id, s.contact_email",
    "columns": ["supplier_id", "contact_email", "total_products"],
    "results": [
      {
        "supplier_id": 1,
        "contact_email": "supply@globex.com",
        "total_products": 5
      }
    ]
  }
  ```
