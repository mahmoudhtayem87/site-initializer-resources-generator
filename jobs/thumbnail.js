const Pageres = require('pageres');
const config = require('../config');

var dir = './output/META-INF/resources/images';




async function start() {
    var url = config.config().liferay.host + "/web" + config.config().friendlyUrlPath;
    console.log('url: ' + url);

    (async () => {
        await new Pageres({delay: 2})
            .src(url, ['454x452'], {crop: true, filename: 'thumbnail'})
            .dest(dir)
            .run();
    
        console.log('Finished generating screenshots!');
    })();
}
module.exports = {
    start
}
