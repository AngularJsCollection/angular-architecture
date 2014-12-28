describe("Main View - Sidebar", function () {

    browser.get('/');

    var sidebar = element(by.className('side-navigation'));

    var list = sidebar.all(by.className('ng-binding'));

    var output = ['stats', 'sendpush', 'location', 'event', 'user'];

    var detailView = element(by.css('div[ui-view]'));

    it("should show side bar", function () {
        expect(sidebar.isPresent()).toBe(true);
    })

    it("should change state and components should load something when side bar is clicked", function () {
        for(var i = 0; i < output.length; i++){
            list.get(i).click(); // Stats Button
            expect(browser.getCurrentUrl()).toContain(output[i]);
            var ucfirst = output[i].charAt(0).toUpperCase() + output[i].slice(1);
            expect(detailView.getText()).toBeTruthy();
        }
    })

    it("should change button color when the button is clicked ", function(){
        for(var i = 0; i < output.length; i++){
            list.get(i).click();
            expect(list.get(i).getCssValue('background-color')).toBe('rgba(51, 122, 183, 1)');
        }
    })

})