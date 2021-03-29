import { isWebUri } from 'valid-url';

/**
 * Used to validate a given URL that has been passed as an expansion target
 */
export const isUrl = (url: string) => {
    return isWebUri(url) !== undefined;
};

