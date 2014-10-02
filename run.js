
var App = require('./lib')
  , FStore = require('./lib/fstore')

  , React = require('react')

  , config = require('./config')
  , FS = FamilySearch

window.React = React

var opts = {
  client_id: config.client,
  environment: config.environment,
  redirect_uri: 'localhost',
  http_function: $.ajax,
  deferred_function: $.Deferred,
  save_access_token: true,
  auto_expire: true,
}

if (localStorage.access_token) {
  opts.access_token = localStorage.access_token
  opts.environment = 'production'
}

FS.init(opts)

window.addEventListener('DOMContentLoaded', function () {
  var store = window.store = new FStore()

  React.renderComponent(App({
    store: store,
  }), document.body)
})

