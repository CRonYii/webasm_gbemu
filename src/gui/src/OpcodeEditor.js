import { CloseOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Input, List, Popconfirm, Tabs } from 'antd';
import React from 'react';
import { OpcodeInput } from './OpcodeInput';
import { dataInput } from './RangedNumberInput';
import { dataRange, delaylock } from './utils';

export class OpcodeEditor extends React.Component {

    state = {
        highlightlock: delaylock(10),
        page: 1
    }

    opcode_actions = (idx) => [
        <Popconfirm
            icon={null} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
            title={
                <Tabs style={{ width: 200 }}>
                    <Tabs.TabPane tab="Add Opcode" key="1">
                        <OpcodeInput labels={this.props.labels} onSubmit={op => this.addOpcode(op, idx)} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Add Label" key="2">
                        <Input onPressEnter={(evt) => this.addLabel(evt.target.value, idx)} />
                    </Tabs.TabPane>
                </Tabs>
            }
        ><Button type="primary" shape="round" size="small"><PlusOutlined /></Button></Popconfirm>,
        <Button disabled={idx === 0} onClick={() => this.swapOpocde(idx, -1)} type="primary" shape="round" size="small"><UpOutlined /></Button>,
        <Button disabled={idx === this.props.opcodes.length - 1} onClick={() => this.swapOpocde(idx, 1)} type="primary" shape="round" size="small"><DownOutlined /></Button>,
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
        this.props.updateBinary(opcodes);
    }

    addOpcode = (opcode, idx) => {
        opcode.type = 'opcode';
        let { opcodes } = this.props;
        if (idx === undefined) idx = opcodes.length;
        opcodes = [...opcodes];
        opcodes.splice(idx, 0, opcode);
        this.updateBinary(opcodes);
    }

    addLabel = (label, idx) => {
        let { opcodes } = this.props;
        if (idx === undefined) idx = opcodes.length;
        opcodes = [...opcodes];
        opcodes.splice(idx, 0, {
            type: 'label',
            label,
            size: 0
        });
        this.updateBinary(opcodes);
    }

    removeOpcode = (idx) => {
        let { opcodes } = this.props;
        opcodes = [...opcodes];
        opcodes.splice(idx, 1);
        this.updateBinary(opcodes);
    }

    updateOpcode = (idx, op) => {
        let { opcodes } = this.props;
        opcodes = [...opcodes];
        opcodes[idx] = { ...opcodes[idx], ...op }
        this.updateBinary(opcodes);
    }

    swapOpocde = (idx, delta) => {
        let { opcodes } = this.props;
        opcodes = [...opcodes];
        const temp = opcodes[idx];
        opcodes[idx] = opcodes[idx + delta]
        opcodes[idx + delta] = temp;
        this.updateBinary(opcodes);
    }

    setBinaryHighlight = (idx) => {
        this.props.setBinaryHighlight(idx);
    }

    render() {
        const { page } = this.state;
        return <List
            pagination={{ pageSize: 16, current: page, onChange: (page) => this.setState({ page }),  showSizeChanger: false }}
            size="small"
            bordered
            style={{
                fontFamily: 'Consolas',
                minHeight: '166px'
            }}
            dataSource={this.props.opcodes}
            renderItem={this.renderListItem}
        >
        </List>
    }

}