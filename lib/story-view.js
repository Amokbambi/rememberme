
var React = require('react')
  , PT = React.PropTypes

var StoryView = React.createClass({
  mixins: [Listener({
    listen: function (events, props) {
      return [events.storyChanged(props.sid)]
    },
    getState: function (getters, props) {
      return {
        story: getters.story(props.sid),
      }
    },
  })],

  render: function () {
    var story = this.state.story
    if (!story) {
      return <div className="StoryView">
        header here... <button onClick={this.props.goBack}>Back</button>
        Loading... or not found
      </div>
    }
    return <div className="StoryView">
        header here... <button onClick={this.props.goBack}>Back</button>
      Here is a story
      <div className="StoryView_person">
        {story.title}
      </div>
      <div className="StoryView_text">
        {story.text}
      </div>
    </div>
  },
})

module.exports = StoryView

