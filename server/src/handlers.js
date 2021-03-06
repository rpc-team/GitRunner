var https = require('https');
var base64Encode = require('base64-stream').encode;

var github;

var config = require('../config');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://"+ config.mongodb.host+":"+config.mongodb.port+"/gitrunner";

var db;

MongoClient.connect(url, function(err, _db) {
    if (!err && _db) {
        db = _db;
    } else {
        throw "Could not connect to mongo";
    }
});

function generateID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

var repoList = [
    ['rpc-team', 'GitRunner'],
    ['Odobo', 'odobox'],
    ['Netflix', 'hystrix'],
    ['vert-x3', 'vertx-lang-js'],
    ['FreeCodeCamp', 'FreeCodeCamp'],
    ['qutheory', 'vapor'],
    ['google', 'closure-compiler'],
    ['facebook', 'react-native'],
    ['torvalds', 'linux'],
    ['fogleman', 'Craft'],
    ['callmecavs', 'layzr.js']
];

function getStartLevel(){
    var index = Math.floor(Math.random() * repoList.length);
    return repoList[index];
}

function getNextLevel(prevOwner, prevRepo){
    var index = Math.floor(Math.random() * repoList.length);
    return repoList[index];
}

function parseGitHubStats(playerID, gameID, owner, repository, res) {
    new Promise(function(resolve, reject) {
        github.repos.get({
            user: owner,
            repo: repository
        }, function(err, data) {
            if(err) {
                return reject();
            }

            resolve({ repo: data });
        });
    })
    .then(function(prevData) {
        return new Promise(function(resolve, reject) {
            github.repos.getBranches({
                user: owner,
                repo: repository
            }, function(err, data) {
                if(err) {
                    return reject();
                }

                prevData.branches = data;
                resolve(prevData);
            });
        });
    })
    .then(function(prevData) {
        return new Promise(function(resolve, reject) {
            github.repos.getLanguages({
                user: owner,
                repo: repository
            }, function(err, data) {
                if(err) {
                    return reject();
                }

                prevData.languages = data;
                resolve(prevData);
            });
        });
    })
    .then(function(prevData) {
        return new Promise(function(resolve, reject) {
            github.repos.getReadme({
                user: owner,
                repo: repository
            }, function(err, data) {
                prevData.readme = !(!!err);
                resolve(prevData);
            });
        });
    })
    .then(function(allData) {
        var avatar_url = allData.repo.organization ? allData.repo.organization.avatar_url : allData.repo.owner.avatar_url;
        https.get(avatar_url, function(_res) {
            if(_res.statusCode === 200) {
                var imgb64 = '', contentType = _res.headers['content-type'];

                var enc = _res.pipe(base64Encode());
                enc.on('data', function(chunk){
                    imgb64 += chunk;
                });
                enc.on('finish', function(ef) {
                    var maxLangSize = 0;

                    Object.keys(allData.languages).map(function(v) { if(allData.languages[v] > maxLangSize) maxLangSize = allData.languages[v]; });

                    function returnBestRepoSize(size){
                        var minSize = (Math.floor(maxLangSize / 1024) + allData.repo.subscribers_count) * 5;
                        var maxSize = 2500;

                        if ( size > maxSize ) return maxSize;
                        if ( size < minSize ) return minSize;
                        return size;
                    }

                    var repoSize = returnBestRepoSize(allData.repo.size);
                    var varianceFactor = allData.repo.size > 2500 ? 2500 / allData.repo.size : 1;
                    var obsNumber = Math.floor(maxLangSize / 1024 * varianceFactor);

                    var data = {
                        playerID: playerID,
                        gameID: gameID,
                        owner: owner,
                        repository: repository,
                        size: repoSize,
                        obstacles: obsNumber < Math.floor(repoSize / 5) ? Math.floor(repoSize / 5) : obsNumber,
                        monsters: Math.floor(allData.repo.subscribers_count * varianceFactor),
                        gaps: Math.floor(Object.keys(allData.branches).length * varianceFactor),
                        fires: Math.floor(allData.repo.forks_count * varianceFactor),
                        readme: allData.readme,
                        avatar: 'data:' + contentType + ';base64,' + imgb64
                    };

                    //function returnBestRepoSize(size){
                    //    var minSize = (Math.floor(maxLangSize / 1024) + allData.repo.subscribers_count) * 5;
                    //    var maxSize = 2500;
                    //    if(size > 2500) {
                    //        return
                    //    }
                    //}
                    //var data = {
                    //    playerID: playerID,
                    //    gameID: gameID,
                    //    owner: owner,
                    //    repository: repository,
                    //    size: (Math.floor(maxLangSize / 1024) + allData.repo.subscribers_count) * 5,
                    //    obstacles: Math.floor(maxLangSize / 1024),
                    //    monsters: allData.repo.subscribers_count,
                    //    gaps: Object.keys(allData.branches).length,
                    //    fires: allData.repo.forks_count,
                    //    readme: allData.readme,
                    //    avatar: 'data:' + contentType + ';base64,' + imgb64
                    //};

                    db.collection('gameplay').updateOne({ "_id" : playerID + "_" + gameID }, { $inc: { "maxScoreSize": data.size }}, function(err, result) {
                        if(!err) {
                            res.send(data);
                        } else {
                            res.status(500).send({ message: 'Failed to update gameplay into db' });
                        }
                    });
                });
            }
        });
    })
    .catch(function() {
        res.status(500).send({ message: 'Failed to fetch the required data..' });
    });
}

