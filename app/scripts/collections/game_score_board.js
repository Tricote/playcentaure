/*global define*/

define([
    'underscore',
    'backbone',
    'models/game_score'
], function (_, Backbone, GameScore) {
    'use strict';

    var GameScoreBoard = Backbone.Collection.extend({
      model: GameScore,
      url: '/games.json',
    });

    return GameScoreBoard;
});
