const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sfgarcia:${password}@sfgarcia.joal59t.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length === 3) {
  Phonebook.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phonebook => {
      console.log(`${phonebook.name} ${phonebook.number}`)
    })
    mongoose.connection.close()
  })
}
else{
  const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })
    
  phonebook.save().then(result => {
    console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
    mongoose.connection.close()
  })
}
