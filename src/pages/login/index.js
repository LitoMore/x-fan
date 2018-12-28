import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Page, LoginScreenTitle, List, ListItem, Label, Input, ListButton, BlockFooter} from 'framework7-react';

class FanfouLogin extends React.Component {
	static propTypes = {
		login: PropTypes.func
	}

	static defaultProps = {
		login: () => {}
	}

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

	login = async () => {
		const {username, password} = this.state;
		const {login} = this.props;
		const auth = await login({username, password});
		if (auth === null) {
			this.$f7.dialog.alert('Username and password do not match', 'X-FAN');
		} else {
			this.$f7router.navigate('/messages/', {
				clearPreviousHistory: true
			});
		}
	}

	render() {
		return (
			<Page noToolbar noNavbar noSwipeback loginScreen>
				<LoginScreenTitle>X-FAN</LoginScreenTitle>
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
					{/* eslint-disable-next-line */}
					<BlockFooter>Code with ❤️️ by LitoMore</BlockFooter>
				</List>
			</Page>
		);
	}
}

const mapState = state => {
	const [current = {}] = state.user.accounts;
	return {
		current
	};
};

const mapDispatch = dispatch => {
	return {
		login: account => dispatch.user.login(account)
	};
};

export default connect(mapState, mapDispatch)(FanfouLogin);
