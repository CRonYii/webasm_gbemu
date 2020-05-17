import React from 'react';
import { Container, Subscribe } from 'unstated';
import { message } from 'antd';

// Local Storage
const initialStorage = {
    bin: {
        names: [],
    }
};

class GBContainer extends Container {

    state = {
        id: 0,
        gb: null,
        gb_ptr: null,
        storage: JSON.parse(localStorage.getItem('storage')) || initialStorage,
    }

    setGB(gb_ptr, gb) {
        this.setState({ gb_ptr, gb });
    }

    saveBinary(name, opcodes) {
        const { bin } = this.state.storage;
        if (bin.names.indexOf(name) === -1) {
            bin.names.push(name);
        }
        bin[name] = opcodes;
        this.saveStorage();
        message.success('Saved!');
    }

    getBinary(name) {
        const { bin } = this.state.storage;
        return bin[name];
    }

    deleteBinary(name) {
        const { bin } = this.state.storage;
        const idx = bin.names.indexOf(name);
        bin.names.splice(idx, 1);
        bin[name] = undefined;
        this.saveStorage();
        message.success('Deleted!');
    }

    binaryNames() {
        const { bin } = this.state.storage;
        return bin.names;
    }

    saveStorage() {
        this.setState({
            storage: { ...this.state.storage }
        });
        localStorage.setItem('storage', JSON.stringify(this.state.storage));
    }

}

export const gbcontainer = new GBContainer();

export function subscribe(Component) {
    return (props) =>
        <Subscribe to={[gbcontainer]}>
            {container => <Component {...props} container={container} />}
        </Subscribe>;
};