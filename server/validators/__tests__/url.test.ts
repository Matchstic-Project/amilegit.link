import { isUrl } from '../url';

describe('URL validator', () => {
    it('Returns true for valid url', () => {
        expect(isUrl('https://test.com')).toBeTruthy();
    });

    it('Returns false for non-http protocols', () => {
        expect(isUrl('ftp://test.com')).toBeFalsy();
    });

    it('Returns false for missing protocol', () => {
        expect(isUrl('test.com')).toBeFalsy();
    });

    it('Returns false for missing host', () => {
        expect(isUrl('https://')).toBeFalsy();
    });

    it('Returns false for missing input', () => {
        expect(isUrl('')).toBeFalsy();
        expect(isUrl(null)).toBeFalsy();
        expect(isUrl(undefined)).toBeFalsy();
    });
})