export const getAccounts = () => {
	try {
		const accounts = JSON.parse(localStorage.getItem('accounts'));
		return accounts || [];
	} catch (error) {
		return [];
	}
};

export const addAccount = account => {
	const accounts = getAccounts();
	const found = accounts.find(item => {
		return item.oauthToken === account.oauthToken && item.oauthTokenSecret === account.oauthTokenSecret;
	});
	if (found) {
		return;
	}
	accounts.push(account);
	localStorage.setItem('accounts', JSON.stringify(accounts));
};
