// https://www.npmjs.com/package/wbm

const wbm = require('wbm');

wbm.start().then(async () => {
    const phones = ['56935559806'];
    const message = 'Hello there!';
    await wbm.send(phones, message);
    await wbm.end();
}).catch(err => console.log(err));