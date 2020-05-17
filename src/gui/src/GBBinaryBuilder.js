import { CloseOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Input, List, Popconfirm, Row, Tabs } from 'antd';
import React from 'react';
import { BinaryViewer } from './BinaryViewer';
import { OpcodeInput } from './OpcodeInput';
import { dataInput } from './RangedNumberInput';
import { dataRange, delaylock } from './utils';
import { launchGameboy } from './gb';

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

const getBinary = (opcodes) => {
    let binary = new Array(0x100).fill(0);
    for (const op of opcodes) {
        if (op.type === 'opcode')
            binary.push(...binaryFromOpcode(op));
    }
    return new Uint8Array(binary);
}

const populateBinaryPosition = (opcodes) => {
    let idx = 0;
    return opcodes.map((opcode) => {
        idx += opcode.size;
        return [idx - opcode.size, idx];
    });
}

// TODO: save in local storage, one-click run in emualtor
export class GBBinaryBuilder extends React.Component {

    state = {
        opcodes: [],
        highlightBinary: false,
        binary: getBinary([]),
        highlightlock: delaylock(10),
        page: 1
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
        const { highlightlock, page } = this.state;
        idx += (page - 1) * 16;
        if (op.type === 'opcode') {
            return <List.Item
                onMouseEnter={highlightlock(() => this.setBinaryHighlight(idx))}
                onMouseLeave={highlightlock(() => this.setBinaryHighlight(false))}
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

    updateBinary = (opcodes) => {
        this.setState({
            opcodes,
            binary: getBinary(opcodes),
            binaryPosition: populateBinaryPosition(opcodes)
        });
    }

    addOpcode = (opcode, idx) => {
        opcode.type = 'opcode';
        let { opcodes } = this.state;
        if (idx === undefined) idx = opcodes.length;
        opcodes = [...opcodes];
        opcodes.splice(idx, 0, opcode);
        this.updateBinary(opcodes);
    }

    addLabel = (label, idx) => {
        let { opcodes } = this.state;
        if (idx === undefined) idx = opcodes.length;
        opcodes = [...opcodes];
        opcodes.splice(idx, 0, {
            type: 'label',
            label,
            size: 0
        });
        this.updateBinary(opcodes);
    }

    labels = () => {
        const labels = [];
        const { opcodes } = this.state;
        let idx = 0x100;
        for (const op of opcodes) {
            if (op.type === 'label') {
                labels.push({ idx, label: op.label });
            }
            idx += op.size;
        }
        return labels;
    }

    removeOpcode = (idx) => {
        let { opcodes } = this.state;
        opcodes = [...opcodes];
        opcodes.splice(idx, 1);
        this.updateBinary(opcodes);
    }

    updateOpcode = (idx, op) => {
        let { opcodes } = this.state;
        opcodes = [...opcodes];
        opcodes[idx] = { ...opcodes[idx], ...op }
        this.updateBinary(opcodes);
    }

    swapOpocde = (idx, delta) => {
        let { opcodes } = this.state;
        opcodes = [...opcodes];
        const temp = opcodes[idx];
        opcodes[idx] = opcodes[idx + delta]
        opcodes[idx + delta] = temp;
        this.updateBinary(opcodes);
    }

    setBinaryHighlight = (idx) => {
        if (idx !== false) {
            idx = this.state.binaryPosition[idx];
        }
        this.setState({
            highlightBinary: idx
        });
    }

    runBinary = () => {
        let { binary } = this.state;
        binary = new Uint8Array([...binary].concat(...new Array((1 << 15) - binary.length).fill(0)));
        launchGameboy(binary);
    }

    render() {
        const { binary, page } = this.state;
        return <div style={{
            width: "80em"
        }}>
            <OpcodeInput labels={this.labels()} onSubmit={this.addOpcode} dataInputStyle={{ marginLeft: '10px' }} />
            <Row gutter={24}>
                <Col span={12}>
                    <List
                        pagination={{ pageSize: 16, current: page, onChange: (page) => this.setState({ page }) }}
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
                    <BinaryViewer highlightBinary={this.state.highlightBinary} binary={binary.slice(0x100)} />
                </Col>
            </Row>
            <Row>
                <Col><Button onClick={this.runBinary}>Run</Button></Col>
            </Row>
        </div>
    }

}