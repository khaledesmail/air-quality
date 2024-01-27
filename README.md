# Air Quality Monitoring Project

This project is an air quality monitoring application that fetches and stores air quality data for different locations, and includes a CRON job to periodically check air quality for the Paris zone.

## Prerequisites

Before running the project, make sure you have the following installed:

1. Node.js (version 18.17.0)
2. npm (vrsion 9.6.7)
3. MongoDB (Make sure MongoDB is running locally or provide connection details in the configuration)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/air-quality-monitoring.git
   cd air-quality-monitoring
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the configuration:**

   Update the `.env` file with your MongoDB connection details, API key, qair api url and port.

4. **Run the project:**

   ```bash
   npm start
   ```

   This will start the Node.js server.

## API Documentation

The API is documented using Swagger (OpenAPI). You can access the Swagger documentation at:

   [./Documentation)

The documentation includes details about available endpoints, request parameters, and example responses.

## Endpoints

- `/get_air_quality`: Get air quality information for the nearest city.
- `/most_polluted_datetime`: Get datetime when the Paris zone is most polluted.

## Testing

To run tests, use the following command:

```bash
npm test
```

This project includes unit tests with mocks to simulate API calls using the Nock library.
