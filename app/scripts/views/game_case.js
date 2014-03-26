/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'jquery.tmpl'
], function ($, _, Backbone) {
  'use strict';

  var GameCaseView = Backbone.View.extend({
    // template: JST['app/scripts/templates/game_case.ejs']
    gameCaseTemplate: $('#gameCaseTemplate').template(),

    initialize: function() {
      _.bindAll(this, 'render', 'caseClic');
      this.model.on('change', this.render);
    },

    events: {
      'click .play': 'caseClic',
    },
    
    caseClic: function() {
      this.model.gameCaseCollection.play(this.model);
    },

    render: function() {
      var that = this;
      $(this.$el.selector).html($.tmpl(this.gameCaseTemplate, this.model.attributes));
      // somehow the click event is unbound so rebind it
      $(this.$el.selector).unbind('click', that.caseClic);
      $(this.$el.selector).bind('click', that.caseClic);
      return this;
    }
  });

  return GameCaseView;
});
