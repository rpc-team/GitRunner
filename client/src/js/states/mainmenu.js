/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var o = {};
    var settings = require('../../settings');

    //var dude, baddie;
    var characterButtons = {};
    var serverLabel, pickAndPlayLabel;
    var sndClick;

    o.preload = function() {
        console.log('MainMenu.preload');

        this.game.load.json('leaderboard', 'http://' + settings.server.host + ':' + settings.server.port + '/leaderboard/' + settings.playerID);
    };

    o.create = function() {
        console.log('MainMenu.create');

        var serverVersion = this.game.cache.getJSON('server_version');

        sndClick = this.game.add.audio('click');

        this.game.add.sprite(0, 0, 'mainmenu_bkg');

        var btnScale = 0.6;
        characterButtons.ricardo = this.game.add.button(25, this.game.world.centerY - 60, 'btn_ricardo', o.actionOnClick.bind(this,  { action: 'character', chosenCharacter: 'ricardo' }), this, 0, 1, 0);
        characterButtons.ricardo.scale.set(btnScale, btnScale);

        var peterXStart = characterButtons.ricardo.position.x + (this.game.cache.getImage('btn_peter').width / 3) + 25;
        characterButtons.peter = this.game.add.button(peterXStart, this.game.world.centerY - 60, 'btn_peter', o.actionOnClick.bind(this,  { action: 'character', chosenCharacter: 'peter' }), this, 0, 1, 0);
        characterButtons.peter.scale.set(btnScale, btnScale);

        var crissXStart = characterButtons.peter.position.x + (this.game.cache.getImage('btn_crissy').width / 3) + 25;
        characterButtons.criss = this.game.add.button(crissXStart, this.game.world.centerY - 60, 'btn_crissy', o.actionOnClick.bind(this, { action: 'character', chosenCharacter: 'criss' }), this, 0, 1, 0);
        characterButtons.criss.scale.set(btnScale, btnScale);

        var helpButton = this.game.add.button(40, this.game.world.height - 100, 'btn_help', o.actionOnClick.bind(this, { action: 'help' }), this);
        helpButton.scale.set(0.5, 0.5);

        // text
        serverLabel = this.game.add.text(8, this.game.world.height - 26, getServerVersion(serverVersion), { font: '11px Arial', fill: '#fff' });
        pickAndPlayLabel = this.game.add.text(40, this.game.world.centerY - 110, 'Pick and Play:', { font: '30px Arial', fill: '#fff' });

        // TODO: Add a box around 'leaderboard'
        leadersList = this.game.cache.getJSON('leaderboard');
        leaderboardLabel = this.game.add.text(this.game.world.centerX + 100, 190, 'Leaderboard:', { font: '30px Arial', fill: '#fff' });

        o.displayLeaderBoardValues(leadersList);
    };

    o.actionOnClick = function(opts) {
        sndClick.play();
        if(opts.action === 'help') {
            o.displayHelp();
        } else if(opts.action === 'character') {
            settings.selectedCharacter = opts.chosenCharacter;
            this.state.start('game');
        }
    };

    o.displayLeaderBoardValues = function(obj) {
        var prevText, startX, startY, spaceBetween = 40;

        startX = this.game.world.centerX + 100;
        startY = 200 + 40;

        for(var i = 1; i <= obj.leaderboard.length; i++) {
            prevText = this.game.add.text(startX, startY, i + '. ' + obj.leaderboard[i-1].nickname.substr(0, 15), { font: '22px Arial', fill: '#fff' });
            this.game.add.text(startX + 230, startY, ' (' + obj.leaderboard[i-1].score + ')', { font: '22px Arial', fill: '#fff' });
            startY = prevText.position.y + spaceBetween;
        }

        this.game.add.text(startX, startY + 20, obj.player.position + '. You', { font: '22px Arial', fill: '#fff' });
        this.game.add.text(startX + 230, startY + 20, ' (' +  obj.player.score + ')', { font: '22px Arial', fill: '#fff' })
    };

    o.displayHelp = function() {
        var helpGroup = this.game.add.group();

        helpGroup.create(this.game.world.centerX - 300, this.game.world.centerY - 200, 'help');

        var startX = this.game.world.centerX + 260 - (this.game.cache.getImage('btn_arrow').width / 2);
        var githubMetricsButton = this.game.add.button(startX, this.game.world.centerY + 150, 'btn_arrow', o.displayGitHubMetrics.bind(this), this);
        githubMetricsButton.scale.set(-1, 1);
        helpGroup.add(githubMetricsButton);

        var closeButton = this.game.add.button(startX + ((this.game.cache.getImage('btn_close').width * 0.3) / 2), this.game.world.centerY - 185, 'btn_close', closeHelp, this);
        //closeButton.scale.set(0.3, 0.3);
        helpGroup.add(closeButton);

        function closeHelp() {
            helpGroup.destroy();
        }
    };

    o.displayGitHubMetrics = function() {
        var githubGroup = this.game.add.group();

        githubGroup.create(this.game.world.centerX - 300, this.game.world.centerY - 200, 'github');

        var startX = this.game.world.centerX + 260 - (this.game.cache.getImage('btn_arrow').width / 2);
        var githubMetricsButton = this.game.add.button(startX, this.game.world.centerY + 150, 'btn_arrow', backToHelp, this);
        //githubMetricsButton.scale.set(-0.5, 0.5);
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