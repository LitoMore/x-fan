import React from 'react';
import ReactDOM from 'react-dom';
import {init} from '@rematch/core';
import {Provider} from 'react-redux';
import F7 from 'framework7/framework7.esm.bundle';
import F7React from 'framework7-react';
import * as models from './rematch';
import App from './app';
import * as serviceWorker from './service-worker';
import 'framework7/css/framework7.min.css';
import 'framework7-icons/css/framework7-icons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import './index.css';

// Framework7 initialize
F7.use(F7React);

// Generate Redux store
const store = init({
	models
});

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.querySelector('#app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
