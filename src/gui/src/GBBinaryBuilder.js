import { CloseOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm, Row, Col } from 'antd';
import React from 'react';
import { OpcodeInput } from './OpcodeInput';
import { dataRange, toHexText } from './utils';
import { dataInput } from './RangedNumberInput';

// TODO: highlight binary, label for jumps, direct add above button
// TODO: save in local storage, one-click run in emualtor
export class GBBinaryBuilder extends React.Component {

    state = {
        opcodes: []
    }

    renderListItem = (op, idx) => {
        return <List.Item
            actions={[
                <Button disabled={idx === 0} onClick={() => this.swapOpocde(idx, -1)} type="primary" shape="round" size="small"><UpOutlined /></Button>,
                <Button disabled={idx === this.state.opcodes.length - 1} onClick={() => this.swapOpocde(idx, 1)} type="primary" shape="round" size="small"><DownOutlined /></Button>,
                <Button onClick={() => this.removeOpcode(idx)} type="primary" danger shape="round" size="small"><CloseOutlined /></Button>
            ]}
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
    }

    addOpcode = (opcode) => {
        this.setState(({ opcodes }) => ({
            opcodes: [...opcodes, opcode]
        }));
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
            const { opcode, datatype, data } = op;
            binary.push(opcode);
            if (datatype) {
                const toByte = dataRange[datatype].toByte || ((val) => [val]);
                for (const byte of toByte(data)) {
                    binary.push(byte);
                }
            }
        }
        return new Uint8Array(binary);
    }

    render() {
        return <div style={{
            width: "80em"
        }}>
            <OpcodeInput onSubmit={this.addOpcode} />
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
                            width: '30em',
                            fontSize: '12px',
                            fontFamily: 'Consolas'
                        }}
                        grid={{
                            column: 16
                        }}
                        dataSource={this.getBinary()}
                        renderItem={(data) => <List.Item>{toHexText(data, 2)}</List.Item>}
                    >
                    </List>
                </Col>
            </Row>
        </div>
    }

}