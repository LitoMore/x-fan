import {xauth, getHomeTimeline, postStatus} from './utils/fanfou';

// Read accounts from localStorage
let accounts = [];
try {
	accounts = JSON.parse(localStorage.getItem('accounts')) || [];
} catch (_) {}

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
		},
		logout() {
			return {
				accounts: []
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
		loading: null,
		sending: null,
		typing: false,
		timeline: []
	},
	reducers: {
		setLoading(state, loading) {
			return {
				...state,
				loading
			};
		},
		setSending(state, sending) {
			return {
				...state,
				sending
			};
		},
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
		},
		clearTimeline() {
			return {
				loading: null,
				sending: null,
				typing: false,
				timeline: []
			};
		}
	},
	effects: {
		async fetch(opt, state) {
			const {timeline: tl} = state.homeTimeline;
			if (tl.length === 0) {
				this.setLoading({
					header: 'Loading',
					avatar: '/x-fan.png'
				});
			}

			const timeline = await getHomeTimeline(opt);
			const messages = [];
			timeline
				.reverse()
				.forEach(status => {
					if (status.isOrigin()) {
						if (status.photo) {
							messages.push({
								id: status.id + '-photo',
								rawId: status.rawid,
								type: status.is_self ? 'sent' : 'received',
								avatar: status.user.profile_image_origin_large,
								name: status.user.name,
								image: status.photo.originurl
							});
						}

						if (status.text !== '' && status.text !== '上传了新照片') {
							messages.push({
								id: status.id,
								rawId: status.rawid,
								name: status.user.name,
								type: status.is_self ? 'sent' : 'received',
								text: status.plain_text,
								avatar: status.user.profile_image_origin_large
							});
						}
					}
				});
			if (tl.length === 0) {
				this.setLoading(null);
				this.setTimeline(messages);
			} else {
				const latest = messages[messages.length - 1].rawId;
				const last = tl[tl.length - 1].rawId;
				if (latest > last) {
					const letterCount = messages[messages.length - 1].text.length;
					const time = 1000 + parseInt((letterCount + 1) / 140 * 4000, 10);
					this.setLoading({
						header: messages[messages.length - 1].name,
						avatar: messages[messages.length - 1].avatar
					});
					setTimeout(() => {
						this.setLoading(null);
						this.setTimeline(messages);
					}, time);
				} else {
					return messages;
				}
			}

			return messages;
		},
		async post(opt) {
			this.setSending(opt);
			const status = await postStatus({...opt});
			if (status.error) {
				this.setSending(null);
				return status;
			}

			const messages = [];
			if (status.photo) {
				messages.push({
					id: status.id + '-photo',
					rawId: status.rawid,
					type: status.is_self ? 'sent' : 'received',
					avatar: status.user.profile_image_origin_large,
					name: status.user.name,
					image: status.photo.originurl
				});
			}

			if (status.text !== '' && status.text !== '上传了新照片') {
				messages.push({
					id: status.id,
					rawId: status.rawid,
					name: status.user.name,
					type: status.is_self ? 'sent' : 'received',
					text: status.plain_text,
					avatar: status.user.profile_image_origin_large
				});
			}

			this.setSending(null);
			this.appendStatus(messages);
			return messages;
		}
	}
};
