pushd client/src
npm i -g browserify
npm install
popd

pushd server
npm install
popd

echo '\nNow just export GITHUB_USERNAME, GITHUB_OAUTH_TOKEN and GITRUNNER_BACKEND_HOST (ideally stored in a file like .bashrc).\ne.g.\nexport GITHUB_USERNAME=foo\nexport GITHUB_OAUTH_TOKEN=bar\nexport GITRUNNER_BACKEND_HOST=foobar'