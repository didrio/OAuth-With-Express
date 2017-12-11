# OAuth With Express
(Also Without Passport)

![Six Links To Various OAuth Services](https://i.imgur.com/7UH6NRy.png)

To get all the OAuth links working, you'll have to create a keys.js file in the root directory with your own ID's and secrets:

```javascript
const keys = {
  GITHUB_ID: '',
  GITHUB_SECRET: '',
  GOOGLE_ID: '',
  GOOGLE_SECRET: '',
  INSTAGRAM_ID: '',
  INSTAGRAM_SECRET: '',
  FACEBOOK_ID: '',
  FACEBOOK_SECRET: '',
  LINKEDIN_ID: '',
  LINKEDIN_SECRET: '',
  REDDIT_ID: '',
  REDDIT_SECRET: ''
};

module.exports = keys;
```

I tried implementing Twitter and Tumblr but they seemed to be much more difficult to get working. If anyone wants to contribute that'd be great! 