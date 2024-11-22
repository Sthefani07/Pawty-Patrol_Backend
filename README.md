# Pet-Friendly Locations API

## Location Routes (`/locations`)

| Method | Endpoint           | Description                 | Request Body                                                                                      |
|--------|--------------------|-----------------------------|---------------------------------------------------------------------------------------------------|
| POST   | `/locations`       | Create a new location       | `{"name": "Pet Park", "type": "park", "address": "1234 Park Lane", "description": "A large park for pets to play", "date": "2024-11-22", "time": "10:00 AM"}` |
| GET    | `/locations`       | Retrieve all locations      | N/A                                                                                               |
| PUT    | `/locations/:id`   | Update a location by ID     | `{"name": "Updated Park Name", "address": "5678 New Address Lane"}`                                |
| DELETE | `/locations/:id`   | Delete a location by ID     | N/A                                                                                               |

---

## User Routes (`/users`)

| Method | Endpoint           | Description                 | Request Body                                                                                      |
|--------|--------------------|-----------------------------|---------------------------------------------------------------------------------------------------|
| POST   | `/users`           | Register a new user         | `{"username": "JohnDoe", "email": "johndoe@example.com", "password": "securepassword123"}`         |
| GET    | `/users`           | Retrieve all users          | N/A                                                                                               |
| PUT    | `/users/:id`       | Update a user by ID         | `{"username": "UpdatedName", "email": "updatedemail@example.com"}`                                 |
| DELETE | `/users/:id`       | Delete a user by ID         | N/A                                                                                               |

---

## Testing Steps in Postman

1. Open Postman and create a new request.
2. Set the appropriate HTTP method (e.g., POST, GET, PUT, DELETE).
3. Enter the URL for the endpoint (e.g., `http://localhost:3000/locations`).
4. Add the headers if required:
   - `Content-Type: application/json`
5. For POST or PUT requests, select **Body** -> **raw**, and paste the request body in JSON format.
6. Click **Send** and review the response.
