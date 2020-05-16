import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Row, Col, Collapse } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { launchGameboy } from './gb';
import { readFileAsBinary } from './utils';
import { GBBinaryBuilder } from './GBBinaryBuilder';
import { MemoryInspector } from './MemoryInspector';
import { subscribe } from '.';
import { CPUDisplay } from './CPUDisplay';

class App extends React.Component {

    debugger() {
        const { gb_ptr, gb } = this.props.container.state;
        if (!gb_ptr) return;
        return <Collapse.Panel header="Debugger">
            <Row gutter={24}>
                <Col span={12}><CPUDisplay cpu={gb.deref('cpu')} /></Col>
                <Col span={12}><MemoryInspector memory_address={0x100} gb_ptr={gb_ptr} /></Col>
            </Row>
        </Collapse.Panel>
    }

    render() {
        return <div>
            <Upload
                transformFile={readFileAsBinary}
                customRequest={({ file: rom }) => launchGameboy(rom)}
                showUploadList={false}
            >
                <Button><UploadOutlined /> Choose a ROM</Button>
            </Upload>
            <Collapse>
                {this.debugger()}
                <Collapse.Panel header="Binary Builder"><GBBinaryBuilder /></Collapse.Panel>
            </Collapse>
        </div>
    }

}

export default subscribe(App);