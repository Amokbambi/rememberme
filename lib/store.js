
var extend = require('./extend')

module.exports = Store

function Store() {
  this._pendingEvents = null
  this._pendingMap = null
  this._listeners = {}
  this.state = {}

  this.initState()
  for (var name in this.actions) {
    this.actions[name] = this.actions[name].bind(this)
  }
  for (var name in this.getters) {
    this.getters[name] = this.getters[name].bind(this)
  }
  for (var name in this.events) {
    this.events[name] = this.events[name].bind(this)
  }
}

Store.extend = function (obj) {
  var dest = Object.create(Store.prototype)
  return extend(dest, obj)
}

Store.prototype = {

  changed: function () {
    var events = [].slice.call(arguments)
    if (!this._pendingEvents) {
      this._pendingEvents = []
      this._pendingMap = {}
      setTimeout(this._dispatchEvents.bind(this), 0)
    }

    for (var i=0; i<events.length; i++) {
      if (this._pendingMap[events[i]]) {
        continue;
      }
      this._pendingEvents.push(events[i])
      this._pendingMap[events[i]] = true
    }
  },

  on: function (evt, hdlr) {
    if (!this._listeners[evt]) {
      this._listeners[evt] = []
    }
    if (this._listeners[evt].indexOf(hdlr) === -1) {
      this._listeners[evt].push(hdlr)
    }
  },

  off: function (evt, hdlr) {
    if (!this._listeners[evt]) {
      return false
    }
    var ix = this._listeners[evt].indexOf(hdlr)
    if (ix === -1) return false
    this._listeners[evt].splice(ix, 1)
    return true
  },

  _dispatchEvents: function () {
    // TODO use a function IDing thing and a map instead
    var hit = [];
    for (var i=0; i<this._pendingEvents.length; i++) {
      var hdlrs = this._listeners[this._pendingEvents[i]]
      if (!hdlrs) continue;
      for (var j=0; j<hdlrs.length; j++) {
        if (hit.indexOf(hdlrs[j]) !== -1) continue;
        hit.push(hdlrs[j])
        hdlrs[j]()
      }
    }
    this._pendingEvents = null
    this._pendingMap = null
  },

  events: function () {
  },

  getters: {
  },

  actions: {
  }
}

