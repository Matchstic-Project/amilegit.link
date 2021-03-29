/**
 * Clears cloudfront cache for a given distribution ID
 */

const exec = require('child_process').exec;
const fetch = require('node-fetch');
require('dotenv').config()

const distributionID = process.env.CLOUDFRONT_DISTRIBUTION_ID;
const cloudflareAPIKey = process.env.CLOUDFLARE_API_KEY;
const cloudflareDomain = process.env.CLOUDFLARE_DOMAIN;

if (!distributionID) {
    console.error('Missing distribution ID');
    process.exit(1);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function promiseExec(input) {
    return new Promise((resolve) => {
        exec(input, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

async function clearCloudflare() {
    console.log('Clearing CloudFlare...');

    const zones = await (await fetch('https://api.cloudflare.com/client/v4/zones', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${cloudflareAPIKey}`,
            'Content-Type': 'application/json'
        }
    })).json();

    let zoneId = '';
    zones.result.forEach((zone) => {
        if (zoneId) return;

        if (zone.name === cloudflareDomain) {
            zoneId = zone.id;
        }
    });

    const purge = await (await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${cloudflareAPIKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'purge_everything': true
        })
    })).json();

    if (purge?.success) {
        console.log('Purged CloudFlare cache');
    } else {
        console.error(purge);
        process.exit(1);
    }
}

exec(`aws cloudfront create-invalidation --distribution-id ${distributionID} --paths \"/*\"`, async (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }

    const result = JSON.parse(stdout);
    const invalidationId = result.Invalidation.Id;

    console.log('Created invalidation with ID', invalidationId);
    console.log('Waiting for completion...');

    const checker = async () => {
        const { stdout: innerStdout, error: innerError } = await promiseExec(`aws cloudfront get-invalidation --distribution-id ${distributionID} --id ${invalidationId}`);

        if (innerError) {
            console.error(innerError.message);
            process.exit(1);
        }

        const update = JSON.parse(innerStdout);

        if (update.Invalidation.Status === 'Completed') {
            console.log('CloudFront invalidation completed');

            await clearCloudflare();

            process.exit(0);
        } else {
            await sleep(2000);
            await checker();
        }
    }

    await sleep(2000);
    await checker();
});