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
const opt = {consumerKey, consumerSecret, apiDomain, oauthDomain, hooks};

export const xauth = async (username, password) => {
	const x = new Fanfou({
		...opt,
		username,
		password
	});
	const token = await x.xauth();
	const {oauthToken, oauthTokenSecret} = token;
	if (oauthToken && oauthTokenSecret) {
		const o = new Fanfou({
			...opt,
			oauthToken,
			oauthTokenSecret
		});
		const user = await o.get('/statuses/home_timeline', {});
		return {token, user};
	}
	return null;
};

const initFanfou = () => {
	const accounts = getAccounts();
	if (accounts.length === 0) {
		return;
	}
	const [user] = accounts;
	const {oauthToken, oauthTokenSecret} = user;
	const ff = new Fanfou({
		...opt,
		oauthToken,
		oauthTokenSecret
	});
	return ff;
};

export const getUserTimeline = () => {
	const ff = initFanfou();
	return ff.get('/statuses/user_timeline', {count: 20});
};
