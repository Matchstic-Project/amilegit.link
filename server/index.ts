import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import rateLimit from 'express-rate-limit';

import * as createController from './controllers/create';
import * as fragmentController from './controllers/wildcard';

import * as log from 'loglevel';

// Import environment variables
const {
    APP_LOGLEVEL
} = process.env;

// Initialise application
log.setLevel(APP_LOGLEVEL as log.LogLevelDesc);

const app = express();

// Disabled - this is setup on cloud provider
// for the running application
/*const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30
});
app.use(limiter);*/

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create', createController.create);
app.get('*', fragmentController.handleWildcard);

module.exports.handler = serverless(app);