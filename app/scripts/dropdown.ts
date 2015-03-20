module dropdown {

    // https://www.codementor.io/angularjs/tutorial/create-dropdown-control

    var TEMPLATE = '<div class="dropdown-container" ng-class="{ show: listVisible }">' +
        '    <div class="dropdown-display" ng-click="show();" ng-class="{ clicked: listVisible }">' +
        '        <span ng-if="!isPlaceholder">{{selected[property]}}</span>' +
        '        <span class="placeholder" ng-if="isPlaceholder">' +
        '            {{placeholder}}</span>' +
        '            <i class="angleDown">▼</i>' +
        '    </div>' +
        '    <div class="dropdown-list">' +
        '        <div>' +
        '            <div ng-repeat="item in list" ng-click="select(item)" ng-class="{ selected: isSelected(item) }">' +
        '                <span>{{property !== undefined ? item[property] : item}}</span>' +
        '                <i class="fa fa-check"></i>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    export function register(app: ng.IModule): void {

        app.run($rootScope=> {
            angular.element(document).on("click", e=> {
                $rootScope.$broadcast("documentClicked", angular.element(e.target));
            });
        })

        app.directive("dropdown", function ($rootScope) {
            return {
                restrict: "E",
                template: TEMPLATE,
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
                        if (scope.isPlaceholder) {
                            $rootScope.$broadcast('placeholderClicked');
                            return;
                        }
                        scope.listVisible = !scope.listVisible;
                    };

                    $rootScope.$on("documentClicked", function (inner, target) {
                        if (!$(target[0]).is(".dropdown-display.clicked") && $(target[0]).parents(".dropdown-display.clicked").length == 0)
                            scope.$apply(function () {
                                scope.listVisible = false;
                            });
                    });

                    scope.$watch("selected", function (value) {
                        scope.isPlaceholder = !scope.selected || scope.selected[scope.property] === undefined;
                    });
                }
            }
        });
    }
}