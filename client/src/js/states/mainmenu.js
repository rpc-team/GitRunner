/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');
    var _spritesheets = {
        baddie: {
            file: 'assets/baddie.png',
            width: 32,
            height: 32
        },
        dude: {
            file: 'assets/dude.png',
            width: 85,
            height: 128
        }
    };

    var dude, baddie;
    var startButton, direction = 1

    o.preload = function() {
        console.log('MainMenu.preload');

        // load the sprite sheets
        for ( k in _spritesheets ) {
            this.load.spritesheet(k, _spritesheets[k].file, _spritesheets[k].width, _spritesheets[k].height);
        }
    };

    o.create = function() {
        console.log('MainMenu.create');

        console.log(this.scale.height);
        //dude = this.game.add.sprite(32, settings.display.height-96, 'dude');
        dude = this.game.add.sprite(32, 32, 'dude');
        dude.animations.add('right', [5, 6, 7, 8], 10, true);

        baddie = this.game.add.sprite(128, settings.display.height-64, 'baddie');
        baddie.animations.add('left', [0, 1, 2], 10, true);
        baddie.scale.set(2, 2);

        // buttons
        startButton = this.game.add.button(this.game.world.centerX, 200, 'diamond', this.actionOnClick, this);
        startButton.anchor.set(0.5);
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
    }

    return o;
})();