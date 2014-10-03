
var FS = FamilySearch
  , Store = require('./store')
  , syncMe = require('./sync-me')

module.exports = FStore

function FStore(db, data) {
  this.db = db
  this.initialData = data
  Store.apply(this, arguments)
}

FStore.prototype = Store.extend({
  initState: function () {
    return {
      isLoggedIn: FS.hasAccessToken(),
      stopSyncing: false,
      syncedPeople: 1,
      storyMap: this.initialData.map,
      stories: this.initialData.list,
    }
  },

  getters: {
    isSyncing: function () {
      return !!this.state.stopSyncing
    },
    syncedPeople: function () {
      return this.state.syncedPeople
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
    syncedPeople: () => 'synced-people',
    loggedIn: () => 'loggedIn',
    storiesChanged: () => 'stories',
    storyChanged: (id) => 'story:' + id,
  },

  actions: {
    login: function (username, password) {
      FS.getAccessTokenForMobile(username, password)
        .then((result) => {
          this.state.isLoggedIn = true
          this.changed(this.events.loggedIn())
        })
    },

    setStoryViewed: function (sid) {
      if (this.state.storyMap[sid].viewed) return
      this.state.storyMap[sid].viewed = true
      this.db.saveStory(sid, this.state.storyMap[sid])
      this.changed(this.events.storyChanged(sid))
    },

    startSyncing: function () {
      if (!this.state.isLoggedIn) return false
      if (this.state.stopSyncing) this.state.stopSyncing()

      if (!this.state.stories) {
        this.state.stories = []
      }

      this.state.stopSyncing = syncMe(
        this.initialData.rest,
        (person) => { // person
          this.state.syncedPeople += 1
          this.changed(this.events.syncedPeople())
        },
        (story) => { // each
          // console.log('each', story)
          this.state.stories.push(story.id)
          this.state.storyMap[story.id] = story
          this.changed(
            this.events.storiesChanged(),
            this.events.storyChanged(story.id))
        },
        (rest) => { // done
          this.db.saveRest(rest)
          this.db.saveStories(this.state.stories, this.state.storyMap)
          this.state.stopSyncing = false
          this.changed(this.events.syncing())
        }
      )

      this.changed(this.events.syncing())
      this.changed(this.events.storiesChanged())
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

