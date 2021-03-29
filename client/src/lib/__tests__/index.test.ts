import API from '../index';

const mockCreate = jest.fn();

jest.mock('@/lib/network', () => {
    return jest.fn().mockImplementation(() => ({
        create: mockCreate
    }));
});

describe('Request creation at the server', () => {
    const expansion = 'https://amilegit.link';

    beforeEach(() => {
        mockCreate.mockReset()
    });

    it('Successful creation', async () => {
        mockCreate.mockImplementation(async (expansion: string) => {
            return {
                value: {
                    fragment: '1234abcd',
                    expansion
                },
                status: 201
            };
        });

        const api = new API();
        const result = await api.createEntry(expansion);

        expect(result).toBeTruthy();
        expect(result.expansion).toEqual(expansion);
    });

    it('Failed creation', async () => {
        const status = 400;
        mockCreate.mockImplementation(async (expansion: string) => {
            return {
                value: null,
                status: status
            };
        });

        const api = new API();
        await expect(api.createEntry('')).rejects.toEqual(status);
    });
});