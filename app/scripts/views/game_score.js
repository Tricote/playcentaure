/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'jquery.tmpl'
], function ($, _, Backbone, JST) {
    'use strict';

    var GameScoreView = Backbone.View.extend({
      // template: JST['app/scripts/templates/game_score.ejs']
      el: "#game-score-board",
      gameGameScoreTemplate: $("#gameGameScoreTemplate").template(),
      initialize: function() {
        _.bindAll(this, "render");
      },
      
      render: function() {
        $(this.el).append($.tmpl(this.gameGameScoreTemplate, this.model.attributes));
      }
    });

    return GameScoreView;
});
