import * as assert from 'assert';

process.on('uncaughtException', (err) => {
    console.error(err.message);

    if (err instanceof assert.AssertionError) {
        process.exit(0);
    }

    console.error(err.stack);
    process.exit(1);
});

import * as server from './server';
server.start();
