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

    o.preload = function() {
        console.log('Game.preload');

        this.game.stage.backgroundColor = '#000';

        // load images
        for (var k in _tiles) {
            this.load.image(k, _tiles[k]);
        }

        //this.game.load.json('level', 'http://' + settings.server.host + ':' + settings.server.port + '/player/' + settings.playerID + '/level');
        level = {
            size: 1024,
            gaps: 5
        }
    };

    o.create = function() {
        console.log('Game.create');

        //level = this.game.cache.getJSON('level');
        console.log(level);

        var sky = this.game.add.sprite(0, 0, 'sky');
        sky.width = settings.display.width;

        platforms = this.game.add.group();
        platforms.enableBody = true;
        var ground;
        for ( var i = 1; i <= level.size; i++ ) {
            if ( i == 4 || level.size % Math.floor(Math.random() * 100) == 0 ) {
                console.log('generating gap at position: ' + i);
                i += 2;
            } else {
                ground = platforms.create(i * 128, this.game.world.height-128, 'tile_grass');
                ground.body.immovable = true;
                ground.body.friction.x = 0;
            }
        }

        // create the player
        player = this.game.add.sprite(128, 0, 'dude');
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

        platforms.forEach(function(ground) {
            ground.body.velocity.x = -150;
        }, this);

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