/*global define*/

define([
  'underscore',
  'backbone',
  'models/game_context'
], function (_, Backbone, GameContext) {
  'use strict';

  var Game = Backbone.Model.extend({
    initialize: function (gameCaseCollection, gameScoreBoard) {
      var that = this;
      this.gameCaseCollection = gameCaseCollection;
      this.gameCaseCollection.game = that;
      this.gameContext = new GameContext();
      this.gameScoreBoard = gameScoreBoard;
      this.set({'state': 'started'}, {silent: true});
    },

    play: function(gameCase){

      if (this.isMoveAuthorized(this.gameCaseCollection.getLastPlayedCase(), gameCase)) {

        // Update score and moves according to the value of the current played case
        this.gameContext.set({score: this.gameContext.get('score') + gameCase.get('score'),
                              moves: this.gameContext.get('moves') + 1
                             });

        // Set laset played case as the previous played case of the current played case
        // and last played case will be no more so update its state to 'played only'
        // Updated current played case : is now last played case
        // and update its state and value
        var new_last_played_case = this.gameCaseCollection.setLastPlayedCase(gameCase);
        new_last_played_case.set({'value': this.gameContext.get('score')});

        if (this.isGameOver(gameCase)) {
          console.info('INFO : GAME OVER!');
          this.save();
          this.set('state', 'gameOver');
        }

      } else {
        console.info('INFO : invalide play!');
      }

    },

    isMoveAuthorized: function(fromCase, toCase){
      // impossible to choose a already played case
      if (toCase === undefined) {
        return false;
      }

      if (fromCase === undefined) {
        return true;
      }

      if (toCase.get('played') === true) {
        return false;
      }


      var horizontal1 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i'), 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') + 3, 10);
      var horizontal2 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i'), 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') - 3, 10);
      var vertical1 = parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j'), 10) && parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') + 3, 10);
      var vertical2 = parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j'), 10) && parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') - 3, 10);
      var diag1 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') + 2, 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') + 2, 10);
      var diag2 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') + 2, 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') - 2, 10);
      var diag3 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') - 2, 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') + 2, 10);
      var diag4 = parseInt(toCase.get('i'), 10) === parseInt(fromCase.get('i') - 2, 10) && parseInt(toCase.get('j'), 10) === parseInt(fromCase.get('j') - 2, 10);


      if (horizontal1 || horizontal2 || vertical1 || vertical2 || diag1 || diag2 || diag3 || diag4) {
        return true;
      } else {
        return false;
      }
    },

    isGameOver: function(gameCase){
      var i = parseInt(gameCase.get('i'), 10);
      var j = parseInt(gameCase.get('j'), 10);

      if (this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i, j+3)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i, j-3)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i+3, j)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i-3, j)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i+2, j-2)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i+2, j+2)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i-2, j-2)) === false
            && this.isMoveAuthorized(gameCase, this.gameCaseCollection.getCase(i-2, j+2)) === false ) {
        return true;
      } else {
        return false;
      }
    },

    undo: function(){
      if (this.gameContext.last_played_case !== undefined) {

        // Update score and moves according to the value of the last played case
        //this.gameContext.score -= this.gameContext.last_played_case.get('score');
        this.gameContext.set({score: this.gameContext.get('score') - this.gameCaseCollection.getLastPlayedCase().get('score')});
        this.gameContext.set({moves: this.gameContext.get('moves') + 1});
        this.gameContext.change();

        // Updated last played case  : is now the previous played case
        // Update its state to not played
        this.gameCaseCollection.getLastPlayedCase().set({'last-played': false, 'played': false, 'value': ''});
        var previous_played_case_cid = this.gameCaseCollection.getLastPlayedCase().get('previous_played_case_cid');

        // If there is a previous one
        //if (previous_played_case_cid !== '') {
        this.gameCaseCollection.setLastPlayedCase(this.gameCaseCollection.getByCid(previous_played_case_cid));
        //} else {
          // If there was no previous one...
          //this.gameContext.last_played_case = undefined;
        //}

      }
    },

    save: function(){
      var that = this;

      $.ajax  ({
        type: 'POST',
        url: '/games.json',
        dataType: 'json',
        data: {
          game: {
            score: that.gameContext.get('score'),
            moves: that.gameContext.get('moves'),
            duration: that.gameContext.get('timer'),
            cases: that.gameCaseCollection.models.map(function(c) {
              return {
                i: c.get('i'),
                j: c.get('j'),
                value: c.get('value')
              };
            })
          }
        },
        success: function(){

        },
        error: function(){

        }
      });
    },

    restart: function(){
      this.gameContext.set({'score': 0, 'moves': 0, 'timer': 0});
      this.gameCaseCollection.setLastPlayedCase(undefined);
      this.gameCaseCollection.each(function(gameCase){
        gameCase.set({'value': '', 'last-played': false, 'played': false, 'previous_played_case_cid': ''});
      });
      this.set({'state': 'started'});
      //this.gameScoreBoard.fetch();
    }
  });

  return Game;
});
