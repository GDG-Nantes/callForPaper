'use strict';

angular.module('CallForPaper')
  .factory('SanitizeService', ['$sanitize', function($sanitize) {
    var sanitizeService = {};

    sanitizeService.cleanSession = function(session) {
      session.bio = $sanitize(session.bio);
      session.description = $sanitize(session.description);
      session.references = $sanitize(session.references);
      session.coSpeaker = $sanitize(session.coSpeaker);
    }

    sanitizeService.cleanSessions = function(sessions) {
      _.forEach(sessions, sanitizeService.cleanSession);
    }

    sanitizeService.cleanContact = function(contact) {
      contact.comment = $sanitize(contact.comment);
    }

    sanitizeService.cleanContacts = function(contacts) {
      _.forEach(contacts, sanitizeService.cleanContact);
    }

    return sanitizeService;
  }])
