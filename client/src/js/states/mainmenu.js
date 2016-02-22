/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');

    //var dude, baddie;
    var characterButtons = {};
    var serverLabel, pickAndPlayLabel;

    o.preload = function() {
        console.log('MainMenu.preload');
    };

    o.create = function() {
        console.log('MainMenu.create');

        var serverVersion = this.game.cache.getJSON('server_version');

        this.game.add.sprite(0, 0, 'mainmenu_bkg');

        characterButtons.ricardo = this.game.add.button(25, this.game.world.centerY - 20, 'btn_ricardo', o.actionOnClick.bind(this,  { action: 'character', chosenCharacter: 'ricardo' }), this, 0, 1, 0);
        characterButtons.ricardo.scale.set(0.6, 0.6);

        var peterXStart = characterButtons.ricardo.position.x + (this.game.cache.getImage('btn_peter').width / 3) - 105 /* <- temporary value until asset gets fixed */ + 25;
        characterButtons.peter = this.game.add.button(peterXStart, this.game.world.centerY - 20, 'btn_peter', o.actionOnClick.bind(this,  { action: 'character', chosenCharacter: 'peter' }), this, 0, 1, 0);
        characterButtons.peter.scale.set(0.6, 0.6);

        var crissXStart = characterButtons.peter.position.x + (this.game.cache.getImage('btn_crissy').width / 3) - 105 /* < -temporary value until asset gets fixed */ + 25;
        characterButtons.criss = this.game.add.button(crissXStart, this.game.world.centerY - 20, 'btn_crissy', o.actionOnClick.bind(this, { action: 'character', chosenCharacter: 'criss' }), this, 0, 1, 0);
        characterButtons.criss.scale.set(0.6, 0.6);

        var helpButton = this.game.add.button(40, this.game.world.height - 100, 'btn_help', o.actionOnClick.bind(this, { action: 'help' }), this);
        helpButton.scale.set(0.2, 0.2);

        // text
        serverLabel = this.game.add.text(8, this.game.world.height - 26, getServerVersion(serverVersion), { font: '11px Arial', fill: '#000' });
        pickAndPlayLabel = this.game.add.text(40, this.game.world.centerY - 80, 'Pick and Play:', { font: '30px Arial', fill: '#000' });

        // TODO: Add a box around 'leaderboard'
        leaderboardLabel = this.game.add.text(this.game.world.centerX + 250, this.game.world.centerY - 80, 'Leaderboard:', { font: '30px Arial', fill: '#000' });

        var leadersList = ['Zeka', 'Teta', 'Xico', 'Fino', 'Bebado'];
        o.displayLeaderBoardValues(leadersList);
    };

    o.actionOnClick = function(opts) {
        if(opts.action === 'help') {
            o.displayHelp();
        } else if(opts.action === 'character') {
            settings.selectedCharacter = opts.chosenCharacter;
            this.state.start('game');
        }
    };

    o.displayLeaderBoardValues = function(leaders) {
        var prevText, startX, startY, spaceBetween = 40;

        startX = this.game.world.centerX + 250;
        startY = this.game.world.centerY - 10;

        for(var i = 1; i <= leaders.length; i++) {
            prevText = this.game.add.text(startX, startY, i + '. ' + leaders[i-1], { font: '22px Arial', fill: '#000' });
            startY = prevText.position.y + spaceBetween;
        }
    };

    o.displayHelp = function() {
        var helpGroup = this.game.add.group();

        helpGroup.create(this.game.world.centerX - 300, this.game.world.centerY - 200, 'help');

        var startX = this.game.world.centerX + 280 - (this.game.cache.getImage('btn_arrow').width / 2);
        var githubMetricsButton = this.game.add.button(startX, this.game.world.centerY + 150, 'btn_arrow', o.displayGitHubMetrics.bind(this), this);
        githubMetricsButton.scale.set(0.5, 0.5);
        helpGroup.add(githubMetricsButton);

        var closeButton = this.game.add.button(startX + ((this.game.cache.getImage('btn_close').width * 0.3) / 2), this.game.world.centerY - 185, 'btn_close', closeHelp, this);
        closeButton.scale.set(0.3, 0.3);
        helpGroup.add(closeButton);

        function closeHelp() {
            helpGroup.destroy();
        }
    };

    o.displayGitHubMetrics = function() {
        var githubGroup = this.game.add.group();

        githubGroup.create(this.game.world.centerX - 300, this.game.world.centerY - 200, 'github');

        var startX = this.game.world.centerX + 280;
        var githubMetricsButton = this.game.add.button(startX, this.game.world.centerY + 150, 'btn_arrow', backToHelp, this);
        githubMetricsButton.scale.set(-0.5, 0.5);
        githubGroup.add(githubMetricsButton);

        function backToHelp() {
            githubGroup.destroy();
        }
    }

    function getServerVersion(o) {
        return 'Server version: ' + o.name + ' ' + o.version;
    }

    return o;
})();