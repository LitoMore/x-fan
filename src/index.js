import React from 'react';
import ReactDOM from 'react-dom';
import F7 from 'framework7/framework7.esm.bundle';
import F7React from 'framework7-react';
import App from './app';
import * as serviceWorker from './service-worker';
import 'framework7/css/framework7.min.css';
import 'framework7-icons/css/framework7-icons.css'

F7.use(F7React);

ReactDOM.render(<App/>, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
