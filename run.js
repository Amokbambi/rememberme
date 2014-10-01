
var App = require('./lib')
  , FStore = require('./lib/fstore')

  , React = require('react')

  , config = require('./config')
  , FS = FamilySearch

FS.init({
  client_id: config.client,
  environment: config.environment,
  redirect_uri: 'localhost',
  http_function: $.ajax,
  deferred_function: $.Deferred,
  save_access_token: true,
  auto_expire: true,
})

window.addEventListener('DOMContentLoaded', function () {
  var store = new FStore()

  React.renderComponent(App({
    store: store,
  }), document.body)
})

