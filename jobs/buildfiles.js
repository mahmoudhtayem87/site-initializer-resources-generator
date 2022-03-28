/**
 * @author Jan Verweij 
 * @description 
 */
 const config = require('../config');
 var dir = './output';

 async function createFile(filedata, filename, dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}`, filedata, function (err) {
        if (err) return console.error(err);
    });
}

 async function start() {
    // .lfrbuild-releng-ignore
    createFile("",".lfrbuild-releng-ignore",dir);

    // create build.gradle
    data = `dependencies {
        compileOnly group: "com.liferay.portal", name: "release.portal.api"
    }`;
    createFile(data,"build.gradle",dir);

    // create bnd.bnd
    data = `Bundle-Name: YOUR Site Initializer
    Bundle-SymbolicName: com.liferay.site.initializer.your
    Bundle-Version: 1.0.0
    Liferay-Site-Initializer-Name: YOUR SITE INITIALIZER
    Provide-Capability: liferay.site.initializer
    Web-ContextPath: /your-site-initializer`;
    createFile(data,"bnd.bnd",dir);
}
module.exports = {
    start
}
