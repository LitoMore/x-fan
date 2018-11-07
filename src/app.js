import React from 'react';
import {connect} from 'react-redux';
import {App, View} from 'framework7-react';
import Login from './pages/login';
import Messages from './pages/messages';

const f7Params = {
	name: 'Fanfou',
	id: 'com.litomore.xfanfou',
	routes: [
		{
			name: 'messages',
			path: '/messages/',
			component: Messages
		}, {
			name: 'login',
			path: '/login/',
			component: Login
		}
	]
};

class FanfouApp extends React.Component {
	render() {
		return (
			<App params={f7Params}>
				<View main url="/messages/"/>
			</App>
		);
	}
}

const mapState = state => {
	const [current] = state.user.accounts;
	return {current};
};

export default connect(mapState)(FanfouApp);
