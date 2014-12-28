
var LoginHelper = require('./login.spec-helper.js');

describe("hello-protractor", function () {

    browser.get('/#');

    var login = new LoginHelper();

    describe("Login Function", function () {

        it("password input should exist", function () {
            expect(element(by.id('pass')).isPresent()).toBe(true);
        })

        it("should come back to the same page if password is empty or wrong", function () {
            login.sendKeys('');
            login.doLogin();
            expect(login.getTitle()).toBe('Login');

            login.sendKeys('asdfasdf');
            login.doLogin();
            expect(login.getTitle()).toBe('Login');

        })

        it("should login correctly", function(){
            login.sendKeys('password');
            login.doLogin();
            expect(login.getTitle()).toBe('Admin Portal');
        })

        it("should stay logged in if the admin is logged in", function(){
            browser.refresh(3);
            expect(login.getTitle()).toBe('Admin Portal');
        })

    })
})