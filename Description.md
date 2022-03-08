# IMPLEMENTATION of DEEL BACKEND TASK

## Project structure

- ./scripts  -  seed information is existing
- ./src - the main directory of repository
  - config - database configuration
  - controllers - endpoint functions
  - middlewares - middleware of app
  - models - database schema declarations
  - routes - routes declarations for endpoints
  - services - service functions for endpoint
  - shared - util functions
  - app.js - app initializer
  - server.js
- package.json
- rest.postman_collection.json - api calling instructions and examples

## Cli commands
### Project running
You can run this project by using cli command:
```npm run start```

Then the server will be started on http://localhost:3001
### Database seed
You can seed database by using cli command:
```npm run seed```

The database file will be generated at ```./database.sqlite3```

## Api Request & Response
### mini-Authentication
You can set user information in request header.
`HEADER.profile_id=:userid`

### Response
Response data has common structure.

- Success response
    ```
      {
        "status": "SUCCESS",
        "data": { ...DataContent }
      }
    ```

- Failed response
    ```
      {
        "status": "Error",
        "error": Error message or object
      }
    ```
