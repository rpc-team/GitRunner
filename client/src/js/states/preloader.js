/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};
    var _images = {
        logo: 'assets/logo.png',
        sky: 'assets/sky.png',
        diamond: 'assets/diamond.png',
        heart: 'assets/heart.png',
        obstacles: 'assets/rock.png'
    };
    var _spritesheets = {
        baddie: {
            file: 'assets/baddie.png',
            width: 32,
            height: 32
        },
        dude: {
            file: 'assets/criss.png',
            width: 48,
            height: 64
        }
    };
    var element;

    o.preload = function() {
        console.log('Preloader.preload');

        // load images
        for ( k in _images ) {
            this.load.image(k, _images[k]);
        }

        // load the sprite sheets
        for ( k in _spritesheets ) {
            this.load.spritesheet(k, _spritesheets[k].file, _spritesheets[k].width, _spritesheets[k].height);
        }

        this.game.load.json('server_version', 'http://' + settings.server.host + ':' + settings.server.port + '/version');
    };

    o.create = function() {
        console.log('Preloader.create');

        element = this.game.add.sprite(this.scale.width/2, this.scale.height/2, 'logo');
        element.anchor.set(0.5);

        this.state.start('game');
    };

    return o;
})();
