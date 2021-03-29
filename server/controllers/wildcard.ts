import { Response, Request, NextFunction } from "express";
import db, { EXPANSIONS_TABLE } from '../helpers/db';
import * as log from 'loglevel';

/**
 * Used to handle wildcard endpoints, which are either fragment expansions, or
 * a 404
 * @param req Request object
 * @param res Result object
 */
export const handleWildcard = async (req: Request, res: Response) => {
    // Lookup the URL we were called with
    const url = req.get('host') + req.originalUrl;

    const params = {
        TableName: EXPANSIONS_TABLE,
        Key: {
            url,
        }
    };

    db.get(params, (error, result) => {
        if (error) {
            log.error(error);
            res.sendStatus(500);
        } else if (result.Item) {
            const { expansion } = result.Item;
            res.redirect(expansion);
        } else {
            res.sendStatus(404);
        }
    });
};