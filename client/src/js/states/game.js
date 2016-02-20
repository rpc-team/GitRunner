/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var _tiles = {
        tile_grass: 'assets/grass_128x128.png'
    };
    var platforms;
    var player;
    var state = 'waiting';
    var platforms;

    o.preload = function() {
        console.log('Game.preload');

        this.game.stage.backgroundColor = '#000';

        // load images
        for ( k in _tiles ) {
            this.load.image(k, _tiles[k]);
        }
    };

    o.create = function() {
        console.log('Game.create');

        platforms = this.game.add.group();

        // create the platforms group and ground
        platforms.enableBody = true;
        var ground;
        for ( var i = 0; i < 5; i++ ) {
            //if ( Math.floor(Math.random() * 10) % 2 == 0 ) {
                ground = platforms.create(i * 128, this.game.world.height-128, 'tile_grass');
                ground.body.immovable = true;
            //}
        }

        // create the player
        player = this.game.add.sprite(32, this.game.world.height-128 - 200, 'dude');
        this.game.physics.arcade.enable(player);
        player.body.bounce.y = 0.1;
        player.body.gravity.y = 150;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [5, 6, 7, 8], 10, true);

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
        //console.log(state);
    };

    o.run = function() {
        var cursors = this.game.input.keyboard.createCursorKeys();

        player.animations.play('right');

        platforms.x -= 5;

        // TODO: This is behaving strangely. group's width is updated, but its x remains the same?
        // TODO: Investigate if this has anything to do with the hash collection.
        var block = platforms.children[0], lastChild;
        lastChild = platforms.children[platforms.children.length-1];
        if ( block.worldPosition.x < -128 ) {
            block = platforms.create(lastChild.worldPosition.x + 128, this.game.world.height-256, 'tile_grass');
            block.body.immovable = true;

            platforms.removeChildAt(0);


        }

        if ( cursors.up.isDown) {
            player.body.velocity.y = -150;
        }
    }

    return o;
})();