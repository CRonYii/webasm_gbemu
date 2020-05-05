import React from 'react';
import { Input } from 'antd';

const ARROW_UP = 38;
const ARROW_DOWN = 40;

export class RangedNumberInput extends React.Component {

    state = {
        value: null,
        display: this.props.defaultDisplay || null
    }

    getDisplay = (value) => {
        if (this.props.display) {
            return this.props.display(value);
        }
    }

    onPressEnter = () => {
        if (this.props.onPressEnter) {
            this.props.onPressEnter(this.state.value)
        }
        this.setState({
            value: null,
            display: this.props.defaultDisplay
        });
    }

    updateValue = (value) => {
        const { min, max } = this.props;
        value = Math.max(value, min);
        value = Math.min(value, max);
        this.setState({
            value,
            display: this.getDisplay(value)
        });
    }

    onChange = (value) => {
        if (value === '' || value === '-') {
            this.setState({
                value
            });
            return;
        }
        const idx = value.indexOf('-');
        if (idx >= 0 && idx === value.lastIndexOf('-')) {
            value = '-' + value.substring(0, idx) + value.substring(idx + 1);
        }
        if (value === '-0') {
            this.setState({
                value: '-'
            });
            return;
        }
        value = Number(value);
        if (isNaN(value)) {
            return;
        }
        this.updateValue(value);
    }

    onKeyPress = (key) => {
        switch (key.keyCode) {
            case ARROW_UP: return this.updateValue(this.state.value + 1);
            case ARROW_DOWN: return this.updateValue(this.state.value - 1);
            default: return;
        }
    }

    render() {
        const { min, max } = this.props;
        return <Input
            style={{ width: 200 }}
            placeholder={`${min} ~ ${max}`}
            addonAfter={this.state.display}
            value={this.state.value}
            onChange={evt => this.onChange(evt.target.value)}
            onPressEnter={this.onPressEnter}
            onKeyDown={this.onKeyPress}
        />
    }

}