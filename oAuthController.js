const request = require('request');
const jwt = require('jsonwebtoken');
const keys = require('./keys');

const redirectUri = 'http://localhost:3000/auth/';

const OAuthController = {
  github: (req, res, next) => {
    const authCode = req.query.code;
    const tokenUri = `https://github.com/login/oauth/access_token?
                      client_id=${keys.GITHUB_ID}&
                      client_secret=${keys.GITHUB_SECRET}&
                      code=${authCode}&
                      accept=json`
                      .replace(/\s/g, '');

    request.post(tokenUri, (error, response, body) => {
      const accessToken = body.split('&')[0].split('=')[1];
      const options = {
        url: `https://api.github.com/user?access_token=${accessToken}`,
        //github oauth requires your own github handle here
        headers: { 'User-Agent': 'didrio' }
      };

      request.get(options, (error, response, body) => {
        body = JSON.parse(body);
        res.locals.user = {};
        res.locals.user.email = body.email;
        res.locals.user.id = String(body.id);
        res.locals.user.handle = body.login;
        res.locals.user.name = body.name;
        res.locals.user.avatar = body.avatar_url;
        next();
      });
    });
  },

  google: (req, res, next) => {
    const authCode = req.query.code;
    const tokenUri = `https://www.googleapis.com/oauth2/v4/token?
                      code=${authCode}&
                      client_id=${keys.GOOGLE_ID}&
                      client_secret=${keys.GOOGLE_SECRET}&
                      redirect_uri=${redirectUri}google&
                      grant_type=authorization_code`
                      .replace(/\s/g, '');

    request.post(tokenUri, (error, response, body) => {
      const idToken = JSON.parse(body)['id_token'];
      const payload = jwt.decode(idToken);
      const googleId = payload.sub;

      const accessToken = JSON.parse(body)['access_token'];

      const apiUri = `https://www.googleapis.com/plus/v1/people/${googleId}?
                      access_token=${accessToken}`
                      .replace(/\s/g, '');

      request.get(apiUri, (error, response, body) => {
        body = JSON.parse(body);
        res.locals.user = {};
        res.locals.user.email = body.emails[0].value;
        res.locals.user.id = body.id;
        res.locals.user.name = body.displayName;
        res.locals.user.avatar = body.image.url;
        next();
      });
    });
  },

  instagram: (req, res, next) => {
    const authCode = req.query.code;
    const formData = {
      client_id: keys.INSTAGRAM_ID,
      client_secret: keys.INSTAGRAM_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: `${redirectUri}instagram`,
      code: authCode
    };
    const tokenUri = 'https://api.instagram.com/oauth/access_token';

    request.post({ url: tokenUri, formData }, (error, response, body) => {
      body = JSON.parse(body);

      const accessToken = body['access_token'];

      const apiUri = `https://api.instagram.com/v1/users/self/?
                      access_token=${accessToken}`
                      .replace(/\s/g, '');

      request.get(apiUri, (error, response, body) => {
        body = JSON.parse(body);
        res.locals.user = {};
        res.locals.user.id = body.data.id;
        res.locals.user.handle = body.data.username;
        res.locals.user.name = body.data.full_name;
        res.locals.user.avatar = body.data.profile_picture;
        next();
      });
    });
  },

  facebook: (req, res, next) => {
    const authCode = req.query.code;
    const tokenUri = `https://graph.facebook.com/v2.11/oauth/access_token?
                      client_id=${keys.FACEBOOK_ID}&
                      redirect_uri=${redirectUri}facebook&
                      client_secret=${keys.FACEBOOK_SECRET}&
                      code=${authCode}`
                      .replace(/\s/g, '');

    request.get(tokenUri, (error, response, body) => {
      body = JSON.parse(body);

      const accessToken = body['access_token'];

      const apiUri = `https://graph.facebook.com/me?
                      fields=id,name,picture,email&
                      access_token=${accessToken}`
                      .replace(/\s/g, '');

      request.get(apiUri, (error, response, body) => {
        body = JSON.parse(body);
        console.log(body);
        res.locals.user = {};
        res.locals.user.id = body.id;
        res.locals.user.name = body.name;
        res.locals.user.avatar = body.picture.data.url;
        res.locals.user.email = body.email;
        next();
      });
    });
  },

  linkedin: (req, res, next) => {
    const authCode = req.query.code;
    const tokenUri = `https://www.linkedin.com/oauth/v2/accessToken?
                      grant_type=authorization_code&
                      client_id=${keys.LINKEDIN_ID}&
                      redirect_uri=${redirectUri}linkedin&
                      client_secret=${keys.LINKEDIN_SECRET}&
                      code=${authCode}`
                      .replace(/\s/g, '');

    request.post(tokenUri, (error, response, body) => {
      body = JSON.parse(body);

      const accessToken = body['access_token'];

      const options = {
        url: 'https://api.linkedin.com/v1/people/~:(id,formatted-name,email-address,picture-url)?format=json',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      };

      request.get(options, (error, response, body) => {
        body = JSON.parse(body);
        res.locals.user = {};
        res.locals.user.id = body.id;
        res.locals.user.email = body.emailAddress;
        res.locals.user.name = body.formattedName;
        res.locals.user.avatar = body.pictureUrl;
        next();
      });
    });
  },

  reddit: (req, res, next) => {
    const authCode = req.query.code;
    const authorization = new Buffer(`${keys.REDDIT_ID}:${keys.REDDIT_SECRET}`).toString('base64');

    const formData = {
      grant_type: 'authorization_code',
      redirect_uri: `${redirectUri}reddit`,
      code: authCode
    };

    const options = {
      url: 'https://www.reddit.com/api/v1/access_token',
      headers: { 'Authorization': `Basic ${authorization}` },
      formData
    };

    request.post(options, (error, response, body) => {
      body = JSON.parse(body);
      const accessToken = body['access_token'];

      const options = {
        url: 'https://oauth.reddit.com/api/v1/me',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'desktop:io.didr:v1.0.0 (by /u/didrio)'
        }
      };

      request.get(options, (error, response, body) => {
        body = JSON.parse(body);
        res.locals.user = {};
        res.locals.user.id = body.id;
        res.locals.user.handle = body.name;
        res.locals.user.avatar = body.icon_img;
        next();
      });
    });
  }
};

module.exports = OAuthController;