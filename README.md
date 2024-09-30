# Star Wars Backend

## Overview

This is the backend part of the Star Wars project, which wraps the [Star Wars API](https://swapi.dev/api/) and provides additional features such as pagination, caching with Redis, and API throttling. It is built using **NestJS** and containerized using **Docker**.

Repository: [https://github.com/only1tele/starwar-backend](https://github.com/only1tele/starwar-backend)

---

## Features

1. **Star Wars API Wrapper**:

   - Simplifies access to the Star Wars API by providing custom endpoints to fetch characters (people) and planets data.

2. **Paginated Data**:

   - The `/people` and `/planets` endpoints support pagination with the `?page` query parameter, allowing efficient data retrieval.

3. **Search Functionality**:

   - Allows searching for characters and planets using a `?search` query parameter.

4. **Detailed Data Retrieval**:

   - Retrieve individual details for characters and planets with the `/people/:id` and `/planets/:id` endpoints.

5. **Caching with Redis**:

   - Redis is used to cache API responses, which reduces external API requests and improves performance.

6. **Swagger API Documentation**:

   - Swagger UI is available at `/docs`, allowing you to interact with and test the API in the browser. You can explore available endpoints, see response formats, and send test requests.

7. **API Throttling**:

   - Limits the number of requests a client can make within a certain timeframe to prevent abuse.

8. **RESTful API**:
   - Follows REST principles for structured resource management and easy extension of the API.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/only1tele/starwar-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd starwar-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

5. Open [http://localhost:3007/docs](http://localhost:3007/docs) to interact with the API using Swagger UI.

---

## API Endpoints

- **GET `/people`**: Fetches a paginated list of Star Wars characters.
  - Supports `?page` for pagination and `?search` for filtering results by name.
- **GET `/people/:id`**: Fetches a single character by ID.

- **GET `/planets`**: Fetches a paginated list of planets.

  - Supports `?page` for pagination and `?search` for filtering results by name.

- **GET `/planets/:id`**: Fetches a single planet by ID.

### API Documentation

- Access the interactive API documentation at `/docs`. This will allow you to:
  - View available endpoints.
  - Test API queries directly in the browser.
  - Explore request parameters and response formats.

---

## Docker Setup

You can run the backend with Redis using Docker and Docker Compose.

### Using Docker

1. Build the Docker image:

   ```bash
   docker build -t starwar-backend .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3007:3007 starwar-backend
   ```

### Using Docker Compose

1. Start the backend and Redis using Docker Compose:

   ```bash
   docker-compose up
   ```

---

### Running Tests

To run the tests, use the following commands:

- **Run all tests**:
  ```bash
  npm test
  ```
