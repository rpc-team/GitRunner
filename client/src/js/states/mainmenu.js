/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');

    var dude, baddie;
    var startButton, direction = 1;
    var serverLabel;

    o.preload = function() {
        console.log('MainMenu.preload');
    };

    o.create = function() {
        console.log('MainMenu.create');

        var serverVersion = this.game.cache.getJSON('server_version');

        dude = this.game.add.sprite(32, 32, 'dude');
        dude.animations.add('right', [1, 2, 3, 4], 10, true);

        baddie = this.game.add.sprite(128, 64, 'baddie');
        baddie.animations.add('left', [0, 1, 2], 10, true);
        baddie.scale.set(2, 2);

        // buttons
        startButton = this.game.add.button(this.game.world.centerX, 200, 'diamond', this.actionOnClick, this);
        startButton.anchor.set(0.5);

        // text
        serverLabel = this.game.add.text(8, settings.display.height - 16, getServerVersion(serverVersion), {fontSize: '24', fill: '#000' })
    };

    o.update = function() {
        console.log('MainMenu.update');
        dude.animations.play('right');
        baddie.animations.play('left');

        var curScale = startButton.scale;
        curScale.x += 0.02 * direction
        curScale.y += 0.02 * direction;
        if ( curScale.x >= 2 ) direction = -1
        if ( curScale.x <= 1 ) direction = 1;
        startButton.scale.set(curScale.x, curScale.y);
    };

    o.actionOnClick = function(e) {
        this.state.start('game');
    };

    function getServerVersion(o) {
        return 'Server version: ' + o.name + ' ' + o.version;
    }

    return o;
})();