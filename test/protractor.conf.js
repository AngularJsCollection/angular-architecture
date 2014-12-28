exports.config = {
    specs : [
        'e2e/login/login.spec.js',
        'e2e/**/*.spec.js'
    ],
    baseUrl : 'http://localhost',
    capabilities : {
        browserName : 'chrome'
    },
    allScriptsTimeout: 30000
}