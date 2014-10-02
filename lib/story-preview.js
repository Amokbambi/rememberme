
var React = require('react')
  , PT = React.PropTypes
  , cx = React.addons.classSet

var StoryPreview = React.createClass({
  render: function () {
    var story = this.props.story
    var text = story.descriptions.map(item => item.value).join('\n\n')
    return <li className={cx({
          "StoryPreview": true,
          "StoryPreview-viewed": story.viewed,
        })}
        onClick={this.props.onClick}>
      <p>{text.slice(0, 200) + '...'}</p>
      <span>
        {story.person.display.name} :
        {story.person.display.lifespan}
      </span>
    </li>
  },
})

module.exports = StoryPreview
