
var React = require('react')
  , PT = React.PropTypes

  , Listener = require('./listener')

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
          <li className={cx({
                "StoryList_entry": true,
                "StoryList_entry-viewed": story.viewed,
              })}
              onClick={
                this.props.viewStory.bind(null, story.id)
              }>
            This is a story
            <span>{story.text.slice(0, 200) + '...'}<span>
            <span>{story.person}</span>
          </li>)}
      </ul>
      <div className="StoryList_bottom">
        <Syncer store={this.props.store}/>
      </div>
    </div>
  },
})

module.exports = StoryList
