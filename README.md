# Heating System Controller

*Key infrastructure considerations for Devops Implementation can be found in README.Devops.md, in the root folder*

This is a Node.js application that implements a Heating Systme Controller. 
It expposes one endpoint: /set-temp which adjusts a room valve based on tempearute input. The endpoint returns JSON.
It also provides Mqtt implementation for pub/sub on multiple topics - it simulates periodic (random) room temperature readings, calculates the valve level(openess) for the room, and then publishes this information to actuator topic(per room).

### Implementation Details

    This application is built using Node.js(Typescript) and the Express framework.
    We are using Mosquitto.org as a cloud broker for out Mqtt events.
    Uses a simple algorithm to calculate the valve level to set.
    It also temporarily caches the current valve level of a room, using redis.

*Note: I simulated the periodic temperature readings on the topic /readings/room-1/temperature, using NODEJS setInterval().*



## Getting Started:

    - Clone this repository to your local machine.
    - Navigate to the project directory and run npm install to install the necessary dependencies.


## Running the Application in Docker

    Make sure you have docker installed and running.
    Also note the different PORTS - which allows us to have multiple environments running concurrently.

### development env:

    - Run:
        docker-compose up --build

*The server should now be running on http://localhost:3001*

### production env:

    - Run:
        docker-compose -f docker-compose.yml -f production.yml up --build

*The server should now be running on http://localhost:3000*

<!-- ------------------------------------------------------------------------- -->


## Running the Application on local machine

### development env:

    - Run:
        npm run dev

*The server should now be running on http://localhost:3001*

### production env:

    - Run:
        npm run start

*The server should now be running on http://localhost:3000*



## Endpoints

*We can use Swagger to define the api docs, however this is fine for now, since it's a proof of concept.*

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



## Testing

    Unit Tests: 
        - Run:
            npm test
    Integration Tests:
*NB: No integration(as well as API testing) tests were done, due to time constrain, but they are important to ensure reliability.*