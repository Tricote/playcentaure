/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'views/game_case_collection',
  'views/game_context',
  'views/game_score_board',
  'bootstrap'
], function ($, _, Backbone, GameCaseCollectionView, GameContextView, GameScoreBoardView) {
  'use strict';

  var GameView = Backbone.View.extend({
    // template: JST['app/scripts/templates/game.ejs']
    el: '#game-controls',
    gameControlsTemplate: $('#gameControlsTemplate').template(),
    gameOverModalTemplate: $('#gameGameOverModalTemplate').template(),
    
    initialize: function() {
      _.bindAll(this, 'render', 'undoClick', 'renderGameOver', 'closeModal', 'share');
      this.gameCaseCollectionView = new GameCaseCollectionView({collection: this.model.gameCaseCollection});
      this.gameContextView = new GameContextView({model: this.model.gameContext});
      // this.gameScoreBoardView = new GameScoreBoardView({collection: this.model.gameScoreBoard});
      
      this.model.on('change:state', this.renderGameOver);
    },
    
    events: {
      'click #undo': 'undoClick',
      'click #save': 'renderGameOver',
      'click #restart': 'restartClick',
      'click #game-over-save': 'saveClick',
      'click #close-game-over': 'closeModal',
      'click #game-over-share': 'share'
    },
    
    undoClick: function() {
      this.model.undo();
    },
    
    saveClick: function() {
      console.info('INFO : Saving game');
      this.model.save();
    },
    
    share: function() {
      var that = this;
      this.model.restart();
      $.ajax({
        type: 'POST',
        url: '/shares/',
        dataType: 'json',
        data: {msg: 'test message'},
        success: function(){
          that.closeModal();
        },
        error: function(){
          //alert('erreur');
          that.closeModal();
        }
      });
      
    },

    closeModal: function() {
      this.model.restart();
      var that = this;
      $('#game').everyTime(1000, function() {
        that.model.gameContext.set({'timer': that.model.gameContext.get('timer') + 1});
        //that.change();
      });
      $('#gameOverModal').modal('hide');
      $('#gameOverModal').remove();
    },
    
    restartClick: function() {
      this.model.restart();
      var that = this;
      $('#game').stopTime();
      $('#game').everyTime(1000, function() {
        that.model.gameContext.set({'timer': that.model.gameContext.get('timer') + 1});
        //that.change();
      });
    },
    
    render: function() {
      $(this.el).append($.tmpl(this.gameControlsTemplate, this.model));
      this.gameContextView.render();
      this.gameCaseCollectionView.render();
      //this.gameScoreBoardView.render();
    },
    
    renderGameOver: function() {
      if (true) {// (this.model.get('state') === 'gameOver') {
        $('#game').stopTime();
        $(this.el).append($.tmpl(this.gameOverModalTemplate, this.model.gameContext.attributes));
        $('#gameOverModal').modal('show');
      }
    }
  });

  return GameView;
});
