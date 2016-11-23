/* global rdf:false */

'use strict';

var
  fs = require('fs'),
  path = require('path');


var buildQuery = function (iri) {
  return 'define sql:describe-mode "CBD" DESCRIBE <' + iri + '>';
};

var buildExistsQuery = function (iri) {
  return 'ASK { <' + iri + '> ?p ?o }';
};

var patchResponseHeaders = function (res, headers) {
  if (res.statusCode === 200) {
    // clean existings values
    var fieldList = [
      'Access-Control-Allow-Origin',
      'Cache-Control',
      'Fuseki-Request-ID',
      'Server',
      'Vary'];

    if (res._headers) {
      fieldList.forEach(function (field) {
        if (field in res._headers) {
          delete res._headers[field];
        }

        if (field.toLowerCase() in res._headers) {
          delete res._headers[field.toLowerCase()];
        }
      });
    }

    // cors header
    headers['Access-Control-Allow-Origin'] = '*';

    // cache header
    headers['Cache-Control'] = 'public, max-age=120';

    // vary header
    headers['Vary'] = 'Accept';
  }

  return headers;
};

module.exports = {
  app: 'trifid-ld',
  logger: {
    level: 'debug'
  },
  listener: {
    port: 8080
  },
  expressSettings: {
    'trust proxy': 'loopback',
    'x-powered-by': null
  },
  patchHeaders: {
    patchResponse: patchResponseHeaders
  },
  sparqlProxy: {
    path: '/query',
    options: {
      endpointUrl:'https://web-sparql-virtuoso.dev.bgdi.ch/sparql',
      queryOperation: 'urlencoded'
    }
  },
  sparqlSearch: {
    path: '/whatever',
    options: {
      endpointUrl:'https://web-sparql-virtuoso.dev.bgdi.ch/sparql',
      resultsPerPage: 5,
      queryTemplate: fs.readFileSync(path.join(__dirname, 'data/sparql/search.sparql')).toString(),
      variables: {
        'q': {
          variable: '%searchstring%',
          required: true
        }
      }
    }
  },
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'https://web-sparql-virtuoso.dev.bgdi.ch/sparql',
    buildQuery: buildQuery,
    buildExistsQuery: buildExistsQuery,
    hostname: 'ld.geo.admin.ch',
    port: '' 
  }
};
