import { Button, Col, Row } from 'antd';
import React from 'react';
import { BinaryViewer } from './BinaryViewer';
import { launchGameboy } from './gb';
import { OpcodeEditor } from './OpcodeEditor';
import { OpcodeInput } from './OpcodeInput';
import { dataRange } from './utils';

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
export class GBBinaryBuilder extends React.Component {

    state = {
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

    runBinary = () => {
        let { binary } = this.state;
        binary = new Uint8Array([...binary].concat(...new Array((1 << 15) - binary.length).fill(0)));
        launchGameboy(binary);
    }

    render() {
        const { opcodes, labels, binary } = this.state;
        return <div style={{
            width: "80em"
        }}>
            <OpcodeInput labels={this.state.labels} onSubmit={this.addOpcode} dataInputStyle={{ marginLeft: '10px' }} />
            <Row gutter={24}>
                <Col span={12}>
                    <OpcodeEditor
                        opcodes={opcodes}
                        labels={labels}
                        updateBinary={this.updateBinary}
                        setBinaryHighlight={this.setBinaryHighlight} />
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