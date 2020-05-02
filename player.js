
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
    name:  String,
    password: String
  }, { timestamps: true, versionKey: false })
  
  const PlayerModel = mongoose.model('Player', playerSchema)
  
  module.exports = PlayerModel