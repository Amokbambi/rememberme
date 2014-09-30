
var App = require('./lib')
  , React = require('react')

  , FS = require('familysearch-javascript-sdk')
  , config = require('./config.json')

window.addEventListener('DOMContentLoaded', function () {
  FS.init({
    client_id: config.client,
    environment: config.environment,
    redirect_uri: 'localhost',
    http_function: $.ajax,
    deferred_function: $.Deferred,
    save_access_token: true,
    auto_expire: true,
  })

  React.renderComponent(App({
  }), document.body)
})

