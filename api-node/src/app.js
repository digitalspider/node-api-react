const httpContext = require('express-cls-hooked');

// load environment variables
require('dotenv').config();
require('./libs/checkEnv').check();

// App initialisation
const express = require('express');
const common = require('./common');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const requestHandler = require('./middleware/request');
const corsHandler = require('./middleware/cors');
const routeNotFoundHandler = require('./middleware/RouteNotFound');
const removeSessionHandler = require('./middleware/removeSession');
const bodyParser = require('body-parser');
const articleRoutes = require('./routes/ArticleRoute');
const userRoutes = require('./routes/UserRoute');
const authenticationRoutes = require('./routes/AuthenticationRoute');
const roleRoutes = require('./routes/RoleRoute');
const downloadRoutes = require('./routes/DownloadRoute');
const secretRoutes = require('./routes/SecretRoute');
const file = require('./libs/file');

// app initialisation
const app = express();

// Define handler to remove requestId, once the response has been sent
app.use(removeSessionHandler);

// Middleware to enhance req/res objects
app.use(requestHandler);

// Middleware to resolve CORS
app.use(corsHandler);

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000})
);

// File upload middleware
app.use(file.getFileHandler().single('doc'));

// Authentication routes
app.use(common.api.versionPath + '/auth', authenticationRoutes);

// Business logic routes
// Public routes
app.use(common.api.versionPath + '/doc', downloadRoutes);

// Initialise middleware to use cls
app.use(httpContext.middleware);

// Private routes
app.use('/', auth);
app.use(common.api.versionPath + '/article', articleRoutes);
app.use(common.api.versionPath + '/role', roleRoutes);
app.use(common.api.versionPath + '/user', userRoutes);
app.use(common.api.versionPath + '/secret', secretRoutes);

app.use(routeNotFoundHandler); // Middleware to handle 404 (route not found)
app.use(errorHandler);

module.exports = app;
