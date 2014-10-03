
module.exports = Db

function Db() {
}

Db.prototype = {
  init: function (done) {
    var data = {
      rest: JSON.parse(localStorage.rmeRest || 'null'),
      list: JSON.parse(localStorage.rmeList || 'null'),
      map: {}
    }
    if (data.list) {
      data.list.forEach(id => {
        data.map[id] = JSON.parse(localStorage['rme:' + id])
      })
    }
    done(data)
  },

  saveRest: function (rest) {
    localStorage.rmeRest = JSON.stringify(rest)
  },

  saveStories: function (list, map) {
    localStorage.rmeList = JSON.stringify(list)
    for (var id in map) {
      localStorage['rme:' + id] = JSON.stringify(map[id])
    }
  },

  saveStory: function (id, value) {
    localStorage['rme:' + id] = JSON.stringify(value)
  },
}

