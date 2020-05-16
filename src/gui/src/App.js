import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { startGameboy } from './gb';
import { readFileAsBinary } from './utils';
import { GBBinaryBuilder } from './GBBinaryBuilder';

class App extends React.Component {

    render() {
        return <div>
            <Upload
                transformFile={readFileAsBinary}
                customRequest={({ file: rom }) => startGameboy(rom)}
            >
                <Button><UploadOutlined /> Choose a ROM</Button>
            </Upload>
            <GBBinaryBuilder />
        </div>
    }

}

export default App;