module dropdown {

    // https://www.codementor.io/angularjs/tutorial/create-dropdown-control

    export function register(app: ng.IModule): void {

        app.run($rootScope=> {
            angular.element(document).on("click", e=> {
                $rootScope.$broadcast("documentClicked", angular.element(e.target));
            });
        })

        app.directive("dropdown", function ($rootScope) {
            return {
                restrict: "E",
                templateUrl: "partials/dropdown.html",
                scope: {
                    placeholder: "@",
                    list: "=",
                    selected: "=",
                    property: "@"
                },
                link: function (scope: any) {
                    scope.listVisible = false;
                    scope.isPlaceholder = true;

                    scope.select = function (item) {
                        scope.isPlaceholder = false;
                        scope.selected = item;
                    };

                    scope.isSelected = function (item) {
                        return item[scope.property] === scope.selected[scope.property];
                    };

                    scope.show = function () {
                        if (scope.selected && scope.selected.isPlaceholder) {
                            $rootScope.$broadcast('placeholderClicked');
                            return;
                        }
                        scope.listVisible = !scope.listVisible;
                    };

                    $rootScope.$on("documentClicked", function (inner, target) {
                        //console.log($(target[0]).is(".dropdown-display.clicked") || $(target[0]).parents(".dropdown-display.clicked").length > 0);
                        if (!$(target[0]).is(".dropdown-display.clicked") && $(target[0]).parents(".dropdown-display.clicked").length == 0)
                            scope.$apply(function () {
                                scope.listVisible = false;
                            });
                    });

                    scope.$watch("selected", function (value) {
                        scope.isPlaceholder = scope.selected[scope.property] === undefined;
                        scope.display = scope.selected[scope.property];
                    });
                }
            }
        });
    }
}