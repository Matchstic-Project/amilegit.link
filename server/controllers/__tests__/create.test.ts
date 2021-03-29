import { Response, Request } from 'express';
import { create } from '../create';

import db from '../../helpers/db';
import generate from '../../helpers/generate';

jest.mock('../../helpers/db');
jest.mock('../../helpers/generate');

const mockedPut = db.put as jest.Mock;
const mockedGenerate = generate as jest.Mock;

describe('Create API', () => {
    const mockResponse: any = {
        send: jest.fn(),
        sendStatus: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockImplementation(() => mockResponse)
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

	it('returns 400 for missing input', () => {
        const req: Partial<Request> = {};

        create(req as Request, mockResponse as Response);
        expect(mockResponse.sendStatus).toBeCalledWith(400);
    });

    it('returns 400 for bad input (from isUrl validator)', () => {
        const req: Partial<Request> = {
            body: {
                expansion: 'amilegit.link'
            }
        };

        create(req as Request, mockResponse as Response);
        expect(mockResponse.sendStatus).toBeCalledWith(400);
    });

    it('returns 500 for DB error', async () => {
        const req: Partial<Request> = {
            body: {
                expansion: 'https://amilegit.link'
            }
        };

        mockedPut.mockImplementation((_, cb: (error?: any) => void) => {
            cb('error');
        });

        await create(req as Request, mockResponse as Response);
        expect(mockResponse.sendStatus).toBeCalledWith(500);
    });

    it('returns 201 on success', async () => {
        const req: Partial<Request> = {
            body: {
                expansion: 'https://amilegit.link'
            }
        };

        mockedPut.mockImplementation((_, cb: (error?: any) => void) => {
            cb();
        });

        await create(req as Request, mockResponse as Response)
        expect(mockResponse.status).toBeCalledWith(201);
	});

	it('returns stored data on success', async () => {
        const urlExpected = 'test.com/1234abcd';
        const expansionExpected = 'https://amilegit.link';

        mockedGenerate.mockImplementation(() => {
            return urlExpected;
        });

        const req: Partial<Request> = {
            body: {
                expansion: 'https://amilegit.link'
            }
        };

        mockedPut.mockImplementation((_, cb: (error?: any) => void) => {
            cb();
        });

        await create(req as Request, mockResponse as Response);
        expect(mockResponse.send).toBeCalledWith({
            expansion: expansionExpected,
            url: 'https://' + urlExpected,
        });
	});
});