
const mongoose = require('../utils/connection');
const {Schema, model} = mongoose;


const eventSchema = new Schema ({
  type: { type: Array, required: true },
  datetime_utc: { type: Array,  required: true},
  venueName: {type: Array, required: true},
  venueAddress: {type: Array, required: true},
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