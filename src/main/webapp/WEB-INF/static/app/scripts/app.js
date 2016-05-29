'use strict';

angular.module('CallForPaper', [
    'ngCookies',
    'ngResource',
    'ngResourceRetries',
    'ngSanitize',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngTagsInput',
    'internationalPhoneNumber',
    'bs-has',
    'pascalprecht.translate',
    'k8LanguagePicker',
    'ngTable',
    'ui-notification',
    'customFilters',
    'ui.gravatar',
    'relativeDate',
    'matchMedia',
    'satellizer',
    'angular-jwt',
    'vcRecaptcha',
    'angular-loading-bar',
    'ngFx',
    'offClick',
    'konami',
    'ngFileUpload',
    'hc.marked',
    'mdPreview',
    'LocalStorageModule',
    'ngLodash',
    'cfp.hotkeys',
    'ngAria',
    'ngSanitize',
  ])
  .constant('Config', {
    'recaptcha': '6Lcn4gcTAAAAAPATfe-4XVAh8bI4CW7HUAAwbNvy',
    'googleClientId': '595606955444-hv8v62e1g0qtk5v2nrnn696m18tg1p12.apps.googleusercontent.com',
    'githubClientId': 'ebeee4b3339f42197096'
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .config(['$httpProvider', function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
    $httpProvider.interceptors.push('csrfInterceptor');
  }])
  .config(['$stateProvider', '$urlRouterProvider', 'AuthServiceProvider', 'AppConfigProvider', function($stateProvider, $urlRouterProvider, AuthServiceProvider, AppConfigProvider) {
    $urlRouterProvider
      .when('', '/dashboard')
      .when('/', '/dashboard')

    .when('/admin/sessions/', '/admin/sessions')

    .when('/admin', '/admin/sessions')
      .when('/admin/', '/admin/sessions')

    .when('/form', '/form/')

    .otherwise('/login');

    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/admin/admin.html',
            controller: 'AdminCtrl',
            resolve: {
              isAutorizedAdmin: AuthServiceProvider.$get().isAutorizedAdmin,
              isConfigured: AppConfigProvider.$get().isConfigured
            },
            '@admin': {
              templateUrl: 'views/admin/sessions.html',
              controller: 'AdminSessionsCtrl'
            }
          }
        },
      })
      // Config
      .state('admin.config', {
        url: '/config',
        templateUrl: 'views/admin/config.html',
        controller: 'AdminConfigCtrl'
      })
      // Session
      .state('admin.sessions', {
        url: '/sessions',
        templateUrl: 'views/admin/sessions.html',
        controller: 'AdminSessionsCtrl'
      })
      .state('admin.export_postit', {
        url: '/export/postit',
        templateUrl: 'views/admin/sessions-export.html',
        controller: 'AdminSessionsExportCtrl'
      })
      .state('admin.export_json', {
        url: '/export/json',
        templateUrl: 'views/admin/sessions-export-json.html',
        controller: 'AdminSessionsExportJsonCtrl'
      })
      .state('admin.session', {
        url: '/sessions/:id?tab',
        templateUrl: 'views/admin/session.html',
        controller: 'AdminSessionCtrl'
      })

    // App configuration
    .state('config', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/config/config.html',
            controller: 'ConfigCtrl'
          }
        }
      })
      .state('config.autorize', {
        url: '/config',
        templateUrl: 'views/config/autorize.html',
        controller: 'AutorizeCtrl',
        resolve: {
          isAutorizedAdmin: AuthServiceProvider.$get().isAutorizedConfig
        }
      })
      .state('config.about', {
        url: '/config/about',
        templateUrl: 'views/config/about.html'
      })
      .state('config.403', {
        templateUrl: 'views/config/403.html'
      })


    // Login Admin
    .state('loginAdmin', {
        url: '/admin/login',
        templateUrl: 'views/admin/login.html',
        controller: 'AdminLoginCtrl'
      })
      // Logout Admin
      .state('logoutAdmin', {
        url: '/admin/logout',
        templateUrl: 'views/admin/login.html',
        controller: 'AdminLogoutCtrl'
      })

    // Restricted
    .state('app', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl',
            resolve: {
              isConfigured: AppConfigProvider.$get().isConfigured
            }
          }
        },
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'views/restricted/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
          authenticated: AuthServiceProvider.$get().authenticated
        }
      })
      .state('app.profil', {
        url: '/profil',
        templateUrl: 'views/restricted/profil.html',
        controller: 'ProfilCtrl',
        resolve: {
          authenticated: AuthServiceProvider.$get().authenticated
        }
      })

    // Auth
    .state('app.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('app.verify', {
        url: '/verify?token&id',
        templateUrl: 'views/verify.html',
        controller: 'VerifyCtrl'
      })
      .state('app.logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('app.signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })


    // Form
    .state('app.form', {
      url: '/form/:id',
      views: {
        '': {
          templateUrl: 'views/restricted/form/form.html',
          controller: 'FormCtrl',
          resolve: {
            verified: AuthServiceProvider.$get().verified,
            isOpen: AppConfigProvider.$get().isOpen
          }
        },
        '@app.form': {
          templateUrl: 'views/restricted/form/step1.html',
          controller: 'Step1Ctrl'
        }
      },
    })

    .state('app.form.step2', {
        templateUrl: 'views/restricted/form/step2.html',
        controller: 'Step2Ctrl'
      })
      .state('app.form.step3', {
        templateUrl: 'views/restricted/form/step3.html',
        controller: 'Step3Ctrl'
      })
      .state('app.form.result', {
        templateUrl: 'views/restricted/form/result.html',
        controller: 'ResultCtrl'
      })

    .state('app.session', {
      url: '/sessions/:id?tab',
      templateUrl: 'views/restricted/session.html',
      controller: 'RestrictedSessionCtrl',
      resolve: {
        verified: AuthServiceProvider.$get().verified
      }
    })

    .state('403', {
      url: '/403',
      templateUrl: '403.html'
    })

    .state('404', {
      url: '/404',
      templateUrl: '404.html'
    });
  }])
  .config(['tagsInputConfigProvider', function(tagsInputConfigProvider) {
    tagsInputConfigProvider
      .setDefaults('tagsInput', {
        placeholder: '',
        minLength: 1,
        addOnEnter: true
      })
      .setDefaults('autoComplete', {
        debounceDelay: 200,
        loadOnDownArrow: true,
        loadOnEmpty: true
      })
  }])
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useCookieStorage();
  }])
  .config(['$authProvider', 'Config', function($authProvider, Config) {
    $authProvider.google({
      clientId: Config.googleClientId
    });

    $authProvider.github({
      clientId: Config.githubClientId
    });

    $authProvider.oauth2({
      name: 'spreadsheet',
      url: '/auth/spreadsheet',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      scope: ['https://www.googleapis.com/auth/drive.file', 'https://spreadsheets.google.com/feeds'],
      clientId: Config.googleClientId,
      scopeDelimiter: ' ',
      accessType: 'offline',
      approvalPrompt: 'force',
      requiredUrlParams: ['scope', 'access_type', 'approval_prompt'],
      optionalUrlParams: ['display'],
      display: 'popup',
      type: '2.0',
      popupOptions: {
        width: 580,
        height: 400
      }
    });

  }])
  .run(['AuthService', '$http', function(AuthService, $http) {
    AuthService.init();
    $http.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
    $http.defaults.xsrfCookieName = 'CSRF-TOKEN';
    $.material.init();
  }]);
