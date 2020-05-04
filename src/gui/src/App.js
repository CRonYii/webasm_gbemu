import React from 'react';
import { readFileAsBinary } from './utils';
import { startGameboy } from './gb';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

class App extends React.Component {

    render() {
        return <div>
            <Upload
                transformFile={readFileAsBinary}
                customRequest={({ file: rom }) => startGameboy(rom)}
            >
                <Button><UploadOutlined /> Choose a ROM</Button>
            </Upload>
        </div>
    }

}

export default App;