
var React = require('react')
  , PT = React.PropTypes

  , FS = require('familysearch-javascript-sdk')

var StoryList = React.createClass({
  mixins: [Listener({
    listen: function (events, props) {
      return [events.storiesChanged()]
    },
    getState: function (getters) {
      return {
        stories: getters.listStories(),
      }
    },
  })],

  _onLogin: function (username, password) {
    this.setState({loading: true})
    FS.getAccessTokenForMobile(username, password).then(() => {
      return FS.getCurrentUser().then((response) => {
        var user = response.getUser()
        this.setState({
          loading: false,
          user: user,
        })
      })
    })
  },

  render: function () {
    return <div className="StoryList">
      <ul className="StoryList_list">
        {this.state.stories.map(story =>
          <li className="StoryList_entry"
              onClick={this.props.viewStory.bind(null, story.id)}>
            This is a story
            {JSON.stringify(story, null, 2)}
          </li>)}
      </ul>
      <div className="StoryList_bottom">
        <Syncer store={this.props.store}/>
      </div>
    </div>
  },
})

module.exports = StoryList
