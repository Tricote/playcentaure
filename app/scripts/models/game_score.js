/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var GameScore = Backbone.Model.extend({
      defaults: {
        "rank":  "",
        "user_facebook_image":  "",
        "score":  "",
        "moves": "",
        "duration": "",
        "user_name": "",
      },
    });

    return GameScore;
});
