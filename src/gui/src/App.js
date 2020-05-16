import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { startGameboy } from './gb';
import { readFileAsBinary } from './utils';
import { GBBinaryBuilder } from './GBBinaryBuilder';
import { MemoryInspector } from './MemoryInspector';
import { subscribe } from '.';

class App extends React.Component {

    render() {
        const { gb_ptr } = this.props.container.state;
        return <div>
            <Upload
                transformFile={readFileAsBinary}
                customRequest={({ file: rom }) => startGameboy(rom)}
            >
                <Button><UploadOutlined /> Choose a ROM</Button>
            </Upload>
            {gb_ptr ? <MemoryInspector memory_address={0x100} gb_ptr={gb_ptr} /> : null}
            <GBBinaryBuilder />
        </div>
    }

}

export default subscribe(App);