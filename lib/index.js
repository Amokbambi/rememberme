
var React = require('react')
  , PT = React.PropTypes

  , FS = require('familysearch-javascript-sdk')

var App = React.createClass({
  getInitialState: function () {
    return {
      page: null,
    }
  },

  _viewAll: function () {
    this.setState({page: null})
  },
  _viewStory: function (sid) {
    this.setState({page: sid})
  },

  render: function () {
    return <div className="Main">
      {this.state.page ?
        <StoryView
          goBack={this._viewAll}
          sid={this.state.page}
          store={this.props.store}/> :
        <StoryList
          viewStory={this._viewStory}
          stories={this.state.stories}
          store={this.props.store}/>}
    </div>
  },

  render: function () {
    return <div className="App">
      {this.state.loggedin ?
        <Login onLogin={this._onLogin} /> :
        <Main />}
    </div>
  }
})

module.exports = App

