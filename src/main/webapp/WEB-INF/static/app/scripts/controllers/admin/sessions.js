'use strict';

angular.module('CallForPaper')
	.controller('AdminSessionsCtrl', ['SanitizeService', '$scope', 'AdminSession', '$filter', 'ngTableParams', '$q', 'Notification', 'screenSize', 'AdminStats', 'localStorageService', 'NextPreviousSessionService', function(SanitizeService, $scope, AdminSession, $filter, ngTableParams, $q, Notification, screenSize, AdminStats, localStorageService, NextPreviousSessionService) {
		var sessions = []
		$scope.sessions = [];
		$scope.sessionsAll = [];
		$scope.screenSize = screenSize;
		$scope.realDifficulty = [$filter('translate')('step2.beginner'), $filter('translate')('step2.confirmed'), $filter('translate')('step2.expert')];

		$scope.tabType = NextPreviousSessionService.getType();

		/**
		 * Get all sessions (talks)
		 * @param  {void}
		 * @return {[AdminSession]}
		 */
		AdminSession.query().$promise.then(function(sessionsTmp) {
			sessions = sessionsTmp.map(function(session) {
        SanitizeService.cleanSession(session);
				session.fullname = session.name + " " + session.firstname;
				session.keyDifficulty = (['beginner', 'confirmed', 'expert'])[session.difficulty - 1];
				return session;
			});

			AdminStats.meter().$promise.then(function(meterTmp) {
				$scope.stats = meterTmp;
			});

			$scope.sessionsAll = sessions;
			updateTable();
		});

		// Set labels
		$scope.difficulties = function(column) {
			var def = $q.defer();
			var difficulties = [{
				'id': '1',
				'title': $filter('translate')('step2.beginner')
			}, {
				'id': '2',
				'title': $filter('translate')('step2.confirmed')
			}, {
				'id': '3',
				'title': $filter('translate')('step2.expert')
			}];
			def.resolve(difficulties);
			return def;
		};

		// Set labels
		$scope.tracks = function(column) {
			var def = $q.defer();
			var difficulties = [{
				'id': 'web',
				'title': $filter('translate')('step2.tracks.web')
			}, {
				'id': 'discovery',
				'title': $filter('translate')('step2.tracks.discovery')
			}, {
				'id': 'mobile',
				'title': $filter('translate')('step2.tracks.mobile')
			}, {
				'id': 'cloud',
				'title': $filter('translate')('step2.tracks.cloud')
			}];
			def.resolve(difficulties);
			return def;
		};

		/**
		 * Order/Filter Data
		 * @return {void}
		 */
		var getData = function($defer, params, type) {
			// use build-in angular filter
			var orderedData = params.filter() ?
				$filter('filter')(sessions, params.filter()) : sessions;

			orderedData = $filter('filter')(orderedData, {
				'type': type
			});

			orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

			if(orderedData.length < (params.page()-1)*params.count()) { // page params too large
				params.$params.page = parseInt(orderedData.length / params.count(),10) + 1;
			}

			$scope.sessions = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

			params.total(orderedData.length); // set total for recalc pagination
			NextPreviousSessionService.setSessions(orderedData, type);
			if (localStorageService.isSupported) {
				localStorageService.set('tableParams', params.$params);
			}
			$defer.resolve($scope.sessions);
		}

		/**
		 * Initialize tables
		 * @return {void}
		 */
		var updateTable = function() {
			var tableParamsString = localStorageService.get('tableParams');
			var defaultParams = {
				count: 10,
				filter: {
					fullname: '', // initial filter
					description: '',
					difficulty: '',
					track: '',
					reviewed: ''
				},
				sorting: {
					added: 'desc'
				}
			};
			var initialParams;
			if (tableParamsString !== null && localStorageService.isSupported) {
				try {
					initialParams = angular.fromJson(tableParamsString);
				} catch (e) {
					initialParams = defaultParams;
				}
			} else {
				initialParams = defaultParams;
			}

      // 4th Tab table
      $scope.tableParamsQuickie = new ngTableParams(
        initialParams, {
          filterDelay: 0,
          total: sessions.length, // length of data
          getData: function($defer, params) {
            getData($defer, params, 'quickie');
          }
        });

			// 3rd Tab table
			$scope.tableParamsCodelab = new ngTableParams(
				initialParams, {
					filterDelay: 0,
					total: sessions.length, // length of data
					getData: function($defer, params) {
						getData($defer, params, 'codelab');
					}
				});

			// 2nd Tab table
			$scope.tableParamsConference = new ngTableParams(
				initialParams, {
					filterDelay: 0,
					total: sessions.length, // length of data
					getData: function($defer, params) {
						getData($defer, params, 'conference');
					}
				});

			// 1st Tab table
			$scope.tableParams = new ngTableParams(
				initialParams, {
					filterDelay: 0,
					total: sessions.length, // length of data
					getData: function($defer, params) {
						getData($defer, params, '');
					}
				});
			// Current visible Tab => 1st
			NextPreviousSessionService.setType('');
		}

		/**
		 * Set active Tab type
		 * @param {string} type => '', 'conference', 'codelab'
		 */
		$scope.setActiveTab = function(type) {
			NextPreviousSessionService.setType(type);
		}

		/**
		 * Filter tables according to checkbox state
		 * @return {void}
		 */
		$scope.handleNotReviewed = function() {
			if ($scope.notReviewed === true) {
				$scope.tableParams.filter()['reviewed'] = false;
			} else {
				$scope.tableParams.filter()['reviewed'] = '';
			}
		}
	}]);
