# Node Application

# Dev environment
Note: the default URL for the application is http://localhost:4000/api/v1/
## Initial Setup
- run ```npm install```  
## Database setup
1. Execute the first 3 lines individually in api/db/sql_setup.sql on the postgres database in pgAdmin to create the myapp user, database and schema.
2. Connect to the myapp database to made sure it works, then update your .env file
3. Follow the steps under Database Migrations to initialise the database
## Database Migrations
To perform a data migration 
- run ```npm run db:migrate```