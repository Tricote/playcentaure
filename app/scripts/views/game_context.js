/*global define*/

define([
  'jquery',
  'underscore',
  'backbone',
  'jquery.tmpl'
], function ($, _, Backbone) {
  'use strict';

  var GameContextView = Backbone.View.extend({
    // template: JST['app/scripts/templates/game_context.ejs']
    el: '#game-context',
    gameContextTemplate: $('#gameContextTemplate').template(),
    
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
    },
    
    render: function() {
      $(this.el).html($.tmpl(this.gameContextTemplate, this.model.attributes));
    }
  });

  return GameContextView;
});
