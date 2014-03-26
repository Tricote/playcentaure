/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/game_case'
], function ($, _, Backbone, JST, GameCaseView) {
    'use strict';

    var GameCaseCollectionView = Backbone.View.extend({
      // template: JST['app/scripts/templates/game_case_collection.ejs']
      el: "#game-table",
      tableTemplate: $("#tableTemplate").template(),
      
      initialize : function() {
        var that = this;
        this._gameCaseViews = [];
        this._table = [];
        
        this.collection.each(function(gameCase) {
          var gc_view = new GameCaseView({
            model : gameCase,
          });
          gc_view.setElement("#case_" + gameCase.get('i') + "_" + gameCase.get('j'))
          that._gameCaseViews.push(gc_view);
        });
      },
     
      render : function() {
        var that = this;
        // Clear out this element.
        $(this.el).empty();
        
        // Render a table that match the number of GameCase
        var max_i = this.collection.max(function (gamecase) {
          return gamecase.get('i');
        }).get('i');
        var max_j = this.collection.max(function (gamecase) {
          return gamecase.get('j');
        }).get('j');
        
        this.table = [];
        for (var i = 0; i <= max_i; i++) {
          var row = [];
          for (var j = 0; j <= max_j; j++) {
            row.push({i: i, j: j});
          }
          this.table.push({row: row});
        }
        
         
        // Render each sub-view and append it to the parent view's element.
        
        $(this.el).html($.tmpl(this.tableTemplate, this.table));
        _(this._gameCaseViews).each(function(gameCaseView) {
          $(that.el).append(gameCaseView.render().el);
        });
      }
    });

    return GameCaseCollectionView;
});
