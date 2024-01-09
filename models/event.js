
const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  date: { type: Date, required: true},
  location: {type: String, required: true},
  attending: {type: Boolean, required: true},
  interested: {type: Boolean, required: true },
  //id reference, mongoose syntax, object id reference: mongoose validator
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true,
});

const Events = model ('Event', eventSchema )

module.exports = mongoose.model('Event', eventSchema);