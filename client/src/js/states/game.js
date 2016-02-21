/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};
    var assetPath = 'assets/world' + Math.floor(1 + Math.random()*2) + '/';
    var _tiles = {
        tile_floor: assetPath + 'tl/tl1.png',
        tile_bkg: assetPath + 'bg/bg.png',
        tile_obstacle1: assetPath + 'ob/ob1.png',
        tile_obstacle2: assetPath + 'ob/ob2.png',
        tile_obstacle3: assetPath + 'ob/ob3.png',
        tile_obstacle4: assetPath + 'ob/ob4.png',
        tile_monster1: assetPath + 'mo/mo1.png',
        tile_monster2: assetPath + 'mo/mo2.png',
        tile_monster3: assetPath + 'mo/mo3.png',
        tile_monster4: assetPath + 'mo/mo4.png'
    };
    var player;
    var state = 'waiting';
    var platforms, nonCollisionGroup;
    var obstacles, monsters;
    var level;
    var numJumps = 0;
    var serverLabel, gameOverLabel;
    var deathEmitter, jumpEmitter;
    var scoreText;
    var cursors, spacebar;
    var music, jump, drop, drop_end, soundsEnabled = false;

    // temporary usage..
    var grayFilter;

    var next_position = {};

    o.preload = function() {
        console.log('Selected Character: ' + settings.selectedCharacter);

        this.game.stage.backgroundColor = '#000';

        // load images
        for (var k in _tiles) {
            if (_tiles.hasOwnProperty(k) ) {
                this.load.image(k, _tiles[k]);
            }
        }

        this.load.spritesheet('dude', 'assets/' + settings.selectedCharacter + '.png', 48, 64);

        this.game.load.json('level', 'http://' + settings.server.host + ':' + settings.server.port + '/player/' + settings.playerID + '/level');

        this.game.load.audio('guitar', 'assets/sounds/guitar.ogg');
        this.game.load.audio('jump', 'assets/sounds/jump.ogg');
        this.game.load.audio('drop', 'assets/sounds/drop.ogg');
        this.game.load.audio('drop_end', 'assets/sounds/drop_end.ogg');

        // temporary usage..
        this.game.load.script('gray', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Gray.js');
    };

    o.create = function() {
        cursors = this.game.input.keyboard.createCursorKeys();
        cursors.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        music = this.game.add.audio('guitar', 1, true);
        jump = this.game.add.audio('jump', 1);
        drop = this.game.add.audio('drop', 1);
        drop_end = this.game.add.audio('drop_end', 1);

        // temporary usage..
        grayFilter = this.game.add.filter('Gray');

        level = this.game.cache.getJSON('level');

        var imgData = new Image();
        imgData.src = level.avatar;
        this.game.cache.addImage('repo-avatar', level.avatar, imgData);

        var serverVersion = this.game.cache.getJSON('server_version');

        var sky = this.game.add.sprite(0, 0, 'tile_bkg');
        sky.width = settings.display.width;

        nonCollisionGroup = this.game.add.group();
        nonCollisionGroup.enableBody = true;

        platforms = this.game.add.group();
        platforms.enableBody = true;

        obstacles = this.game.add.group();
        obstacles.enableBody = true;

        monsters = this.game.add.group();
        monsters.enableBody = true;

        var ground, obstacle;
        var expected_position, min, max, rnd_position, empty_gaps = [];
        // level.gaps = 1500;
        level.monsters *= 10
        for ( var i = 1; i <= level.size; i++ ) {
            if (level.gaps) {
                expected_position = Math.floor(level.size / level.gaps);

                if(!next_position.gaps) next_position.gaps = expected_position;

                if(i/expected_position === Math.floor(i/expected_position) && next_position.gaps) {

                    if(i === next_position.gaps) {
                        min = next_position.gaps * 0.9;
                        max = next_position.gaps * 1.1;
                        rnd_position = Math.floor(Math.random() * (max - min) + min) * 64;

                        if(this.game.world.centerX < rnd_position) {
                            console.log('generating gap at position: ' + rnd_position);

                            empty_gaps.push(rnd_position / 64);
                        }

                        next_position.gaps = i + expected_position;
                    }
                }

                if((empty_gaps).indexOf(i) === -1) {
                    ground = platforms.create((i-1) * 64, this.game.world.height-64, 'tile_floor');
                    ground.body.immovable = true;
                    ground.scale.set(0.5, 0.5);
                    ground.body.friction.x = 0;
                } else {
                    continue;
                }
            }

            if(level.obstacles) {
                expected_position = Math.floor(level.size / level.obstacles);

                if(i/expected_position === Math.floor(i/expected_position) && next_position.obstacles) {
                    if(i === next_position.obstacles) {
                        min = next_position.obstacles * 0.9;
                        max = next_position.obstacles * 1.1;
                        rnd_position = Math.floor(Math.random() * (max - min) + min) * 64;

                        if(this.game.world.centerX < rnd_position) {
                            console.log('generating obstacle at position: ' + rnd_position);

                            obstacle = obstacles.create(rnd_position, this.game.world.height - 64, 'tile_obstacle' + Math.floor(1 + Math.random()*4));
                            obstacle.body.setSize(obstacle.width * 0.8, obstacle.height * 0.8, obstacle.width * 0.1, obstacle.height * 0.1);
                            obstacle.anchor.set(0, 1);
                            obstacle.body.immovable = true;
                        }
                    }

                    next_position.obstacles = i + expected_position;
                } else if(!next_position.obstacles) {
                    next_position.obstacles = expected_position;
                }
            }

            if(level.monsters) {
                expected_position = Math.floor(level.size / level.monsters);

                if(i/expected_position === Math.floor(i/expected_position) && next_position.monsters) {
                    if(i === next_position.monsters) {
                        min = next_position.monsters * 0.9;
                        max = next_position.monsters * 1.1;
                        rnd_position = Math.floor(Math.random() * (max - min) + min) * 64;

                        if(this.game.world.centerX < rnd_position) {
                            console.log('generating monster at position: ' + rnd_position);

                            monster = monsters.create(rnd_position, this.game.world.height - 64, 'tile_monster' + Math.floor(1 + Math.random()*4));
                            monster.body.setSize(monster.width * 0.8, monster.height * 0.8, monster.width * 0.1, monster.height * 0.1);
                            monster.anchor.set(0, 1);
                            monster.body.immovable = true;

                            this.game.add.tween(monster).to({ y: this.game.world.height - monster.height * 2 }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
                        }
                    }

                    next_position.monsters = i + expected_position;
                } else if (!next_position.monsters) {
                    next_position.monsters = expected_position;
                }
            }
        }

        // create the avatar image
        var signpost = nonCollisionGroup.create(64, this.game.world.height-64, 'signpost');
        signpost.anchor.set(0, 1);
        var avatar = nonCollisionGroup.create(signpost.x + 18, 245, 'repo-avatar');
        avatar.scale.set(1, 0.8);
        avatar.alpha = 0.7;

        // create the player
        player = this.game.add.sprite(256, 0, 'dude');
        this.game.physics.arcade.enable(player);
        player.body.bounce.y = 0;
        player.body.gravity.y = 350;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3, 4], 10, true);
        player.animations.add('jump', [5, 6], 10, true);
        player.animations.add('fall', [0], 10, true);
        player.health = 100;

        // text
        serverLabel = this.game.add.text(8, 8, getServerVersion(serverVersion), {fontSize: '24', fill: '#000' });
        gameOverLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game Over', {font: 'bold 96pt arial', fill: '#F00'});
        gameOverLabel.anchor.set(0.5);
        gameOverLabel.visible = false;
        scoreText = this.game.add.text(0, 0, returnCurrentScore(0), {
            font: '30px Arial',
            align: 'center',
            boundsAlignH: 'left',
            boundsAlignV: 'top'
        });
        scoreText.setTextBounds(50, 30, 150, 0);

        // emitters
        jumpEmitter = this.game.add.emitter(this.game.world.centerX, 0);
        jumpEmitter.makeParticles('star');
        jumpEmitter.gravity = 400;
        jumpEmitter.setAlpha(0, 1);
        jumpEmitter.setScale(0.5, 0.75, 0.5, 0.75);

        deathEmitter = this.game.add.emitter(this.game.world.centerX, 0, 100);
        deathEmitter.makeParticles('heart');
        deathEmitter.gravity = 300;

        startButton = this.game.add.button(this.game.world.width - 60, 30, 'diamond', playPauseSound, this);
    };

    o.update = function() {
        if (!music.isPlaying && soundsEnabled) {
            music.play();
            drop.play();
        }

        this.game.physics.arcade.collide(player, platforms);
        switch (state) {
            case 'waiting':
                if (player.body.touching.down) {
                    state = 'running';
                    if(soundsEnabled) drop_end.play();
                }
                break;

            case 'running':
                if ( !this.game.physics.arcade.collide(player, obstacles, onObstacleCollide) || !this.game.physics.arcade.collide(player, monsters, onObstacleCollide) ) {
                    this.run();
                }
                break;

            case 'dead':
                gameOverLabel.visible = true;
                var scale = player.scale;
                if ( scale.x > 0 ) {
                    scale.x -= 0.05;
                    scale.y -= 0.05;
                    player.scale = scale;
                }
                break;
        }
    };

    function onObstacleCollide(player, obstacle) {
        killPlayer();
    }

    o.run = function() {
        var isJumping = !player.body.touching.down;
        var runSpeed = 200;

        runSpeed += Math.abs(platforms.children[0].x) / 64;

        updateRunnerSpeedTo(runSpeed);

        if (player.body.bottom >= settings.display.height || player.body.touching.right) {
            // kill the player and end the game
            killPlayer();
        }

        scoreText.setText(returnCurrentScore(0-platforms.children[0].worldPosition.x / 64));

        if (cursors.up.isDown || cursors.spacebar.isDown) {
            // enable a single and double jump.
            // doubleJumps are only allowed on a certain part of the initial jump arc
            if ( player.body.velocity.y > -100 && numJumps < 2 ) {
                player.body.velocity.y = -275;
                if(soundsEnabled) jump.play();
                numJumps++;

                jumpEmitter.x = player.worldPosition.x + player.width/2;
                jumpEmitter.y = player.worldPosition.y + player.height/2;
                jumpEmitter.start(true, 1000, null, 15);
            }
        }
        if (cursors.down.isDown) {
            player.body.velocity.y = 800;
        }

        if (isJumping) {
            player.animations.play('jump');
        } else {
            player.animations.play('right');
            numJumps = 0;
        }
    };

    function playPauseSound() {
        if(music.isPlaying) {
            soundsEnabled = false;
            music.pause();
            startButton.filters = [grayFilter];
        } else {
            music.play();
            startButton.filters = null;
        }
    }

    function updateRunnerSpeedTo(speed) {
        speed = speed < 550 ? speed : 550;
        platforms.forEach(function(ground) {
            ground.body.velocity.x = -speed;
        }, this);

        obstacles.forEach(function(obstacle) {
            obstacle.body.velocity.x = -speed;
        }, this);

        monsters.forEach(function(monster) {
            monster.body.velocity.x = -speed;
        }, this);

        nonCollisionGroup.forEach(function(o) {
            o.body.velocity.x = -speed;
        }, this);
    }

    function killPlayer() {
        state = 'dead';
        updateRunnerSpeedTo(0);
        deathEmitter.x = player.worldPosition.x + player.width/2;
        deathEmitter.y = player.worldPosition.y + player.height/2;
        deathEmitter.start(true, 2000, null, 15);
    }

    function returnCurrentScore(score) {
        score = Math.round(score*100)/100;
        return 'Distance: ' + score + 'm';
    }

    function getServerVersion(o) {
        return 'Server version: ' + o.name + ' ' + o.version + ' | Health: ' + player.health;
    }

    return o;
})();