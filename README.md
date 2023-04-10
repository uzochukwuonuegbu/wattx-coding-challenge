### Getting Started:
- Clone this repository to your local machine.
- Navigate to the project directory and run npm install to install the necessary dependencies.

### Running the Application in Docker
**NB: make sure you have docker installed and running

    development env:
        - Run:
            docker-compose up --build
        **The server should now be running on http://localhost:3001.

    production env:
        - Run:
            docker-compose -f docker-compose.yml -f production.yml up --build
        **The server should now be running on http://localhost:3000.

<!-- ------------------------------------------------------------------------- -->

### Running the Application on local machine(Dev)
    development env:
        - Run:
            npm run dev
        **The server should now be running on http://localhost:3001.

    development env:
        - Run:
            npm run start
        **The server should now be running on http://localhost:3000.


### Testing
    Unit Tests: 
        - Run:
            npm test
    Integration Tests:
        - Run:
            npm run test:integration