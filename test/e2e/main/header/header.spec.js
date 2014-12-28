
describe("Main View - Header", function () {

    var header = element(by.className('navbar'));

    it("should have a header", function () {
        expect(header.isPresent()).toBeTruthy();
    })

})