import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {App, View, Statusbar} from 'framework7-react';
import Login from './pages/login';
import Messages from './pages/messages';
import Settings from './pages/settings';

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
		}, {
			name: 'settings',
			path: '/settings/',
			component: Settings
		}
	],
	theme: window.navigator.platform === 'MacIntel' ? 'ios' : 'auto',
	statusbar: {
		overlay: 'standalone' in window.navigator &&
			window.navigator.standalone &&
			document
				.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
				.getAttribute('content')
				.indexOf('translucent') >= 0
	}
};

class FanfouApp extends React.Component {
	static propTypes = {
		current: PropTypes.object
	}

	static defaultProps = {
		current: null
	}

	componentDidMount() {
		const welcomeLogo = document.getElementById('welcome-logo');
		if (welcomeLogo) {
			welcomeLogo.style.display = 'none';
		}
	}

	render() {
		const {current} = this.props;

		return (
			<App params={f7Params}>
				<Statusbar/>
				<View main url={current ? '/messages/' : '/login/'}/>
			</App>
		);
	}
}

const mapState = state => {
	const [current] = state.user.accounts;
	return {current};
};

export default connect(mapState)(FanfouApp);
