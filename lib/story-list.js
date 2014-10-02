
var React = require('react/addons')
  , PT = React.PropTypes
  , cx = React.addons.classSet

  , Listener = require('./listener')
  , Syncer = require('./syncer')
  , StoryPreview = require('./story-preview')

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

  render: function () {
    return <div className="StoryList">
      <ul className="StoryList_list">
        {this.state.stories.map(story =>
          <StoryPreview
            story={story}
            onClick={
              this.props.viewStory.bind(null, story.id)
            } />
        )}
      </ul>
      <div className="StoryList_bottom">
        <Syncer store={this.props.store}/>
      </div>
    </div>
  },
})

module.exports = StoryList
