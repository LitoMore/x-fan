import React from 'react';
import {Page, LoginScreenTitle, List, ListItem, Label, Input, ListButton, BlockFooter} from 'framework7-react';
import {xauth} from '../utils/fanfou';
import {addAccount} from '../utils/account';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

login = async () => {
	const {username, password} = this.state;
	const {oauthToken, oauthTokenSecret} = await xauth(username, password);
	if (oauthToken && oauthTokenSecret) {
		addAccount({oauthToken, oauthTokenSecret});
	}
}

render() {
	return (
		<Page noToolbar noNavbar noSwipeback loginScreen>
			<LoginScreenTitle>Fanfou</LoginScreenTitle>
			<List form>
				<ListItem>
					<Label>Username</Label>
					<Input type="text" placeholder="Your username" onInput={e => {
						this.setState({username: e.target.value});
					}}
					/>
				</ListItem>
				<ListItem>
					<Label>Password</Label>
					<Input type="password" placeholder="Your password" onInput={e => {
						this.setState({password: e.target.value});
					}}
					/>
				</ListItem>
			</List>
			<List>
				<ListButton onClick={this.login}>Sign In</ListButton>
				<BlockFooter>Code with <span role="img" aria-label="love">❤️</span>️ by LitoMore</BlockFooter>
			</List>
		</Page>
	);
}
}
