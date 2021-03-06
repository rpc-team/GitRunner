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
        star: 'assets/star.png',
        signpost: 'assets/avatar.png',
        mainmenu_bkg: 'assets/mm_bg.png',
        home_button: 'assets/home.png',
        volumeOn: 'assets/volume_on.png',
        volumeOff: 'assets/volume_off.png'
    };
    var _spritesheets = {
        baddie: {
            file: 'assets/baddie.png',
            width: 32,
            height: 32
        },
        dude: {
            file: 'assets/peter.png',
            width: 48,
            height: 64
        },
        btn_peter: {
            file: 'assets/mm_c2.png',
            width: 201,
            height: 229
        },
        btn_crissy: {
            file: 'assets/mm_c3.png',
            width: 201,
            height: 229
        },
        btn_ricardo: {
            file: 'assets/mm_c1.png',
            width: 201,
            height: 229
        },
        btn_help: {
            file: 'assets/info.png',
            width: 128,
            height: 128
        },
        btn_arrow: {
            file: 'assets/next.png',
            width: 64,
            height: 64
        },
        btn_close: {
            file: 'assets/close.png',
            width: 64,
            height: 64
        },
        help: {
            file: 'assets/how_to_play.png',
            width: 600,
            height: 400
        },
        github: {
            file: 'assets/what_is.png',
            width: 600,
            height: 400
        }
    };
    var element;

    o.preload = function() {
        console.log('Preloader.preload');

        // load images
        var k;
        for ( k in _images ) {
            this.load.image(k, _images[k]);
        }

        // load the sprite sheets
        for ( k in _spritesheets ) {
            this.load.spritesheet(k, _spritesheets[k].file, _spritesheets[k].width, _spritesheets[k].height);
        }

        this.game.load.audio('guitar', 'assets/sounds/guitar.ogg');
        this.game.load.audio('jump', 'assets/sounds/jump.ogg');
        this.game.load.audio('drop', 'assets/sounds/drop.ogg');
        this.game.load.audio('drop_end', 'assets/sounds/drop_end.ogg');
        this.game.load.audio('click', 'assets/sounds/click.ogg');
        this.game.load.audio('die', 'assets/sounds/die.ogg');
        this.game.load.audio('down', 'assets/sounds/down.ogg');
        this.game.load.audio('kill_monster', 'assets/sounds/kill_monster.ogg');

        this.game.load.json('server_version', 'http://' + settings.server.host + ':' + settings.server.port + '/version');
    };

    o.create = function() {
        console.log('Preloader.create');

        element = this.game.add.sprite(this.scale.width/2, this.scale.height/2, 'logo');
        element.anchor.set(0.5);

        this.state.start('mainmenu');
    };

    return o;
})();
