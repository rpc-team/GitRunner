/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};
    var _tiles = {
        tile_grass: 'assets/grass_128x128.png',
        tile_sky: 'assets/sky.png'
    };
    var player;
    var state = 'waiting';
    var platforms;
    var level;

    var rest = require('rest-js');

    o.fetchLevelData = function() {
        // fetch the level data for the player
        var restApi = rest('http://' + settings.server.host + ':' + settings.server.port + '/', {
            crossDomain: true,
            defaultParams: null
        });

        console.log('fetching level data');
        restApi.get('player/' + settings.playerID + '/level', {
            format: null,
            crossDomain:true
        }, function(error, data) {
            console.log('Got Level DAta');
            level = JSON.parse(data.message);
        });

    };

    o.preload = function() {
        console.log('Game.preload');

        this.game.stage.backgroundColor = '#000';

        // load images
        for (var k in _tiles) {
            this.load.image(k, _tiles[k]);
        }

        this.game.load.json('level', 'http://' + settings.server.host + ':' + settings.server.port + '/player/' + settings.playerID + '/level');
    };

    o.create = function() {
        console.log('Game.create');

        level = this.game.cache.getJSON('level');
        console.log(level);

        var sky = this.game.add.sprite(0, 0, 'sky');
        sky.width = settings.display.width;

        platforms = this.game.add.group();
        platforms.enableBody = true;
        var ground;
        for ( var i = 1; i <= level.size; i++ ) {
            if ( i == 4 || level.size % Math.floor(Math.random() * 100) == 0 ) {
                console.log('generating gap at position: ' + i);
                i += 5;
            } else {
                ground = platforms.create(i * 64, this.game.world.height-(64*(1+Math.random()*1)), 'tile_grass');
                ground.body.immovable = true;
            }
        }

        // create the player
        player = this.game.add.sprite(32, 0, 'dude');
        this.game.physics.arcade.enable(player);
        player.body.bounce.y = 0;
        player.body.gravity.y = 350;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3, 4], 10, true);
        player.animations.add('jump', [5, 6], 10, true);
        player.animations.add('fall', [0], 10, true);

        this.game.camera.follow(player);
    };

    o.update = function() {
        this.game.physics.arcade.collide(player, platforms);
        switch ( state ) {
            case    'waiting':
                if ( player.body.touching.down ) {
                    state = 'running';
                }
                break;

            case    'running':
                this.run();
                break;
        }
    };

    o.run = function() {
        var cursors = this.game.input.keyboard.createCursorKeys();
        var isJumping = !player.body.touching.down;
        //var isFalling = isJumping && player.body.velocity.y > 0;

        platforms.x -= 5;
        //player.x += 5;

        if ( cursors.up.isDown) {
            player.body.velocity.y = -350;
        }
        if ( cursors.down.isDown) {
            player.body.velocity.y = 800;
        }

        if ( isJumping ) {
            player.animations.play('jump');
        } else {
            player.animations.play('right');
        }
    };

    return o;
})();