import { Response, Request } from 'express';
import * as urlValidator from '../validators/url';
import db, { EXPANSIONS_TABLE } from '../helpers/db';
import * as log from 'loglevel';
import generate from '../helpers/generate';

/**
 * Handles the /create endpoint.
 *
 * Expected input is a JSON object of the form:
 * {
 *     expansion: string;
 * }
 *
 * where `expansion` is the URL to create a shortened link for
 * @param req Request object
 * @param res Result object
 */
export const create = async (req: Request, res: Response) => {
    if (!req.body || req.body === {}) {
        res.sendStatus(400);
        return;
    }

    const { expansion } = req.body;

    if (!expansion || expansion.length === 0) {
        res.sendStatus(400);
        return;
    }

    // Validate the URL
    const expansionIsURI = urlValidator.isUrl(expansion);
    if (!expansionIsURI) {
        res.sendStatus(400);
        return;
    }

    let attempts = 0;
    const finish = async () => {
        // Generate randomised URL
        const url = generate();

        // Insert into DynamoDB
        const params = {
            TableName: EXPANSIONS_TABLE,
            Item: {
                url,
                expansion
            }
        };

        db.put(params, (error: any) => {
            if (error) {
                if (attempts < 3) {
                    attempts++;
                    finish();
                } else {
                    log.error(error);
                    res.sendStatus(500);
                }
            } else {
                res.status(201).send({ url: 'https://' + url, expansion });
            }
        });
    };

    finish();
};