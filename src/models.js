import {xauth, getHomeTimeline} from './utils/fanfou';

// Read accounts from localStorage
let accounts = [];
try {
	accounts = JSON.parse(localStorage.getItem('accounts')) || [];
} catch (error) {}

// User
export const user = {
	state: {accounts},
	reducers: {
		addAccount(state, auth) {
			let accounts = state.accounts.slice();
			accounts = accounts.filter(item => {
				return item.profile.unique_id !== auth.profile.unique_id;
			});
			accounts.unshift(auth);
			localStorage.setItem('accounts', JSON.stringify(accounts));
			return {
				...state,
				accounts
			};
		}
	},
	effects: {
		async login(account) {
			const {username, password} = account;
			const auth = await xauth(username, password);
			if (auth) {
				this.addAccount(auth);
			}
			return auth;
		}
	}
};

// Home Timeline
export const homeTimeline = {
	state: {
		timeline: []
	},
	reducers: {
		setTimeline(state, timeline) {
			return {
				...state,
				timeline
			};
		}
	},
	effects: {
		async fetch(opt) {
			const timeline = await getHomeTimeline(opt);
			const messages = timeline.reverse().map(status => {
				return {
					id: status.id,
					name: status.user.name,
					type: status.is_self ? 'sent' : 'received',
					text: status.plain_text,
					avatar: status.profile_image_origin_large
				};
			});
			this.setTimeline(messages);
			return messages;
		}
	}
};
