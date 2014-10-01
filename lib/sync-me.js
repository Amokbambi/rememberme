
var FS = FamilySearch
  //, async = require('async')

module.exports = function (each, done) {
  FS.getCurrentUser().then((response) => {
    var baseId = response.getUser().personId
    loop(baseId, 10, 50, each, done)
  })
}

function loop(root, max, maxpeople, each, done) {
  var queue = [root]
    , count = 0
    , countpeople = 0

  function step() {
    if (countpeople++ > maxpeople) return done()
    var next = queue.shift()
    FS.getPersonMemoriesQuery(next, {type: 'story'}).then((response) => {
      response.getMemories().forEach(memory => {
        each(memory)
        count += 1
      })
      if (count >= max) return done()
      FS.getPersonWithRelationships(next, {persons: true}).then((response) => {
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

