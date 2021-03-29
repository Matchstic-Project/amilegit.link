import AWS from 'aws-sdk';

export const EXPANSIONS_TABLE = process.env.EXPANSIONS_TABLE;
const STAGE = process.env.STAGE;

export default new AWS.DynamoDB.DocumentClient(STAGE === 'dev' ? {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
} : {});