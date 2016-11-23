var config = {
  replace: {
    backendBaseURI: 'https://ld.geo.admin.ch/',
    exposedBaseURI: 'http://{request}/',
    mediaTypes: [undefined, 'application/javascript', 'application/json', 'text/html', 'text/turtle']
  },
  port: 3000,
  hostUrl: 'http://geotrifid:8080/',
  setProxyHeaders: true,
  useProxyPortHeader: true
}

module.exports = config
