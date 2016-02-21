/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');

    //var dude, baddie;
    var characterButtons = {};
    var startButton, direction = 1;
    var serverLabel;

    o.preload = function() {
        console.log('MainMenu.preload');
    };

    o.create = function() {
        console.log('MainMenu.create');

        var serverVersion = this.game.cache.getJSON('server_version');

        this.game.add.sprite(0, 0, 'mainmenu_bkg');

        characterButtons.ricardo = this.game.add.button(64, 64, 'btn_ricardo', onSelectCharacter.bind(null, 'ricardo'), this, 0, 1, 1);
        characterButtons.ricardo.frame = 1;
        characterButtons.peter = this.game.add.button(325, 64, 'btn_peter', onSelectCharacter.bind(null, 'peter'), this, 0, 1, 1);
        characterButtons.peter.frame = 1;
        characterButtons.criss = this.game.add.button(205, 296, 'btn_crissy', onSelectCharacter.bind(null, 'criss'), this, 0, 1, 1);
        characterButtons.criss.frame = 1;

        //// buttons
        //startButton = this.game.add.button(this.game.world.centerX+200, 200, 'diamond', this.actionOnClick, this);
        //startButton.anchor.set(0.5);

        // text
        serverLabel = this.game.add.text(8, settings.display.height - 16, getServerVersion(serverVersion), {fontSize: '24', fill: '#000' })
    };

    function onSelectCharacter(charName) {
        settings.selectedCharacter = charName;
        o.actionOnClick();
    }

    o.update = function() {
        //var curScale = startButton.scale;
        //curScale.x += 0.02 * direction
        //curScale.y += 0.02 * direction;
        //if ( curScale.x >= 2 ) direction = -1
        //if ( curScale.x <= 1 ) direction = 1;
        //startButton.scale.set(curScale.x, curScale.y);
    };

    o.actionOnClick = function(e) {
        this.state.start('game');
    };

    function getServerVersion(o) {
        return 'Server version: ' + o.name + ' ' + o.version;
    }

    return o;
})();