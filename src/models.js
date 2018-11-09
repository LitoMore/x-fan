import {xauth, getHomeTimeline, postStatus} from './utils/fanfou';

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
		},
		appendStatus(state, status) {
			const timeline = state.timeline.concat(status);
			return {
				...state,
				timeline
			};
		}
	},
	effects: {
		async fetch(opt) {
			const timeline = await getHomeTimeline(opt);
			const messages = [];
			timeline
				.reverse()
				.forEach(status => {
					if (status.isOrigin()) {
						messages.push({
							id: status.id,
							name: status.user.name,
							type: status.is_self ? 'sent' : 'received',
							text: status.plain_text,
							avatar: status.user.profile_image_origin_large
						});
						if (status.photo) {
							messages.push({
								id: status.id + '-photo',
								type: status.is_self ? 'sent' : 'received',
								avatar: status.user.profile_image_origin_large,
								name: status.user.name,
								image: status.photo.originurl
							});
						}
					}
				});
			this.setTimeline(messages);
			return messages;
		},
		async post(opt) {
			const status = await postStatus({...opt});
			if (status.error) {
				return status;
			}
			const messages = [];
			messages.push({
				id: status.id,
				name: status.user.name,
				type: status.is_self ? 'sent' : 'received',
				text: status.plain_text,
				avatar: status.user.profile_image_origin_large
			});
			if (status.photo) {
				messages.push({
					id: status.id + '-photo',
					type: status.is_self ? 'sent' : 'received',
					avatar: status.user.profile_image_origin_large,
					name: status.user.name
				});
			}
			this.appendStatus(messages);
			return messages;
		}
	}
};
