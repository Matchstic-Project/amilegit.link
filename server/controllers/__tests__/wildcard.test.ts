import { Response, Request } from 'express';
import { handleWildcard } from '../wildcard';

import db from '../../helpers/db';

jest.mock('../../helpers/db');

const mockedGet = db.get as jest.Mock;

describe('Wildcard API', () => {
    const mockResponse: any = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockImplementation(() => mockResponse)
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Redirects to a valid expansion', async () => {
        const req: Partial<Request> = {
            originalUrl: '123',
            get: jest.fn().mockImplementation(() => {
                return 'https://test.com/';
            })
        };

        const expansion = 'https://amilegit.link';

        mockedGet.mockImplementation((_, cb: (error: any | null, result: any | null) => void) => {
            cb(null, {
                Item: {
                    expansion
                }
            });
        });

        await handleWildcard(req as Request, mockResponse as Response);
        expect(mockResponse.redirect).toHaveBeenCalledWith(expansion);
    });

    it('Returns 404 for missing expansion', async () => {
        const req: Partial<Request> = {
            originalUrl: '123',
            get: jest.fn().mockImplementation(() => {
                return 'https://test.com/';
            })
        };

        mockedGet.mockImplementation((_, cb: (error: any | null, result: any | null) => void) => {
            cb(null, {
                Item: null
            });
        });

        await handleWildcard(req as Request, mockResponse as Response);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });

    it('Returns 500 on DB error', async () => {
        const req: Partial<Request> = {
            originalUrl: '123',
            get: jest.fn().mockImplementation(() => {
                return 'https://test.com/';
            })
        };

        mockedGet.mockImplementation((_, cb: (error: any | null, result: any | null) => void) => {
            cb('error', null);
        });

        await handleWildcard(req as Request, mockResponse as Response);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });
})