
var React = require('react')
  , PT = React.PropTypes
  , Listener = require('./listener')
  , cx = React.addons.classSet

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
        <header>
          <button onClick={this.props.goBack}>Back</button>
        </header>
        Loading... or not found
      </div>
    }
    return <div className="StoryView">
      <header>
        <button onClick={this.props.goBack}>Back</button>
      </header>
      <div className="StoryView_person">
        {story.person.display.name + ' ' +
         story.person.display.lifespan}
      </div>
      {story.person.line.map(entry =>
        <div>{entry[0] + ' ' + entry[1]}</div>)}
      <div className="StoryView_text">
        {story.text}
      </div>
      <footer>
        <button onClick={this.props.goBack}>Back</button>
      </footer>
    </div>
  },
})

module.exports = StoryView

