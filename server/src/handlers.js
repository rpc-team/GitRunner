var https = require('https');
var base64Encode = require('base64-stream').encode;

var github;

function parseGitHubStats(res, owner, repository) {
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

                    var data = {
                        size: allData.repo.size,
                        obstacles: maxLangSize,
                        monsters: allData.repo.subscribers_count,
                        gap: Object.keys(allData.branches).length,
                        fire: allData.repo.forks_count,
                        readme: allData.readme,
                        avatar: 'data:' + contentType + ';base64,' + imgb64
                    };

                    res.send(data);
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
        level: function(req, res) {
            var level;

            // if level not specified, pick one ..
            // TODO: create an algorithm to fetch a random repo and replace the hardcoded values
            if(req.params.level) {
                level = req.params.level.split(':');
            } else {
                level = ['vert-x3', 'vertx-lang-js'];
            }

            parseGitHubStats(res, level[0], level[1]);
        }
    };
}();