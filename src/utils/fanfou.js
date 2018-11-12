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
		const profile = await o.get('/account/verify_credentials', {});
		return {token, profile};
	}
	return null;
};

const initFanfou = () => {
	const accounts = getAccounts();
	if (accounts.length === 0) {
		return;
	}
	const [user] = accounts;
	const {oauthToken, oauthTokenSecret} = user.token;
	const ff = new Fanfou({
		...opt,
		oauthToken,
		oauthTokenSecret
	});
	return ff;
};

export const getHomeTimeline = opt => {
	const ff = initFanfou();
	return ff.get('/statuses/home_timeline', {...opt, format: 'html', count: 30});
};

export const postStatus = opt => {
	const ff = initFanfou();
	if (opt.photo) {
		return ff.upload('/photos/upload', {...opt});
	}
	return ff.post('/statuses/update', {...opt});
};
