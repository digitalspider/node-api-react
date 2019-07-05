module.exports = (schema) => {
/**
------ DO NOT EDIT THIS FILE ------
    create a migration file instead
*/

/** DROP Tables
DROP TABLE IF EXISTS ${schema}.user_role;
DROP TABLE IF EXISTS ${schema}.role;
DROP TABLE IF EXISTS ${schema}.user;
*/

return `
/** TABLE: User */
DROP TABLE IF EXISTS ${schema}.user;
CREATE TABLE IF NOT EXISTS ${schema}.user (
    recuid               serial PRIMARY KEY,
    username             varchar(128) not null,
    password             varchar(64) not null,
    email                varchar(128) not null,
    name                 varchar(128) not null,
    token                varchar(256) null,
    title                varchar(10) null,
    position             varchar(50) null,
    phone                varchar(18) null,
    mobile               varchar(18) null,
    last_visit           timestamp not null default CURRENT_DATE,
    total_visits         int not null default 0,
    created_by           int not null,
    created_at           timestamp not null default CURRENT_DATE,
    updated_at           timestamp null,
    deleted_at           timestamp null,
);

/** TABLE: Role */
DROP TABLE IF EXISTS ${schema}.role;
CREATE TABLE ${schema}.role (
  recuid                 serial PRIMARY KEY,
  name                   varchar(255) NOT NULL,
  description            varchar(255)
);

/** TABLE: UserRole = ManyToMany links users and roles */
DROP TABLE IF EXISTS ${schema}.user_role;
CREATE TABLE ${schema}.user_role (
  user_id int NOT NULL,
  role_id int NOT NULL,
  CONSTRAINT FK_user_role_user_id FOREIGN KEY (user_id) REFERENCES ${schema}.user (recuid),
  CONSTRAINT FK_user_role_role_id FOREIGN KEY (role_id) REFERENCES ${schema}.role (recuid)
);
`
};
