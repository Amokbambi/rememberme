
var App = require('./lib')
  , FStore = require('./lib/fstore')

  , React = require('react')

  , config = require('./config.js')

window.addEventListener('DOMContentLoaded', function () {
  var store = new FStore()

  React.renderComponent(App({
    store: store,
  }), document.body)
})

