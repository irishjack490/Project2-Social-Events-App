
const mongoose = require('../utils/connection');
const {Schema, model} = mongoose;


const eventSchema = new Schema ({

  name: { type: String, required: true },
  localDate: { type: String,  required: true},
  localTime: {type: String, required: true},
  venueName: {type: String, required: true},
  venueAddress: { type: String, required: true},
  eventImage: [{ type: String, required: true}], 
  interested: { type: Boolean, required: true},
  attending: { type: Boolean, required: true},
  
  //id reference, mongoose syntax, object id reference: mongoose validator
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true,
});

const Event = model ('Event', eventSchema )

module.exports = Event;