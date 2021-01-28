'use strict';
module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'pipeline-watcher',
            script: 'server.js',
            env: {
                NODE_ENV: 'dev'
            },
            env_prod: {
                NODE_ENV: 'prod'
            },
            env_qa: {
                NODE_ENV: 'qa'
            },
        },
    ],
};
