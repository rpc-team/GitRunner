pushd client/src
npm install
popd

pushd server
npm install
popd

echo '\nNow just export GITHUB_USERNAME and GITHUB_OAUTH_TOKEN (ideally stored in a file like .bashrc).\ne.g.\nexport GITHUB_USERNAME=foo\nexport GITHUB_OAUTH_TOKEN=bar'