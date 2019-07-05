module.exports = (schema) => {
/**

------ DO NOT EDIT THIS FILE ------
  create a migration file instead

*/
return `
/** TABLE: Role */
INSERT INTO myapp.role (recuid,name) VALUES
(1,'ADMIN'),
(2,'MANAGER'),
(3,'USER');

INSERT INTO myapp.user (recuid,username,password,name,email,created_at,updated_at) VALUES
(1,'admin','admin','Admin User','admin@admin.com',now(),now());

INSERT INTO myapp.user_role (user_id,role_id) VALUES (1,1);
`;
};
