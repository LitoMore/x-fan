import {xauth} from '../utils/fanfou';

// Read accounts from localStorage
let accounts = [];
try {
	accounts = JSON.parse(localStorage.getItem('accounts')) || [];
} catch (_) {}

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
