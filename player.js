
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    score:  Number,
    name: String
  }, { timestamps: true, versionKey: false })
  
  const PlayerModel = mongoose.model('Player', playerSchema)
  
  module.exports = PlayerModel