
var React = require('react')
  , PT = React.PropTypes

var LoginForm = React.createClass({
  getInitialState: function () {
    return {
      username: '',
      password: ''
    }
  },

  _changeUsername: function (e) {
    this.setState({username: e.target.value})
  },
  _changePassword: function (e) {
    this.setState({password: e.target.value})
  },
  _onSubmit: function () {
    this.props.onLogin(this.state.username, this.state.password)
  },

  render: function () {
    return <form className="Login" onSubmit={this._onSubmit}>
      <input value={this.state.username}
             onChange={this._changeUsername}/>
      <input value={this.state.password}
             onChange={this._changePassword}/>
      <button onClick={this._onSubmit}>
        Login
      </button>
    </form>
  }
});
 
