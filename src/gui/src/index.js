import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'unstated';
import App from './App';
import { message } from 'antd';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);

window.print_error = function(msg) {
    message.error(msg);
}