import { CloseOutlined, UpOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm, Row, Col, Tabs, Input } from 'antd';
import React from 'react';
import { OpcodeInput } from './OpcodeInput';
import { dataRange, toHexText } from './utils';
import { dataInput } from './RangedNumberInput';

const binaryFromOpcode = (op) => {
    const binary = [];
    const { opcode, datatype, data } = op;
    binary.push(opcode);
    if (datatype) {
        const toByte = dataRange[datatype].toByte || ((val) => [val]);
        for (const byte of toByte(data)) {
            binary.push(byte);
        }
    }
    return binary;
}

// TODO: save in local storage, one-click run in emualtor
export class GBBinaryBuilder extends React.Component {

    state = {
        opcodes: [],
        highlightBinary: false
    }

    opcode_actions = (idx) => [
        <Popconfirm
            icon={null} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
            title={
                <Tabs style={{ width: 200 }}>
                    <Tabs.TabPane tab="Add Opcode" key="1">
                        <OpcodeInput labels={this.labels()} onSubmit={op => this.addOpcode(op, idx)} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Add Label" key="2">
                        <Input onPressEnter={(evt) => this.addLabel(evt.target.value, idx)} />
                    </Tabs.TabPane>
                </Tabs>
            }
        ><Button type="primary" shape="round" size="small"><PlusOutlined /></Button></Popconfirm>,
        <Button disabled={idx === 0} onClick={() => this.swapOpocde(idx, -1)} type="primary" shape="round" size="small"><UpOutlined /></Button>,
        <Button disabled={idx === this.state.opcodes.length - 1} onClick={() => this.swapOpocde(idx, 1)} type="primary" shape="round" size="small"><DownOutlined /></Button>,
        <Button onClick={() => this.removeOpcode(idx)} type="primary" danger shape="round" size="small"><CloseOutlined /></Button>
    ];

    renderListItem = (op, idx) => {
        if (op.type === 'opcode') {
            return <List.Item
                onMouseEnter={() => this.setBinaryHighlight(idx)}
                onMouseLeave={() => this.setBinaryHighlight(false)}
                actions={this.opcode_actions(idx)}
            >
                <b>{op.label}</b> {typeof op.data === 'number' ?
                    <Popconfirm
                        icon={null}
                        title={dataInput(op.datatype, { key: op.data, defaultValue: op.data, onPressEnter: (data) => this.updateOpcode(idx, { data }) })}
                        okButtonProps={{ style: { display: 'none' } }}
                        cancelButtonProps={{ style: { display: 'none' } }}
                    >
                        <Button size="small">{`${op.data}(${dataRange[op.datatype].display(op.data)})`}</Button>
                    </Popconfirm>
                    : null}
            </List.Item>
        } else if (op.type === 'label') {
            return <List.Item
                actions={this.opcode_actions(idx)}
            >
                <b style={{ color: '#597cde' }}>{op.label}:</b>
            </List.Item>
        }
    }

    renderBinaryItem = (data, idx) => {
        const highlight = this.state.highlightBinary;
        let style = {
            padding: '3px', borderRadius: '2px'
        };
        if (highlight && idx >= highlight[0] && idx < highlight[1]) {
            style = { ...style, backgroundColor: '#428bca', color: 'white' };
        }
        return <List.Item><span style={style}>{toHexText(data, 2)}</span></List.Item>;
    }

    addOpcode = (opcode, idx) => {
        opcode.type = 'opcode';
        this.setState(({ opcodes }) => {
            if (idx === undefined) idx = opcodes.length;
            opcodes = [...opcodes];
            opcodes.splice(idx, 0, opcode);
            return { opcodes };
        });
    }

    addLabel = (label, idx) => {
        this.setState(({ opcodes }) => {
            if (idx === undefined) idx = opcodes.length;
            opcodes = [...opcodes];
            opcodes.splice(idx, 0, {
                type: 'label',
                label,
                size: 0
            });
            return { opcodes };
        });
    }

    labels = () => {
        const labels = [];
        const { opcodes } = this.state;
        let idx = 0;
        for (const op of opcodes) {
            if (op.type === 'label') {
                labels.push({ idx, label: op.label });
            }
            idx += op.size;
        }
        return labels;
    }

    removeOpcode = (idx) => {
        this.setState(({ opcodes }) => {
            opcodes = [...opcodes];
            opcodes.splice(idx, 1);
            return { opcodes };
        });
    }

    updateOpcode = (idx, op) => {
        this.setState(({ opcodes }) => {
            opcodes = [...opcodes];
            opcodes[idx] = { ...opcodes[idx], ...op }
            return { opcodes };
        });
    }

    swapOpocde = (idx, delta) => {
        this.setState(({ opcodes }) => {
            opcodes = [...opcodes];
            const temp = opcodes[idx];
            opcodes[idx] = opcodes[idx + delta]
            opcodes[idx + delta] = temp;
            return { opcodes };
        });
    }

    getBinary = () => {
        let binary = [];
        for (const op of this.state.opcodes) {
            if (op.type === 'opcode')
                binary.push(...binaryFromOpcode(op));
        }
        return new Uint8Array(binary);
    }

    setBinaryHighlight = (idx) => {
        if (idx !== false) {
            const { opcodes } = this.state;
            let from = 0;
            for (let i = 0; i < idx; i++) {
                from += opcodes[i].size;
            }
            idx = [from, from + opcodes[idx].size];
        }
        this.setState({
            highlightBinary: idx
        });
    }

    render() {
        return <div style={{
            width: "80em"
        }}>
            <OpcodeInput labels={this.labels()} onSubmit={this.addOpcode} dataInputStyle={{ marginLeft: '10px' }} />
            <Row gutter={24}>
                <Col span={12}>
                    <List
                        size="small"
                        bordered
                        style={{
                            fontFamily: 'Consolas',
                            minHeight: '166px'
                        }}
                        dataSource={this.state.opcodes}
                        renderItem={this.renderListItem}
                    >
                    </List>
                </Col>
                <Col span={12}>
                    <List
                        size="small"
                        bordered
                        style={{
                            width: '32em',
                            fontSize: '12px',
                            fontFamily: 'Consolas'
                        }}
                        grid={{
                            column: 16
                        }}
                        dataSource={this.getBinary()}
                        renderItem={this.renderBinaryItem}
                    >
                    </List>
                </Col>
            </Row>
        </div>
    }

}