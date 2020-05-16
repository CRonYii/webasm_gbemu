import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider, Subscribe, Container } from 'unstated';

class GBContainer extends Container {

    state = {
        gb: null,
        gb_ptr: null,
    }

    setGB(gb_ptr, gb) {
        this.setState({ gb_ptr, gb });
    }

}

export const gbcontainer = new GBContainer();

export function subscribe(Component) {
    return (props) =>
        <Subscribe to={[gbcontainer]}>
            {container => <Component {...props} container={container} />}
        </Subscribe>;
};

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById('root')
);