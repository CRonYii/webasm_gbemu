import React from 'react';
import { Descriptions } from 'antd';
import { toHexText } from './utils';

export class CPUDisplay extends React.Component {

    render() {
        const { cpu } = this.props;

        return <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="PC">0x{toHexText(cpu.PC, 4)}</Descriptions.Item>
            <Descriptions.Item label="SP">0x{toHexText(cpu.SP, 4)}</Descriptions.Item>
            <Descriptions.Item label="AF">0x{toHexText((cpu.A << 8) + cpu.F, 4)}</Descriptions.Item>
            <Descriptions.Item label="BC">0x{toHexText((cpu.B << 8) + cpu.C, 4)}</Descriptions.Item>
            <Descriptions.Item label="DE">0x{toHexText((cpu.D << 8) + cpu.E, 4)}</Descriptions.Item>
            <Descriptions.Item label="HL">0x{toHexText((cpu.H << 8) + cpu.L, 4)}</Descriptions.Item>
        </Descriptions>
    }

}