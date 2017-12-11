const express = require('express');
const app = express();
const path = require('path');
const oAuthController = require('./oAuthController');

app.use(express.static(path.resolve(__dirname)));

app.get('/auth/github', oAuthController.github, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.get('/auth/google', oAuthController.google, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.get('/auth/instagram', oAuthController.instagram, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.get('/auth/facebook', oAuthController.facebook, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.get('/auth/linkedin', oAuthController.linkedin, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.get('/auth/reddit', oAuthController.reddit, (req, res) => {
  res.status(200).send(res.locals.user);
});

app.listen(3000, () => console.log('Server Connected'));