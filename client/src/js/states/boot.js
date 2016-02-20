/**
 * Created by petermares on 20/02/2016.
 *
 * This module is responsible for initialising the game system
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};

    o.preload = function() {
        console.log('Boot.preload');
    };

    o.create = function() {
        console.log('Boot.create');

        // ensure that during scaling, the original proportions are maintained
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // set the background colour
        this.game.stage.backgroundColor = '#FFDDAA';

        // start the physics system
        this.game.physics.startSystem(Phaser.Physics[settings.physicsEngine]);

        // lets move along!
        this.state.start('preloader');

        // generate the player ID
        settings.playerID = Math.floor(1 + Math.random() * 10);
        console.log("PlayerID = " + settings.playerID);
    };

    return o;
})();