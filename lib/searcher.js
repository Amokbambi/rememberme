
var FS = FamilySearch
  , async = require('async')

module.exports = Searcher

function Searcher(opts) {
  this.opts = opts
  this.count = 0
  this.countpeople = 0
  this.got = {}
  this.queue = async.queue(this.process.bind(this), this.opts.concurrency || 5)
  this.queue.drain = function () {opts.done(null)}
}

Searcher.prototype = {
  run: function (root) {
    this.queue.push({id: root, line: []})
  },

  resume: function (tasks) {
    console.log('resume with', tasks)
    this.queue.push(tasks)
  },

  stop: function () {
    var tasks = this.queue.tasks.map(item => item.data)
    this.queue.kill()
    this.opts.done(tasks)
  },

  process: function (item, next) {
    var pid = item.id
    if (this.got[pid]) return next()
    this.got[pid] = true

    if (this.count >= this.opts.max) {
      console.log('max memories')
      return this.stop()
    }

    if (this.countpeople++ > this.opts.maxpeople) {
      console.log('max people')
      return this.stop()
    }

    FS.getPersonWithRelationships(pid, {persons: true}).then((response) => {
      var person = response.getPrimaryPerson()
      person.line = item.line
      var name = person.$getDisplayName()
      this.opts.onPerson(person)
      var items = response.getFatherIds().concat(response.getMotherIds()).map(id => {
        return {
          id: id,
          line: [[person.display.name, person.display.lifespan]].concat(item.line),
        }
      })
      console.log('person', name)
      this.queue.push(items)

      FS.getPersonMemoriesQuery(pid, {type: 'story'}).then((response) => {
        var memories = response.getMemories()
        if (!memories) return next()

        async.parallel(memories.map(memory =>
          (next) =>
            FamilySearch.get(memory.about, null, {}, {dataType: 'text'}).then(text => {
              memory.person = person
              memory.text = text
              this.opts.each(memory)
              this.count += 1
              next()
            })
        ), next)
      })
    })
  },
}

