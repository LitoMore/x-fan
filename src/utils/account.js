export const getAccounts = () => {
	let accounts = [];
	try {
		accounts = JSON.parse(localStorage.getItem('accounts'));
	} catch (error) {}

	return accounts;
};

export const addAccount = account => {
	const accounts = getAccounts();
	const found = accounts.find(item => {
		return item.token.oauthToken === account.token.oauthToken && item.token.oauthTokenSecret === account.token.oauthTokenSecret;
	});
	if (found) {
		return;
	}

	accounts.push(account);
	localStorage.setItem('accounts', JSON.stringify(accounts));
};
