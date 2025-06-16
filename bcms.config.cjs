/**
 * @type {import('@thebcms/cli/config').BCMSConfig}
 */
module.exports = {
    client: {
        orgId: process.env.BCMS_ORG_ID || '67c8c2075ab1d0bab17d105f',
        instanceId: process.env.BCMS_INSTANCE_ID || '6850583a73612ce0411c47e6',
        apiKey: {
            id: process.env.BCMS_API_KEY_ID || '68505be873612ce0411c47ec',
            secret: process.env.BCMS_API_KEY_SECRET || '1a98d640ce3e086adfe872174ca1592209c53fcc3e7bcff4e151069e5458781a',
        },
    },
};