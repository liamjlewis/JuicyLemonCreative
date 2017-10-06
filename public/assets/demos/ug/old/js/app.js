var umberto = angular.module('umberto', [
  'ngRoute',
  'umbertoControllers'
]);

umberto.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/pull.html',
    controller: 'pullController'
  }).
  when('/congrats', {
    templateUrl: 'partials/congrats.html',
    controller: 'congratsController'
  }).
  otherwise({
    redirectTo: '/pull'
  });
}]);