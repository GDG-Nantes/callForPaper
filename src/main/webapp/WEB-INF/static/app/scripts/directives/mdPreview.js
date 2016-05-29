'use strict';

angular.module('mdPreview', [])
  .controller("mdPreviewCtrl", ['$scope', '$modal', function($scope, $modal) {
    $scope.previewModal = function() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'MdModalContent',
        controller: 'MdPreviewModalInstanceCtrl',
        resolve: {
          content: function() {
            return $scope.preview
          }
        }
      });
    }
  }])
  .directive('mdPreview', ['$modal', function($modal) {
    return {
      restrict: 'A',
      templateUrl: 'ComponentContent',
      controller: "mdPreviewCtrl",
      scope: {
        preview: '=mdPreview'
      },
    };
  }])
  .controller('MdPreviewModalInstanceCtrl', ['$scope', '$sanitize', '$modalInstance', 'content', function($scope, $sanitize, $modalInstance, content) {
    $scope.content = $sanitize(content).replace(/&#10;/g, '\n'); // workaround to keep line returns
    $scope.ok = function() {
      $modalInstance.close();
    };
  }])
  .run(["$templateCache", function($templateCache) {
    $templateCache.put('MdModalContent', "<div class=\"modal-header\"><h3 class=\"modal-title\">{{\'previewModal.title\' | translate}}<\/h3><\/div><div class=\"modal-body\"><div marked=\"content\"><\/div><div ng-if=\"content === ''\">{{\'previewModal.nothingToPreview\' | translate}}<\/div><\/div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">{{\'previewModal.confirm\' | translate}}<\/button><\/div>");
    $templateCache.put('ComponentContent', "<div class=\"pull-right\">" +
      "<span style=\"font-size:1.5em;margin-top:-0.3em;\" class=\"pull-left ion-social-markdown\"><\/span>" +
      "<span>&nbsp;{{\'previewModal.mdSupported\' | translate}}<\/span>" +
      "<\/div>" +
      "<div style=\"cursor: pointer;margin-right:10px\" class=\"pull-right\" ng-click=\"previewModal()\">" +
      "<span class=\"pull-left ion-monitor\"><\/span>" +
      "<span>&nbsp;{{\'previewModal.title\' | translate}}<\/span>" +
      "<\/div>"
    );
  }]);
