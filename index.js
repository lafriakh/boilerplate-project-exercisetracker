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
    required: false,
    default: Date.now
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
  USER.find().lean().exec(function (err, users) {
    return res.end(JSON.stringify(users));
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = await USER.findById(_id);
  const exercise = new EXERCISE({
    description: description,
    duration: duration,
    date: date,
    user: user._id,
  });
  await exercise.save();

  res.json({
    _id: user._id,
    username: user.username,
    exercise: {
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    },
  });
});

app.get('/api/users/:_id/logs', async (req, res) => {

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
