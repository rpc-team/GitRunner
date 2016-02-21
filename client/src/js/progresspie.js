/**
 * Created by petermares on 21/02/2016.
 */

module.exports = PieProgress;

function PieProgress(game, x, y, radius, color, angle, weight) {
    this._radius = radius;
    this._progress = 1;
    this._weight = weight || 0.25;
    this._color = color || "#fff";
    this.bmp = game.add.bitmapData((this._radius * 2) + (this._weight * (this._radius * 0.6)), (this._radius * 2) + (this._weight * (this._radius * 0.6)));
    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.anchor.set(0.5);
    this.angle = angle || -90;
    this.updateProgress();
}

PieProgress.prototype = Object.create(Phaser.Sprite.prototype);
PieProgress.prototype.constructor = PieProgress;

PieProgress.prototype.updateProgress = function() {
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);

    this.bmp.clear();
    this.bmp.ctx.strokeStyle = this.color;
    this.bmp.ctx.lineWidth = this._weight * this._radius;
    this.bmp.ctx.beginPath();
    this.bmp.ctx.arc(this.bmp.width * 0.5, this.bmp.height * 0.5, this._radius - 15, 0, (Math.PI * 2) * progress, false);
    this.bmp.ctx.stroke();
    this.bmp.dirty = true;
};

PieProgress.prototype.updateBmdSize = function() {
    this.bmp.resize((this._radius * 2) + (this._weight * (this._radius * 0.75)), (this._radius * 2) + (this._weight * (this._radius * 0.75)));
};

Object.defineProperty(PieProgress.prototype, 'color', {
    get: function() {
        return this._color;
    },
    set: function(val) {
        this._color = val;
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(val) {
        this._radius = (val > 0 ? val : 0);
        this.updateBmdSize();
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'progress', {
    get: function() {
        return this._progress;
    },
    set: function(val) {
        this._progress = Phaser.Math.clamp(val, 0, 1);
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'weight', {
    get: function() {
        return this._weight;
    },
    set: function(val) {
        this._weight = Phaser.Math.clamp(val, 0.01, 0.99);
        this.updateBmdSize();
        this.updateProgress();
    }
});