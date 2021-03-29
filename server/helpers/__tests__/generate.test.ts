import generate from '../generate';

import { isWebUri } from 'valid-url';
import domains from '../../components/domains.json';

describe('URL generation', () => {

    it('Generates a valid URL', () => {
        const url = generate();
        expect(isWebUri('https://' + url)).toBeTruthy();
    });

    it('generated URL starts with one of the possible domains', () => {
        const url = generate();
        const parts = url.split('/');

        expect(domains.items.includes(parts[0])).toBeTruthy();
    });

    it('generated URL has at least 2 folders in heirarchy', () => {
        // Check 20 iterations
        for (let i = 0; i < 20; i++) {
            const url = generate();
            const parts = url.split('/');

            expect(parts.length >= 4).toBeTruthy();
        }
    });

});