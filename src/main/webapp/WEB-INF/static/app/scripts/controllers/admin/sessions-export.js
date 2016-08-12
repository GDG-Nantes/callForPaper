'use strict';

angular.module('CallForPaper')
	.controller('AdminSessionsExportCtrl', ['$scope', 'AdminSession', function($scope, AdminSession) {
		/**
		 * Get all sessions (talks)
		 * @param  {void}
		 * @return {[AdminSession]}
		 */
		AdminSession.query().$promise.then(function(sessionsTmp) {
			$scope.sessions = sessionsTmp;
		});
}]);

angular.module('CallForPaper')
	.controller('AdminSessionsExportJsonCtrl', ['$scope', 'AdminSession', function($scope, AdminSession) {
		/**
		 * Get all sessions (talks)
		 * @param  {void}
		 * @return {[AdminSession]}
		 */
		AdminSession.query().$promise.then(function(sessionsTmp) {
			$scope.sessions = _.map(sessionsTmp, function(session) {
				return session.toJSON();
			});
		});
}]);
