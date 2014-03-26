/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'views/game_score'
], function ($, _, Backbone, GameScoreView) {
  'use strict';

  var GameScoreBoardView = Backbone.View.extend({
    // template: JST['app/scripts/templates/game_score_board.ejs']
    el: '#game-score-board',
    gameScoreBoardViewTemplate: $('#gameScoreBoardViewTemplate').template(),
    
    initialize: function() {
      var that = this;
      _.bindAll(this, 'render');
      
      this.collection.bind('reset', that.render);
    },
    
    
    render: function() {
      var that = this;
      this._gameScoreViews = [];
      this.collection.each(function(gameScore) {
        var gs_view = new GameScoreView({
          model : gameScore,
        });
        that._gameScoreViews.push(gs_view);
      });
      
      $(that.el).empty();
      $(that.el).html($.tmpl(this.gameScoreBoardViewTemplate));
      
      _(that._gameScoreViews).each(function(gameScoreView) {
        $(that.el).append(gameScoreView.render());
      });
    }
  });

  return GameScoreBoardView;
});
