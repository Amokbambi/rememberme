
module.exports = function (opts) {
  var update = function () {
    var ns = opts.getState(this.props.store.getters,
                           this.props)
    this.setState(ns, opts.onUpdate &&
                      opts.onUpdate.bind(this))
  }

  return {
    getInitialState: function () {
      return opts.getState(this.props.store.getters,
                           this.props)
    },

    componentWillMount: function () {
      this._listened = opts.listen(this.props.store.events,
                                   this.props)
      this._update = update.bind(this)
      for (var i=0; i<this._listened; i++) {
        this.props.store.on(this._listened[i], this._update)
      }
    },

    componentWillUnmount: function () {
      for (var i=0; i<this._listened; i++) {
        this.props.store.off(this._listened[i], this._update)
      }
      this._listened = []
    },

    componentWillReceiveProps: function (nextProps) {
      // nothing right now
    },

  }
}

