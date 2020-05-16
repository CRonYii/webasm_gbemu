import React from 'react';
import { allocateMemory, inspectMemory, freeMemory } from './gb';
import { BinaryViewer } from './BinaryViewer';
import { heap } from './ASMMemory';

const MEMORY_BUFFER_SIZE = 16 * 16;

export class MemoryInspector extends React.Component {

    state = {
        memory_buffer_ptr: null,
        memory_buffer: new Uint8Array()
    }

    componentDidMount() {
        const memory_buffer_ptr = allocateMemory(MEMORY_BUFFER_SIZE);
        this.setState({ memory_buffer_ptr }, () => this.inspectMemory());
    }

    componentWillUnmount() {
        freeMemory(this.state.memory_buffer_ptr);
    }

    inspectMemory(mememory_address) {
        const { gb_ptr } = this.props;
        const { memory_buffer_ptr } = this.state;
        inspectMemory(gb_ptr, mememory_address, memory_buffer_ptr, MEMORY_BUFFER_SIZE);
        return new Uint8Array(heap.slice(memory_buffer_ptr, memory_buffer_ptr + MEMORY_BUFFER_SIZE));
    }

    render() {
        const { memory_address, highlightBinary } = this.props;
        const memory_buffer = this.inspectMemory(memory_address);
        return <BinaryViewer binary={memory_buffer} highlightBinary={highlightBinary} />
    }

}