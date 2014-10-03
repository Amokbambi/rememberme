
var React = require('react')
  , PT = React.PropTypes
  , Listener = require('./listener')
  , cx = React.addons.classSet

function renderPedigree(line) {
  if (!line.length) return null
  return <div className="StoryView_pedigree">
    <span className="StoryView_pedigree_name">
      {line[0][0]}
    </span>
    <span className="StoryView_pedigree_years">
      {line[0][1]}
    </span>
    {renderPedigree(line.slice(1))}
  </div>
}

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
        <span className="StoryView_pedigree_name">
          {story.person.display.name}
        </span>
        <span className="StoryView_pedigree_years">
          {story.person.display.lifespan}
        </span>
      </div>
      {renderPedigree(story.person.line)}
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

