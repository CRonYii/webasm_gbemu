import React from 'react';
import { readFileAsBinary } from './utils';
import { startGameboy } from './gb';

class App extends React.Component {

    render() {
        return <div>
            <input id="rom-file" type="file" onChange={evt => this.onFileUploaded(evt.target)} />
        </div>
    }

    async onFileUploaded(romUpload) {
        if (romUpload.value === '') {
            return;
        }
        if (romUpload.files && romUpload.files.length >= 1) {
            const rom = await readFileAsBinary(romUpload.files[0]);
            startGameboy(rom);
        }
    }

}

export default App;