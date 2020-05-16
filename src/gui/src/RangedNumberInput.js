import React from 'react';
import { Input, Button } from 'antd';
import { dataRange } from './utils';

const ARROW_UP = 38;
const ARROW_DOWN = 40;

export const dataInput = (datatype, props) => {
    if (!datatype) return;
    const { min, max, display } = dataRange[datatype];
    return <RangedNumberInput
        key={datatype} defaultDisplay="0x"
        min={min} max={max} display={display}
        {...props}
    />
}

export class RangedNumberInput extends React.Component {

    state = {
        value: this.props.defaultValue || '',
        display: this.props.defaultValue ?
            this.props.display(this.props.defaultValue) : this.props.defaultDisplay
    }

    getDisplay = (value) => {
        if (this.props.display) {
            return this.props.display(value);
        }
    }

    onPressEnter = () => {
        if (this.state.value == null) {
            return;
        }
        if (this.props.onPressEnter) {
            this.props.onPressEnter(this.state.value)
        }
        this.setState({
            value: this.props.defaultValue,
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
        if (this.props.onUpdate) {
            this.props.onUpdate(value);
        }
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
        const { min, max, style } = this.props;
        return <Input
            style={{ width: 200, ...style }}
            placeholder={`${min} ~ ${max}`}
            addonAfter={<Button type="link" size="small" onClick={this.onPressEnter}>{this.state.display}</Button>}
            value={this.state.value}
            onChange={evt => this.onChange(evt.target.value)}
            onPressEnter={this.onPressEnter}
            onKeyDown={this.onKeyPress}
        />
    }

}