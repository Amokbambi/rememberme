
var FS = FamilySearch
  //, async = require('async')

module.exports = function (each, done) {
  var stopper = {stopped: false}
  function stop() {
    stopper.stopped = true
  }
  FS.getCurrentUser().then((response) => {
    var baseId = response.getUser().personId
    loop(baseId, 10, 50, stopper, each, done)
  })
  return stop
}

function loop(root, max, maxpeople, stopper, each, done) {
  var queue = [root]
    , count = 0
    , countpeople = 0

  function step() {
    if (stopper.stopped) {
      console.log('aborted')
      return done()
    }
    if (countpeople++ > maxpeople) {
      console.log('max people')
      return done()
    }
    if (!queue.length) {
      console.log('ran out of tree')
      return done(count)
    }
    var next = queue.shift()
    FS.getPersonMemoriesQuery(next, {type: 'story'}).then((response) => {
      console.log('memories', response)
      if (stopper.stopped) {
        console.log('abortedd')
        return done()
      }
      response.getMemories().forEach(memory => {
        each(memory)
        count += 1
      })
      if (count >= max) {
        console.log('max memories')
        return done()
      }
      FS.getPersonWithRelationships(next, {persons: true}).then((response) => {
        console.log('persons', response)
        if (stopper.stopped) {
          console.log('aborteddd')
          return done()
        }
        var person = response.getPrimaryPerson()
        var name = person.$getDisplayName()
        queue = queue.concat(response.getFatherIds()).concat(response.getMotherIds())
        step()
      })
      /*
      async.parallel(
        response.getMemories().map((memory) => {
          return function (next) {
            FS.getMemory(memory.id).then((response) => {
              var memory = response.getMemory()
            })
          }
      })
      */
    })
  }

  step()
}

