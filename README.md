### Getting Started:
    - Clone this repository to your local machine.
    - Navigate to the project directory and run npm install to install the necessary dependencies.

### Running the Application in Docker
**NB: make sure you have docker installed and running

## development env:
    - Run:
        docker-compose up --build
    **The server should now be running on http://localhost:3001.

## production env:
    - Run:
        docker-compose -f docker-compose.yml -f production.yml up --build
    **The server should now be running on http://localhost:3000.

<!-- ------------------------------------------------------------------------- -->

### Running the Application on local machine(Dev)
## development env:
    - Run:
        npm run dev
    **The server should now be running on http://localhost:3001.

## development env:
    - Run:
        npm run start
    **The server should now be running on http://localhost:3000.


### Endpoints
    - URI: /set-temp
        - Description: Adjust a room valve based on tempearute input
        - Method: POST
        - Request Body: {
            "temperature": 25
            "room": "room-1"
        }
        - Response: {
            "message": "Set valve to 50%"
        }


### Testing
    Unit Tests: 
        - Run:
            npm test
    Integration Tests:
        - Run:
            npm run test:integration