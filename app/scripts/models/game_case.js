/*global define*/

define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  'use strict';

  var GameCase = Backbone.Model.extend({
    defaults: {
      'value':  '',
      'i':  '',
      'j':  '',
      'score': 1,
      'played': false,
      'last-played': false,
      'cssState': '',
      'previous_played_case_cid': ''
    },
    
    initialize: function () {
      _.bindAll(this, 'updateCssState');
      this.set({
        htmlId: 'case_' + this.cid
      });
      this.bind('change:last-played', this.updateCssState);
      this.bind('change:played', this.updateCssState);
    },
    
    updateCssState: function(){
      if (this.get('last-played') === true) {
        this.set({'cssState': 'last-played'});
      } else if (this.get('played') === true) {
        this.set({'cssState': 'played'});
      } else if (this.get('score') === 1) {
        this.set({'cssState': 'good'});
      } else {
        this.set({'cssState': 'bad'});
      }
      return this;
    }

  });

  return GameCase;
});
