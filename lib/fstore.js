
var FS = FamilySearch
  , Store = require('./store')
  , syncMe = require('./sync-me')

module.exports = FStore

function FStore() {
  Store.apply(this, arguments)
}

FStore.prototype = Store.extend({
  initState: function () {
    return {
      isLoggedIn: FS.hasAccessToken(),
      stopSyncing: false,
      storyMap: {},
      stories: null,
    }
  },

  getters: {
    isSyncing: function () {
      return !!this.state.stopSyncing
    },
    isLoggedIn: function () {
      return this.state.isLoggedIn
    },
    listStories: function () {
      return this.state.stories ?
        this.state.stories.map(id =>
          this.state.storyMap[id]) : []
    },
    story: function (id) {
      return this.state.storyMap[id]
    },
  },

  events: {
    syncing: () => 'syncing',
    loggedIn: () => 'loggedIn',
    storiesChanged: () => 'stories',
    story: (id) => 'story:' + id,
  },

  actions: {
    login: function (username, password) {
      FS.getAccessTokenForMobile(username, password)
        .then(() => {
          this.changed(this.events.loggedIn())
        })
    },

    startSyncing: function () {
      if (!this.state.isLoggedIn) return false
      this.state.stories = []

      this.changed(this.events.syncing())
      this.changed(this.events.stories())

      this.state.stopSyncing = syncMe(
        (story) => { // each
          this.state.stories.push(story.id)
          this.state.storyMap[story.id] = story
          this.changed(
            this.events.stories(),
            this.events.story(story.id))
        },
        (err) => { // done
          this.state.syncing = false
          this.changed(this.events.syncing())
        }
      )
    },

    stopSyncing: function () {
      if (!this.state.stopSyncing) return
      this.state.stopSyncing(() => {
        this.state.stopSyncing = false
        this.changed(this.events.syncing())
      })
    },
  },
})
