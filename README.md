# Panda Manager: Backend
This is an API implemented with NestJS for the Panda Manager application.

## Running the server
Please make sure to add the following environment variables beforehand:
```
APP_PORT=8080
APP_URL="http://localhost:${APP_PORT}"
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_HOSTNAME=localhost
MONGO_DB=panda-manager
MONGO_PORT=27017
MONGO_URL="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin"
ACCESS_TOKEN_SECRET=
OTP_MAIL_HOST=smtp-mail.outlook.com
OTP_MAIL_USER=
OTP_MAIL_PASSWORD=
OTP_MAIL_PORT=587
NODE_ENV=development
```

### Run manually
A MongoDB instance should be running on port 27017 on your machine with the credentials specified in the environment variables. You can change their values to your liking.
You can do that using a docker-compose.yaml, for example:
```
version: '3.8'

services:
  app_db:
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

To run a container from that file, run the following command from the same folder as the folder that the docker-compose.yml file is saved in using the command:
```
docker-compose up
```

Run the application using the command:
```
npm run start
```

### Run as docker image
You can use the docker-compose.yaml included here and just run:
```
docker-compose build
docker-compose up
```

from the project's root directory.
