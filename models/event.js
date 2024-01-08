const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  location: String,
});

module.exports = mongoose.model('event', eventSchema);