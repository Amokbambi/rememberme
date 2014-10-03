
var React = require('react')
  , PT = React.PropTypes
  , StoryList = require('./story-list')
  , StoryView = require('./story-view')

var App = React.createClass({
  getInitialState: function () {
    return {
      page: null,
      savedScroll: null,
    }
  },

  componentDidMount: function () {
    document.addEventListener('backbutton', (e) => {
      if (!this.state.page) return
      e.preventDefault()
      this._viewAll()
    })
  },

  _viewAll: function () {
    this.setState({page: null})
  },
  _viewStory: function (sid) {
    this.props.store.actions.setStoryViewed(sid)
    this.setState({page: sid, savedScroll: document.body.scrollTop})
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevState.page && !this.state.page) {
      document.body.scrollTop = this.state.savedScroll
    } else if (!prevState.page && this.state.page) {
      document.body.scrollTop = 0
    }
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
})

module.exports = App

