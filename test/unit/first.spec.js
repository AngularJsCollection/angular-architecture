
describe("hello", function () {
    var scope;
    var controller;
    beforeEach(module('dashboard'));

    beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope;
        controller = $controller('MainCtrl', {$scope : scope});
    }))

    describe('dashboard to exist', function () {
        it('should have dashboard', function () {
            expect(controller).toBeDefined();
            expect(controller).not.toBeNull();
            expect(controller).toBeTruthy();
        });
    })

    describe('side bar to exist', function(){
        it("should have side bar data", function(){
            expect(scope.sideMenu).toBeDefined();
            expect(scope.sideMenu.length).toBe(5);
            scope.sideMenu.forEach(function (e) {
                expect(e.state).toBeDefined();
                expect(e.label).toBeDefined();
                expect(e.icon).toBeDefined();
            })
        })
    })
})