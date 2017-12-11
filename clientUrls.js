const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fauth%2F';
										//http://localhost:3000/auth/

const urls = {
	github: 		`https://github.com/login/oauth/authorize?
							scope=user:email&
							client_id=${keys.GITHUB_ID}`
							.replace(/\s/g, ''),

	google: 		`https://accounts.google.com/o/oauth2/v2/auth?
							client_id=${keys.GOOGLE_ID}&
							response_type=code&
							scope=openid%20profile%20email&
							redirect_uri=${redirectUri}google`
							.replace(/\s/g, ''),

	instagram: `https://api.instagram.com/oauth/authorize/?
							client_id=${keys.INSTAGRAM_ID}&
							redirect_uri=${redirectUri}instagram&
							response_type=code`
							.replace(/\s/g, ''),

	facebook: 	`https://www.facebook.com/v2.11/dialog/oauth?
							client_id=${keys.FACEBOOK_ID}&
							redirect_uri=${redirectUri}facebook&
							response_type=code`
							.replace(/\s/g, ''),

	linkedin: 	`https://www.linkedin.com/oauth/v2/authorization?
							client_id=${keys.LINKEDIN_ID}&
							redirect_uri=${redirectUri}linkedin&
							scope=r_basicprofile%20r_emailaddress&
							state=${(Math.random() + 1).toString(36).substring(7)}&
							response_type=code`
							.replace(/\s/g, ''),

	reddit: 		`https://www.reddit.com/api/v1/authorize?
							client_id=${keys.REDDIT_ID}&
							redirect_uri=${redirectUri}reddit&
							scope=identity&
							duration=temporary&
							state=${(Math.random() + 1).toString(36).substring(7)}&
							response_type=code`
							.replace(/\s/g, '')
}

document.querySelector('#github').href = urls.github;
document.querySelector('#google').href = urls.google;
document.querySelector('#instagram').href = urls.instagram;
document.querySelector('#facebook').href = urls.facebook;
document.querySelector('#linkedin').href = urls.linkedin;
document.querySelector('#reddit').href = urls.reddit;