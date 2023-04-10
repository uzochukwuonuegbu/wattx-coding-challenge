#### Heating System Controller

This is a Node.js application that implements a Heating Systme Controller. 
It provides one endpoint: /set-temp which adjusts a room valve based on tempearute input. The endpoint returns JSON.
It also provides Mqtt implementation for pub/sub on multiple topics - it simulates periodic (random) room temperature readings, calculates the valve level(openess) for the room, and then publishes this information to actuator topic(per room).

## Implementation Details
    This application is built using Node.js(Typescript) and the Express framework, we are using Mosquitto.org as a cloud broker for out Mqtt events. It uses a simple algorithm to calculate the valve level to set. It also temporarily caches the current valve level of a room, using redis.

    Note: I simulated the periodic temperature readings on the topic /readings/room-1/temperature, in main.ts, using NODEJS setInterval().


### Getting Started:
    - Clone this repository to your local machine.
    - Navigate to the project directory and run npm install to install the necessary dependencies.


### Running the Application in Docker
**NB:
    Make sure you have docker installed and running.
    Also note the different PORTS - app, redis and mosquitto containers all expose different ports for different environments.

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
        **NB: No integration(as well as API testing) tests were done, due to time constrain, but they are important to ensure reliability.
        - Run:
            npm run test:integration