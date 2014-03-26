/*global define*/

define([
  'underscore',
  'backbone',
  'models/game_case'
], function (_, Backbone, GameCase) {
  'use strict';

  var GameCaseCollection = Backbone.Collection.extend({
    model: GameCase,

    initialize: function () {
      this.bind('add', function(gameCase) {
        gameCase.gameCaseCollection = this;
      });
    },
    
    play: function(gameCase){
      this.game.play(gameCase);
    },
    
    getCase: function(i, j){
      if (i < 0 || i >= 10 || j < 0 || j >= 10) {
        //console.info("INFO : Out of bound : " + i + ", " + j);
        return undefined;
      } else {
        var foundCase = this.find(function(gameCase) {
          if (parseInt(gameCase.get('i'), 10) === i && parseInt(gameCase.get('j'), 10) === j) {
            return true;
          }
        });
        return foundCase;
      }
    },
    
    getLastPlayedCase: function() {
      var foundCase = this.find(function(gameCase) {
        if (gameCase.get('last-played') === true) {
          return true;
        }
      });
      return foundCase;
    },
    
    setLastPlayedCase: function(newLastGameCase) {
      if (newLastGameCase === undefined) {
        return undefined;
      }
      var last_played_case = this.getLastPlayedCase();
      if (last_played_case !== undefined) {
        newLastGameCase.set({'previous_played_case_cid': last_played_case.cid});
        last_played_case.set({'last-played': false, 'played': true});
      }
      newLastGameCase.set({'played': true, 'last-played': true});
      return newLastGameCase;
    }
  });

  return GameCaseCollection;
});
