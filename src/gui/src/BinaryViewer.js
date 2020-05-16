import React from 'react';
import { toHexText } from './utils';
import { List, Row, Col } from 'antd';

const COLUMN_PER_ROW = 16;

export class BinaryViewer extends React.Component {

    renderBinaryItem = (data, idx) => {
        const highlight = this.props.highlightBinary;
        let style = {
            padding: '3px', borderRadius: '2px'
        };
        if (highlight && idx >= highlight[0] && idx < highlight[1]) {
            style = { ...style, backgroundColor: '#428bca', color: 'white' };
        }
        return <List.Item><span style={style}>{toHexText(data, 2)}</span></List.Item>;
    }

    renderBinary = (data) => {
        const rows = [];
        for (let i = 0; i < data.length; i += COLUMN_PER_ROW) {
            rows.push(data.slice(i, i + COLUMN_PER_ROW));
        }
        return rows.map(this.renderBinaryRow);
    }

    renderBinaryRow = (data, rowidx) => {
        const highlight = this.props.highlightBinary;
        data = [...data]
        return <Row gutter={4} key={rowidx}>
            {
                data.map((i, idx) => {
                    let style = {
                        padding: '3px', borderRadius: '2px'
                    };
                    const realidx = rowidx * 16 + idx;
                    if (highlight && realidx >= highlight[0] && realidx < highlight[1]) {
                        style = { ...style, backgroundColor: '#428bca', color: 'white' };
                    }
                    return <Col span={1.5} key={idx}><span style={style}>{toHexText(i, 2)}</span></Col>;
                })
            }
        </Row>
    }

    render() {
        const { binary } = this.props;
        return <div
            style={{
                fontSize: '12px',
                fontFamily: 'Consolas',
                borderColor: 'rgb(217,217,217)',
                borderRadius: '2px',
                borderStyle: 'solid',
                borderWidth: '1px',
                width: '32.5em',
                padding: '10px',
                minHeight: '166px'
            }}
        >{this.renderBinary(binary)}</div>;
    }

}