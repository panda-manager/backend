# Panda Manager: Backend
This is an API implemented with NestJS for the Panda Manager application.
To run this application locally, please make sure to add the following environment variables beforehand:
```
PORT=8080
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_HOSTNAME=localhost
MONGO_PORT=27017
```

Run the application using the command:
```
npm run start
```

To test the application locally, a MongoDB instance should be running on the default 27017 port on your machine with the credentials specified in the environment variables. You can change their values to your liking.

You can do that using a docker-compose.yaml, for example:
```
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

volumes:
  mongodb_data:
    driver: local

```
Run it from the same folder that the docker-compose.yml file is saved in using the command:
```
docker-compose up
```
