/** Regularly used constant definitions */
module.exports = {
  message: {
    types: {
      RECORD_NOT_FOUND:
        'Record not found.',
      OBJECT_NOT_FOUND:
        '{placeholder} not found.',
      CONFIG_NOT_FOUND:
        'Verify that the following config items are defined: {placeholder}',
      GET_ALL_RECORDS:
        'Records retrieved.',
      GET_RECORD:
        'Record retrieved.',
      POST_RECORD:
        'Record created.',
      PUT_RECORD:
        'Record updated.',
      DELETE_RECORD:
        'Record deleted.',
      ROUTE_NOT_FOUND:
        'Route not found.',
      LOGIN_USER:
        'Login successful',
      INTERNAL_ERROR:
        'Internal error.',
      VALIDATION_ERROR:
        'Validation Error.',
      INVALID_ARRAY_FIELD:
        'The data provided for the field {placeholder} is not valid.',
      FIELD_REQUIRED:
        'The field {placeholder} is required.',
      FIELD_ARRAY_REQUIRED:
        'The field {placeholder} requires at least one value.',
      FIELD_NUMERIC:
        'The field {placeholder} only accepts numeric values.',
      FIELD_ARRAY_NUMERIC:
        'The values in the field {placeholder} have got to be numbers.',
      FIELD_DECIMAL:
        'The field {placeholder} only accepts numeric values.',
      FIELD_ALPHANUMERIC_SPACES:
        'The field {placeholder} only accepts numbers, letters and spaces.',
      FIELD_ALPHANUMERIC_SYMBOLS:
        'The field {placeholder} only accepts numbers, letters, spaces and '
        + './|\!@#$%^&*()-_=+ characters.',
      FIELD_S3_KEY:
        'The field {placeholder} only accepts numbers, letters, spaces and '
        + '_.-()/ characters.',
      FIELD_ALPHANUMERIC:
        'The field {placeholder} only accepts numbers and letters.',
      FIELD_EMAIL:
        'The field {placeholder} is not a valid email.',
      FIELD_PHONENUMBER:
        'The field {placeholder} is not a valid phone number. Use only numbers '
        + 'and/or ()+- characters.',
      FIELD_DATE:
        'The field {placeholder} only accepts YYYY-MM-DD date formats '
        + '(i.e. 1970-12-01).',
      MIN_DATE:
        'The field {placeholder} should be after the field {placeholder}',
      FIELD_BOOLEAN:
        'The field {placeholder} only accepts values considered as booleans '
        + '(i.e. true, false, 1, 0)',
      FIELD_READONLY:
        'The field {placeholder} is readonly.',
      SEQUELIZE_ERROR:
        'Sequelize Error (DB related).',
      FILE_UNDEFINED:
        'File is not defined',
      FIELD_MINIMUN_LENGTH:
        'The field {placeholder} has got to have a least {placeholder} '
        + 'characters.',
      FIELD_MAXIMUM_LENGTH:
        'The field {placeholder} cannot be longer that {placeholder} '
        + 'characters.',
      USER_DISABLED:
        'The user is disabled.',
      REQUESTER_NOT_FOUND:
        'Requestor not found or not allowed.',
      INVALID_USER_PASSWORD:
        'Invalid user or password.',
      REQUEST_UNAUTHORIZED:
        'Request unauthorized.',
      REQUEST_NOT_ALLOWED:
        'Request not allowed.',
      TOKEN_INVALID:
        'The token provided is invalid or has expired.',
      TOKEN_NOT_PROVIDED:
        'token not provided.',
      API_PERMISSION_DENIED:
        'The user does not have permission to perform this action.',
      DATA_PERMISSION_DENIED:
        'The user does not have permission to access the data requested.',
      USER_SESSION_NOT_AVAILABLE:
        'Current user session no longer exists.',
      RECORD_NOT_FOUND_OR_PERMITTED:
        'Record not found or no longer available.',
      NO_RECORD_DELETED:
        'No record deleted.',
      INVALID_DELETE_USER_DENIED:
        'You are not permissed to delete this user.',
      INVALID_DELETE_SELF_DENIED:
        'You are not permissed to delete yourself.',
      INVALID_ENABLE_SELF_DENIED:
        'You are not permissed to enable yourself.',
      ATTACHMENT_MISSING: 'Item has no document attached',
      PARAMETER_REQUIRED:
        'The parameter {placeholder} is required.',
      NOTIFICATION_ERROR:
        'Notification failed to send',
      LOGOUT_FAILED:
        'Logout failed to execute',
      INVALID_NEW_FIELD:
      '{placeholder} already exists. Please try another {placeholder}',
    },
    replaceKey: '{placeholder}',
  },
  statusCode: {
    SUCCESS: 200,
    CREATED: 201,
    VALIDATION_ERROR: 400,
    INTERNAL_ERROR: 500,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NOT_ALLOWED: 403,
  },
  audit: {
    parentType: 'article',
    objectTypeDocument: 'document',
    AUDIT_TYPE_USER: 'USER',
    AUDIT_TYPE_ARTICLE: 'ARTICLE',
  },
  api: {
    path: '/api',
    versionPath: '/api/v1',
    verbs: {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE',
    },
  },
  // date and datetime details
  moment: {
    formats: {
      DATE_DB: 'YYYY-MM-DD',
      DATE_DISPLAY: 'DD/MM/YYYY',
      SEQUELIZE_DATE_DB: 'YYYY-MM-DD 00:00:00 +00:00',
      DATETIME_DB: 'YYYY-MM-DD hh:mm:ss',
      MILLISECOND_TIMESTAMP: 'x',
      DATETIME_FILE: 'YYYYMMDD_hhmmss',
    },
  },
  locale: {
    COUNTRY: 'Australia',
  },
  document: {
    signedURLFormat: '/api/v1/doc/download/{token}',
  },
  roles: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
  },
  ui: {
    urls: {
      ARTICLE_VIEW: '/article/:id',
      USER_VIEW: '/user/:id',
      ARTICLE_COMMENTS_VIEW: '/article/:id/comments',
      ARTICLE_DOCUMENTS_VIEW: '/article/:id/documents',
    },
  },
  email: {
    awsSecret: {
      prefix: 'email',
      host: 'email_host',
      port: 'email_port',
      user: 'email_user',
      password: 'email_password',
      secure: 'email_tls_enable',
    },
    template: {
      STATUS_UPDATE: {
        name: 'STATUS_UPDATE',
        subject: 'Status Change Notification',
      },
      NEW_COMMENT: {
        name: 'NEW_COMMENT',
        subject: '[ARTICLE] - New Comment Notification',
      },
      UPLOAD_FILE: {
        name: 'UPLOAD_FILE',
        subject: '[ARTICLE] - File Attachment Notification',
      },
    },
  },
  header: {
    USER_AGENT: 'user-agent',
    ERROR_ID: 'x-myapp-errorid',
    AUTHTOKEN: 'authtoken',
  },
};
