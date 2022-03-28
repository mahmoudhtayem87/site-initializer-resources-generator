/**
 * @author Jan Verweij 
 * @description 
 */
 const config = require('../config');
 const helper = require('../helper');
 var dir = './output';

 async function start() {
    // .lfrbuild-releng-ignore
    helper.createFile("",dir,".lfrbuild-releng-ignore");

    // create build.gradle
    data = `dependencies {
        compileOnly group: "com.liferay.portal", name: "release.portal.api"
    }`;
    helper.createFile(data,dir,"build.gradle");

    // create bnd.bnd
    data = `Bundle-Name: YOUR Site Initializer
    Bundle-SymbolicName: com.liferay.site.initializer.your
    Bundle-Version: 1.0.0
    Liferay-Site-Initializer-Name: YOUR SITE INITIALIZER
    Provide-Capability: liferay.site.initializer
    Web-ContextPath: /your-site-initializer`;
    helper.createFile(data,dir,"bnd.bnd");
}
module.exports = {
    start
}
