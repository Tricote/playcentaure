/*global define*/

define([
    'underscore',
    'backbone',
    'jquery.timers'
], function (_, Backbone) {
    'use strict';

    var GameContext = Backbone.Model.extend({
      defaults: {
        "score": 0,
        "moves": 0,
        "timer": 0,
      },
    
      initialize: function () {
        var that = this;
        
        $("#game").everyTime(1000, function(i) {
          that.set({timer: that.get('timer') + 1});
          //that.change();
        });
      },
      
    });

    return GameContext;
});
