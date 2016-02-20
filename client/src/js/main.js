/**
 * Created by petermares on 20/02/2016.
 */
(function() {
    console.log("GitRunner booting!");
    var settings = require('../settings');

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