module.exports = function() {
    return {
        // Initial setup handlers
        //
        setGitHub: function(_github) {
            github = _github;
        },

        // Endpoint handlers
        //
        version: function(req, res) {
            res.send({ name: 'GitRunner', version: req.app.locals.appVersion });
        },
        health: function(req, res) {
            github.repos.get({
                user: req.app.locals.github.owner,
                repo: req.app.locals.github.repository
            }, function(err, data) {
                if(err) {
                    return res.status(500).send({ message: 'Unexpected Error', error: err });
                }

                res.send({ message: 'OK', data: data });
            });
        },
        startLevel: function(req, res) {
            var playerID = req.params.playerID;
            var gameID = generateID();
            var level = getStartLevel();

            var gameplayDoc = {
                "_id": playerID + "_" + gameID,
                "playerID": playerID,
                "gameID": gameID,
                "score": 0,
                "maxScoreSize": 0,
                "levels": [level]
            };

            db.collection('gameplay').insertOne(gameplayDoc, function(err, result) {
                if(!err) {
                    parseGitHubStats(playerID, gameID, level[0], level[1], res);
                } else {
                    res.status(500).send({ message: 'Failed to save gameplay into db' });
                }
            });
        },
        nextLevel: function(req, res) {
            var playerID = req.params.playerID;
            var gameID = req.params.gameID;
            var level = getNextLevel();  //TODO to be decided if we put here the last level played or we make any connections for them, one option is to randomly select from an array of preset repos

            // TODO: Check if gameID and playerID are actually valid. If not, send an error

            db.collection('gameplay').findOne({_id: playerID+'_'+gameID}, function(err, doc) {
                if ( !err && doc ) {
                    parseGitHubStats(playerID, gameID, level[0], level[1], res);
                } else {
                    res.status(404).send({ message: 'Stop sending crap! Please!' });
                }
            });
        },
        score: function(req, res){
            var body = req.body;

            if(body && body.playerID && body.nickname && body.gameID && body.score){
                checkScore(body, function (isValid){
                    if (isValid){
                            db.collection('gameplay').updateOne({ "_id" : body.playerID + "_" + body.gameID }, { $set: { "score": body.score, "nickname": body.nickname, "completedTimestamp": Date.now()}}, function(err, result) {
                                if(!err) {
                                    res.send();
                                } else {
                                    res.status(500).send({ message: 'Failed to update gameplay into db' });
                                }
                            });
                    } else {
                        return res.status(403).send({ message: 'Score Invalid'});
                    }
                });
            } else {
                return res.status(400).send({ message: 'Bad Request'});
            }

            function checkScore(params, cb){
                var cursor = db.collection('gameplay').findOne({ "_id" : params.playerID + "_" + params.gameID}, function(err, doc){
                    if(!err && doc) {
                        if(params.score <= doc.maxScoreSize){
                            cb(true);
                        } else {
                            cb(false);
                        }
                    } else {
                        cb(false);
                    }
                });
            };
        },
        leaderboard: function(req, res){
            var playerID = req.params.playerID;

            var data = {
                leaderboard: [],
                player: null
            };

            db.collection('gameplay').find({"nickname" : {$exists: true}}, {"limit": 5, "sort": [["score", "desc"]]}).toArray(function(err, items) {
                for (i in items) {
                    data.leaderboard[i] = {};
                    data.leaderboard[i].nickname = items[i].nickname;
                    data.leaderboard[i].score = items[i].score;
                    data.leaderboard[i].playerID = items[i].playerID;
                }

                db.collection('gameplay').find({"playerID": playerID}, {"limit": 1, "sort": [["score", "desc"]]}).toArray(function(err, players) {
                    if(players.length>0){
                        data.player = {};
                        data.player.score = players[0].score;

                        console.log("lead: " + JSON.stringify(data.leaderboard))
                        console.log("player " + JSON.stringify(data.player))

                        //if the player exists in the DB, get  the leaderboard position (count elements with higher score than this players)
                        db.collection('gameplay').find({ score : { $gt : data.player.score } }).count(function(err, position){
                            data.player.position = position + 1;
                            res.send(data);
                        });
                    } else {
                        res.send(data);
                    }
                });
            });
        }
    };
}();