/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');

    //var dude, baddie;
    var characterButtons = {};
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

        // text
        serverLabel = this.game.add.text(8, settings.display.height - 16, getServerVersion(serverVersion), {fontSize: '24', fill: '#000' });
    };

    function onSelectCharacter(charName) {
        settings.selectedCharacter = charName;
        o.actionOnClick();
    }

    o.update = function() {
    };

    o.actionOnClick = function(e) {
        this.state.start('game');
    };

    function getServerVersion(o) {
        return 'Server version: ' + o.name + ' ' + o.version;
    }

    return o;
})();