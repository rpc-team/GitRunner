/**
 * Created by petermares on 20/02/2016.
 */
(function() {
    console.log("GitRunner booting!");
    var settings = require('../settings');


    //var states = {
    //    boot: require('./states/boot'),
    //    loader: require('./states/loader'),
    //    mainmenu: require('./states/mainmenu'),
    //    game: require('./states/game')
    //};

    var Game = new Phaser.Game(settings.display.width,
                               settings.display.height,
                               Phaser.AUTO,
                               ''
    );

    Game.state.add('boot', require('./states/boot'));
    Game.state.add('preloader', require('./states/preloader'));
    Game.state.add('mainmenu', require('./states/mainmenu'));
    Game.state.add('game', require('./states/game'));

    Game.state.start('boot');

})();

/*
 var rest = require('rest-js');

 var restApi = rest('https://api.github.com/', {
 crossDomain: true
 });

 restApi.get('repositories', {
 format: null
 }, function(error, data) {
 console.log(data);
 });
 */
