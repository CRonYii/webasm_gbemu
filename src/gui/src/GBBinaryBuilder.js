import { Button, Col, Row, Menu, Input, Popconfirm } from 'antd';
import { DeleteOutlined, RightSquareOutlined, EditOutlined } from '@ant-design/icons';
import React from 'react';
import { BinaryViewer } from './BinaryViewer';
import { launchGameboy } from './gb';
import { OpcodeEditor } from './OpcodeEditor';
import { OpcodeInput } from './OpcodeInput';
import { dataRange } from './utils';
import { subscribe } from './Stroage';

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

const populateLabels = (opcodes) => {
    const labels = [];
    let idx = 0x100;
    for (const op of opcodes) {
        if (op.type === 'label') {
            labels.push({ idx, label: op.label });
        }
        idx += op.size;
    }
    return labels;
}

// TODO: save in local storage, one-click run in emualtor
class GBBinaryBuilder extends React.Component {

    state = {
        name: '',
        opcodes: [],
        highlightBinary: false,
        binary: getBinary([]),
        labels: populateLabels([])
    }

    updateBinary = (opcodes) => {
        this.setState({
            opcodes,
            binary: getBinary(opcodes),
            binaryPosition: populateBinaryPosition(opcodes),
            labels: populateLabels(opcodes)
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

    setBinaryHighlight = (idx) => {
        if (idx !== false) {
            idx = this.state.binaryPosition[idx];
        }
        this.setState({
            highlightBinary: idx
        });
    }

    loadBinary = (name) => {
        const { container } = this.props;
        const opcodes = container.getBinary(name);
        this.updateBinary(opcodes);
        this.setState({ name });
    }

    runBinary = () => {
        let { binary } = this.state;
        binary = new Uint8Array([...binary].concat(...new Array((1 << 15) - binary.length).fill(0)));
        launchGameboy(binary);
    }

    render() {
        const { name, opcodes, labels, binary } = this.state;
        const { container } = this.props;
        const { storage } = container.state;

        return <div style={{
            width: "80em"
        }}>
            <Row gutter={48}>
                <Col span={4}>
                    <Row gutter={4}>
                        <Col span={18}><Input placeholder={'Name'} value={name} onChange={(evt) => this.setState({ name: evt.target.value })} /></Col>
                        <Col span={6}><Button type="primary" onClick={() => container.saveBinary(name, opcodes)}>Save</Button></Col>
                    </Row>
                    <Row>
                        Saved Binaries
                        <Col span={24}>
                            <SideMenu keys={storage.bin.names}
                                onLoad={this.loadBinary}
                                onDelete={() => container.deleteBinary(name)}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={20}>
                    <OpcodeInput labels={this.state.labels} onSubmit={this.addOpcode} dataInputStyle={{ marginLeft: '10px' }} />
                    <Row gutter={24}>
                        <Col span={16}>
                            <OpcodeEditor
                                opcodes={opcodes}
                                labels={labels}
                                updateBinary={this.updateBinary}
                                setBinaryHighlight={this.setBinaryHighlight} />
                        </Col>
                        <Col span={8}>
                            <BinaryViewer highlightBinary={this.state.highlightBinary} binary={binary.slice(0x100)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><Button onClick={this.runBinary}>Run</Button></Col>
                    </Row>
                </Col>
            </Row>
        </div>
    }

}

class SideMenu extends React.Component {

    renderMenuItem = (name) => {
        const { onLoad, onDelete } = this.props;
        return <Menu.SubMenu
            key={name}
            title={name}
        >
            <Menu.Item onClick={() => onLoad(name)}><RightSquareOutlined />Load</Menu.Item>
            <Menu.Item style={{ color: '#ff4d4f' }} onClick={() => onDelete(name)}><DeleteOutlined />Delete</Menu.Item>
        </Menu.SubMenu>
    }

    render() {
        const { keys } = this.props;
        return <Menu>
            {keys.map(this.renderMenuItem)}
        </Menu>;
    }

}

export default subscribe(GBBinaryBuilder);