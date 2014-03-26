/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'jquery.tmpl': {
            deps: ['jquery']
        },
        'jquery.timers': {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'jquery.tmpl': 'vendor/jquery.tmpl',
        'jquery.timers': 'vendor/jquery.timers'
    }
});

require([
    'backbone',
    'models/game_case',
    'collections/game_case',
    'collections/game_score_board',
    'views/game',
    'models/game'
], function (Backbone, GameCase, GameCaseCollection, GameScoreBoard, GameView, Game) {
    // Backbone.history.start();

    // Create a Gamesapce of 100 cases
    var gameCaseCollection= new GameCaseCollection();
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        if (false) {
          gameCaseCollection.add(new GameCase({'value':'', 'i':i, 'j':j, 'score': -1}).updateCssState());
        } else {
          gameCaseCollection.add(new GameCase({'value':'', 'i':i, 'j':j, 'score': 1}).updateCssState());
        }
      }
    }
    
   var gameScoreBoard = new GameScoreBoard();
   window.gameview = new GameView({model: new Game(gameCaseCollection, gameScoreBoard)});
   window.gameview.render();

});
