
var FS = FamilySearch
  , async = require('async')
  , Searcher = require('./searcher')

module.exports = function (rest, person, each, done) {
  var max = localStorage.rmeMax || 5
  var maxpeople = localStorage.rmeMaxPeople || 10
  var searcher = new Searcher({
    max: max,
    maxpeople: maxpeople,
    onPerson: person,
    each: each,
    done: done,
  })

  if (rest) {
    searcher.resume(rest)
  } else {
    FS.getCurrentUser().then((response) => {
      var baseId = response.getUser().personId
      searcher.run(baseId)
    })
  }
  window.search = searcher
  return searcher.stop.bind(searcher)
}

