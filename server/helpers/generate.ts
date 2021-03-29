import { v4 } from 'uuid';
import toplevel from '../components/toplevel.json';
import filenameAny from '../components/filename-any.json';
import filenameEnds from '../components/filename-ends.json';
import filenameSuffixes from '../components/filename-suffixes.json';
import joins from '../components/joins.json';
import domains from '../components/domains.json';

// https://stackoverflow.com/a/3943985
function shuffle(string: string) {
    const a = string.split(''), n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateToplevel(depth: number, uuid: string): { result: string, used: number } {
    const sliceLength = 8 + getRandomInt(6);
    const slice = uuid.slice(0, 8 + getRandomInt(6));

    if (depth === 0) {
        const useCustom = getRandomInt(4) > 0;

        if (useCustom) {
            return {
                result: toplevel.items[getRandomInt(toplevel.items.length)] + '/' + slice,
                used: sliceLength
            };
        }
    }

    return {
        result: slice,
        used: sliceLength
    };
}

function generatePrefix(): string {
    const main = filenameAny.items[getRandomInt(filenameAny.items.length)];
    return main + joins.items[getRandomInt(joins.items.length)];
}

/**
 * Generate a random URL
 */
const generate = () => {
    const uuid = v4().split('-').join('');

    // Create top level folder naming
    const toplevelFolderCount = getRandomInt(2) + 1;
    const toplevelFolders = [];

    let uuidUsed = 0;
    for (let i = 0; i < toplevelFolderCount; i++) {
        const { result, used } = generateToplevel(i, shuffle(uuid));

        toplevelFolders.push(result + '/');
        uuidUsed += used;
    }

    if (uuidUsed < 24) {
        const remaining = 24 - uuidUsed;
        toplevelFolders.push(shuffle(uuid).slice(0, remaining + 1) + '/');
    }

    // Create file prefixes
    const prefixCount = getRandomInt(3);
    const prefixes = [];

    for (let i = 0; i < prefixCount; i++) {
        prefixes.push(generatePrefix());
    }

    const filename = filenameEnds.items[getRandomInt(filenameEnds.items.length)];

    const suffixCount = getRandomInt(3);
    const suffixes: string[] = [];

    while (suffixes.length < suffixCount) {
        const suffix = filenameSuffixes.items[getRandomInt(filenameSuffixes.items.length)];

        if (!filename.includes(suffix) && !suffixes.includes(suffix)) {
            suffixes.push(suffix);
        }
    }

    // Create path
    let path = '';
    toplevelFolders.forEach((item: string) => path += item);
    prefixes.forEach((item: string) => path += item);

    path += filename;

    suffixes.forEach((item: string) => path += item);

    // Figure out domain to use
    return domains.items[getRandomInt(domains.items.length)] + '/' + path;
};

export default generate;