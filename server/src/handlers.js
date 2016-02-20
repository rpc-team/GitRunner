module.exports = function() {
    var github;

    return {
        // Initial setup handlers
        //
        setGitHub: function(_github) {
            github = _github;
        },

        // Endpoint handlers
        //
        version: function(req, res) {
            res.end('GitRunner version: ' + req.app.locals.appVersion);
        },
        health: function(req, res) {
            github.repos.get({
                user: req.app.locals.github.owner,
                repo: req.app.locals.github.repository
            }, function(err, data) {
                if(err) {
                    return res.end('Ops.. Something went wrong!\n\n' + JSON.stringify(err, null, 4));
                }

                res.end('Got it!\n\n' + JSON.stringify(data, null, 4));
            });
        }
    };
}();