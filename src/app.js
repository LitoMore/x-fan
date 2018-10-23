import React from 'react';
import {App, View} from 'framework7-react';
import Login from './pages/login';
import Messages from './pages/messages'

const f7Params = {
	name: 'Fanfou',
	id: 'com.litomore.xfanfou',
	routes: [
		{
			path: '/',
			component: Login
		}, {
			path: '/messages/',
			component: Messages
		}
	]
};

export default class extends React.Component {
	render() {
		return (
			<App params={f7Params}>
				<View main url="/"/>
			</App>
		);
	}
}
