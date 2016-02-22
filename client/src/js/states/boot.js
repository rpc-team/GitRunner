/**
 * Created by petermares on 20/02/2016.
 *
 * This module is responsible for initialising the game system
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};

    o.preload = function() {
    };

    o.create = function() {

        // ensure that during scaling, the original proportions are maintained
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // set the background colour
        this.game.stage.backgroundColor = '#000';

        // start the physics system
        this.game.physics.startSystem(Phaser.Physics[settings.physicsEngine]);

        var playerId = localStorage.getItem('playerId');
        if(!playerId) {
            playerId = generateID();
            localStorage.setItem('playerId', playerId);
        }

        // generate the player ID
        settings.playerID = playerId;
        console.log("PlayerID = " + settings.playerID);

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        // lets move along!
        this.state.start('preloader');

    };

    function generateID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    return o;
})();