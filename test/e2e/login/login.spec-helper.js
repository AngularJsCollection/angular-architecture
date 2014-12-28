var LoginHelper = (function LoginHelper(){

    function LoginHelper(){
        this.passwordInput = element(by.id('pass'));
        this.loginButton = element(by.id('login-button'));
    }

    LoginHelper.prototype.get = function () {
        browser.get('/');
    };

    LoginHelper.prototype.getTitle = function () {
        return browser.getTitle();
    }

    LoginHelper.prototype.doLogin = function () {
        this.loginButton.click();
    }

    LoginHelper.prototype.sendKeys = function (msg) {
        this.passwordInput.click();
        this.passwordInput.clear();
        this.passwordInput.sendKeys(msg);
    }
    return LoginHelper;
})();

module.exports = LoginHelper;
