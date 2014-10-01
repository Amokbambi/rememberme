
var Store = require('./store')

module.exports = MyStore

function MyStore() {
}

MyStore.prototype = Object.create(Store.prototype)
MyStore.prototype.constructor = MyStore


