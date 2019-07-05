CREATE USER myapp WITH PASSWORD 'myapp' CREATEDB;
CREATE DATABASE myapp OWNER myapp;
GRANT ALL PRIVILEGES on DATABASE myapp to myapp;
-- connect to noncampaign database
CREATE SCHEMA IF NOT EXISTS myapp AUTHORIZATION myapp;
