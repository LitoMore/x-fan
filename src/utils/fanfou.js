import Fanfou from 'fanfou-sdk-browser';
import {consumerKey, consumerSecret} from '../config/fanfou.config';
import {getAccounts} from './account';

const apiDomain = 'cors.fanfou.com';
const oauthDomain = 'cors.fanfou.com';
const hooks = {
	baseString: baseStr => {
		return baseStr
			.replace('cors.fanfou.com%2Foauth', 'fanfou.com%2Foauth')
			.replace('cors.fanfou.com', 'api.fanfou.com');
	}
};

export const xauth = (username, password) => {
	const ff = new Fanfou({
		consumerKey,
		consumerSecret,
		username,
		password,
		apiDomain,
		oauthDomain,
		hooks
	});
	return ff.xauth();
};

export const getUserTimeline = () => {
	const accounts = getAccounts();
	if (accounts.length === 0) {
		return;
	}
	const [user] = accounts;
	const {oauthToken, oauthTokenSecret} = user;
	const ff = new Fanfou({
		consumerKey,
		consumerSecret,
		oauthToken,
		oauthTokenSecret,
		apiDomain,
		oauthDomain,
		hooks
	});
	return ff.get('/statuses/user_timeline', {count: 20});
};
