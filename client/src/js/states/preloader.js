/**
 * Created by petermares on 20/02/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};
    var _logo;

    o.preload = function() {
        console.log('Preloader.preload');

        this.load.image('logo', 'assets/logo.png');
    };

    o.create = function() {
        console.log('Preloader.create');
        _logo = this.game.add.sprite(this.scale.width/2, this.scale.height/2, 'logo');
        _logo.anchor.set(0.5);
    };

    o.update = function() {
        console.log('Preloader.update');
        _logo.angle += 0.4;
    };

    return o;
})();
