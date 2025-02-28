const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to BD')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    minlength: [9, 'Number must be at least 9 characters long'],
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXX.`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)