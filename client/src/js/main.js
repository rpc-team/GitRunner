/**
 * Created by petermares on 20/02/2016.
 */
(function() {
    console.log("GitRunner booting!");
    var Controller = require('./controller');
    var display = {
        width: 1024,
        height: 768
    };

    var Game = new Phaser.Game(display.width, display.height, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    Controller.start();

    function preload() {

    }

    function create() {

    }

    function update() {

    }

})();