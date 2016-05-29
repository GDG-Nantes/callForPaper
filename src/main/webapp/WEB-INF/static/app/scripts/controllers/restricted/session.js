'use strict';

angular.module('CallForPaper')
	.controller('RestrictedSessionCtrl', ['$sanitize', 'SanitizeService', '$scope', '$stateParams', '$filter', 'RestrictedSession', 'CommonProfilImage', 'RestrictedContact', '$modal', 'Config', function($sanitize, SanitizeService, $scope, $stateParams, $filter, RestrictedSession, CommonProfilImage, RestrictedContact, $modal, Config) {
		$scope.tab = $stateParams.tab;

		$scope.session = null;
		/**
		 * Get talk
		 * @return {RestrictedSession}
		 */
		RestrictedSession.get({
			id: $stateParams.id
		}).$promise.then(function(sessionTmp) {
      SanitizeService.cleanSession(sessionTmp);
			$scope.session = sessionTmp;

			// Add link to social
			$scope.session.socialLinks = [];
			if (sessionTmp.social !== null) {
				var links = sessionTmp.social.split(',').map(function(value) {
					return $filter('createLinks')(value);
				})
				$scope.session.socialLinks = links;
			}
			if (sessionTmp.twitter !== null) $scope.session.twitter = $filter('createLinks')(sessionTmp.twitter);
			if (sessionTmp.googlePlus !== null) $scope.session.googlePlus = $filter('createLinks')(sessionTmp.googlePlus);
			if (sessionTmp.github !== null) $scope.session.github = $filter('createLinks')(sessionTmp.github);
			$scope.session.keyDifficulty = (['beginner', 'confirmed', 'expert'])[sessionTmp.difficulty - 1];

			// Get profil image
			CommonProfilImage.get({
				id: $scope.session.userId
			}).$promise.then(function(imgUriTmp) {
				$scope.session.profilImageUrl = imgUriTmp.uri;
			});
		});

		/**
		 * CONTACT
		 */

		/**
		 * get contacts of the session
		 * @return {[RestrictedContact]}
		 */
		var updateContacts = function() {
			RestrictedContact.getByRowId({
				rowId: $stateParams.id
			}, function(contactsTmp) {
				$scope.contacts = _.map(contactsTmp, function(contact) {
          contact.comment = $sanitize(contact.comment);
          return contact;
        });
			})
		}
		updateContacts();

		$scope.captchaShow = true;
		$scope.recaptchaId = Config.recaptcha;
		$scope.captcha = null;
	    $scope.setResponse = function(response) {
	      // send the `response` to your server for verification.
	      $scope.captcha = response;
	    };

		$scope.contactButtonDisabled = false;
		/**
		 * Post current contact in textarea
		 * @return {RestrictedContact} posted contact
		 */
		$scope.postContact = function() {
			$scope.contactButtonDisabled = true;
			RestrictedContact.save({
				'comment': $scope.contactMsg,
				'rowId': $stateParams.id,
				'captcha' : $scope.captcha
			}, function(c) {
				$scope.captchaShow = !$scope.captchaShow;
				$scope.contactMsg = "";
				$scope.contactButtonDisabled = false;
				updateContacts();
			}, function(c) {
				$scope.captchaShow = !$scope.captchaShow;
				$scope.contactButtonDisabled = false;
			});
		}

		/**
		 * PUT contact on server
		 * @return {RestrictedContact} edited contact
		 */
		var putContact = function(contact) {
			RestrictedContact.update({
				id: contact.id
			}, contact, function(c) {
				updateContacts();
			}, function(c) {});
		}

		/**
		 * Open modal for editing
		 * @param  {RestrictedContact} contact to edit
		 * @return {RestrictedContact} edited contact text
		 */
		$scope.editContact = function(localContact) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'views/admin/editModal.html',
				controller: 'EditModalInstanceCtrl',
				resolve: {
					comment: function() {
						return $sanitize(localContact.comment);
					}
				}
			});
			modalInstance.result.then(function(comment) {
				localContact.comment = $sanitize(comment);
				putContact(localContact);
			}, function() {
				// cancel
			});
		}

	}]);
