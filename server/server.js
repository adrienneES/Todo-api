const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

require('./config/config');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {authenticate} = require('./middleware/authenticate');

const {PORT} = process.env.PORT;

/* eslint vars-on-top:0 */
/* eslint consistent-return:0 */
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.get('/users/me', authenticate, (req, res) => {
  res.send({user: req.user});
});

// POST /users/login {email, password}
app.post('/users/login', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send('user deleted');
  } catch (error) {
    res.status(400);
  }
});
app.post('/users', async (req, res) => {
  const user = new User(_.pick(req.body, ['email', 'password']));
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
    return token;
  } catch (err) {
    res.status(400).send({msg: 'uhoh', err});
  }
});
app.post('/todos', authenticate, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    _creator: req.user._id
  });
  try {
    const doc = await todo.save();
    res.send(doc);
  } catch (error) {
    res.status(400).send({error});
  }
});
app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({_creator: req.user._id});
    res.send({count: todos.length, todos});
  } catch (error) {
    res.status(400).send({error});
  }
});
app.get('/todos/:id', authenticate, (req, res) => {
  /* eslint prefer-destructuring:0 */
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('bad id');
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send('not found');
    }
    res.send({todo});
  });
});
app.delete('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send('invalid id');
  }
  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch (error) {
    res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({msg: 'bad id'});
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
    body.complete = false;
  }
  const todo = await Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true});
  try {
    if (!todo) { return res.status(404).send({msg: 'not found'}); }
    res.send({msg: 'updated', todo});
  } catch (error) {
    res.status(400).send({msg: 'err:$ {err}'});
  }
});

app.get('/', (req, res) => {
  res.send('this is todo app');
});


app.listen(PORT, () => {
  console.log('started on port ', PORT);
});

module.exports = {app};
