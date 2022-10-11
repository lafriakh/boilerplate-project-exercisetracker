require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});




const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
});

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER'
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true
  }
});

const USER = mongoose.model('USER', userSchema);
const EXERCISE = mongoose.model('EXERCISE', exerciseSchema);

app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  const user = new USER({
    username: username,
  });

  res.json(await user.save());
});

app.get('/api/users', async (req, res) => {
  res.json(USER.find({}));
});

app.get('/api/users/:_id/exercises', async (req, res) => {

});
app.get('/api/users/:_id/logs', async (req, res) => {

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
