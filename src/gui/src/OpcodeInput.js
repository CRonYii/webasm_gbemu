import { Select } from 'antd';
import React from 'react';
import { dataInput } from './RangedNumberInput';

const { Option } = Select;

const datasize = {
    'uint16': 2,
    'uint8': 1,
    'int8': 1,
    'null': 0
}

export class OpcodeInput extends React.Component {

    state = {
        label: null,
        data: null,
        opcode: null,
        datatype: null
    }

    onFinish = () => {
        if (this.props.onSubmit) {
            const { label, data, opcode, datatype } = this.state;
            const size = 1 + datasize[datatype];
            this.props.onSubmit({
                label,
                opcode,
                data,
                datatype,
                size
            });
        }
    }

    filterOption = (input, option) => {
        if (!isNaN(Number(input))) {
            return Number(option.value) === Number(input);
        }

        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    onSelectOpcode = (opcode) => {
        const [code, label] = opcode.split(':');
        opcode = Number(code);
        const datatype = OPCODES_DATA[opcode];
        this.setState(
            {
                label,
                opcode,
                datatype,
                data: null
            },
            () => {
                if (datatype === null) {
                    this.onFinish();
                }
            }
        );
    }

    dataInput = () => {
        const { datatype } = this.state;
        return dataInput(datatype, { onUpdate: (data) => this.setState({ data }), onPressEnter: this.onFinish, style: { marginLeft: '10px' } });
    }

    render() {
        return <div>
            <Select
                showSearch
                style={{ width: 200 }}
                onSelect={this.onSelectOpcode}
                filterOption={this.filterOption}
            >
                <Option key="0" value="0:NOP">NOP</Option>
                <Option key="1" value="1:LD BC,d16">LD BC,d16</Option>
                <Option key="2" value="2:LD (BC),A">LD (BC),A</Option>
                <Option key="3" value="3:INC BC">INC BC</Option>
                <Option key="4" value="4:INC B">INC B</Option>
                <Option key="5" value="5:DEC B">DEC B</Option>
                <Option key="6" value="6:LD B,d8">LD B,d8</Option>
                <Option key="7" value="7:RLCA">RLCA</Option>
                <Option key="8" value="8:LD (a16),SP">LD (a16),SP</Option>
                <Option key="9" value="9:ADD HL,BC">ADD HL,BC</Option>
                <Option key="10" value="10:LD A,(BC)">LD A,(BC)</Option>
                <Option key="11" value="11:DEC BC">DEC BC</Option>
                <Option key="12" value="12:INC C">INC C</Option>
                <Option key="13" value="13:DEC C">DEC C</Option>
                <Option key="14" value="14:LD C,d8">LD C,d8</Option>
                <Option key="15" value="15:RRCA">RRCA</Option>
                <Option key="16" value="16:STOP 0">STOP 0</Option>
                <Option key="17" value="17:LD DE,d16">LD DE,d16</Option>
                <Option key="18" value="18:LD (DE),A">LD (DE),A</Option>
                <Option key="19" value="19:INC DE">INC DE</Option>
                <Option key="20" value="20:INC D">INC D</Option>
                <Option key="21" value="21:DEC D">DEC D</Option>
                <Option key="22" value="22:LD D,d8">LD D,d8</Option>
                <Option key="23" value="23:RLA">RLA</Option>
                <Option key="24" value="24:JR r8">JR r8</Option>
                <Option key="25" value="25:ADD HL,DE">ADD HL,DE</Option>
                <Option key="26" value="26:LD A,(DE)">LD A,(DE)</Option>
                <Option key="27" value="27:DEC DE">DEC DE</Option>
                <Option key="28" value="28:INC E">INC E</Option>
                <Option key="29" value="29:DEC E">DEC E</Option>
                <Option key="30" value="30:LD E,d8">LD E,d8</Option>
                <Option key="31" value="31:RRA">RRA</Option>
                <Option key="32" value="32:JR NZ,r8">JR NZ,r8</Option>
                <Option key="33" value="33:LD HL,d16">LD HL,d16</Option>
                <Option key="34" value="34:LD (HL+),A">LD (HL+),A</Option>
                <Option key="35" value="35:INC HL">INC HL</Option>
                <Option key="36" value="36:INC H">INC H</Option>
                <Option key="37" value="37:DEC H">DEC H</Option>
                <Option key="38" value="38:LD H,d8">LD H,d8</Option>
                <Option key="39" value="39:DAA">DAA</Option>
                <Option key="40" value="40:JR Z,r8">JR Z,r8</Option>
                <Option key="41" value="41:ADD HL,HL">ADD HL,HL</Option>
                <Option key="42" value="42:LD A,(HL+)">LD A,(HL+)</Option>
                <Option key="43" value="43:DEC HL">DEC HL</Option>
                <Option key="44" value="44:INC L">INC L</Option>
                <Option key="45" value="45:DEC L">DEC L</Option>
                <Option key="46" value="46:LD L,d8">LD L,d8</Option>
                <Option key="47" value="47:CPL">CPL</Option>
                <Option key="48" value="48:JR NC,r8">JR NC,r8</Option>
                <Option key="49" value="49:LD SP,d16">LD SP,d16</Option>
                <Option key="50" value="50:LD (HL-),A">LD (HL-),A</Option>
                <Option key="51" value="51:INC SP">INC SP</Option>
                <Option key="52" value="52:INC (HL)">INC (HL)</Option>
                <Option key="53" value="53:DEC (HL)">DEC (HL)</Option>
                <Option key="54" value="54:LD (HL),d8">LD (HL),d8</Option>
                <Option key="55" value="55:SCF">SCF</Option>
                <Option key="56" value="56:JR C,r8">JR C,r8</Option>
                <Option key="57" value="57:ADD HL,SP">ADD HL,SP</Option>
                <Option key="58" value="58:LD A,(HL-)">LD A,(HL-)</Option>
                <Option key="59" value="59:DEC SP">DEC SP</Option>
                <Option key="60" value="60:INC A">INC A</Option>
                <Option key="61" value="61:DEC A">DEC A</Option>
                <Option key="62" value="62:LD A,d8">LD A,d8</Option>
                <Option key="63" value="63:CCF">CCF</Option>
                <Option key="64" value="64:LD B,B">LD B,B</Option>
                <Option key="65" value="65:LD B,C">LD B,C</Option>
                <Option key="66" value="66:LD B,D">LD B,D</Option>
                <Option key="67" value="67:LD B,E">LD B,E</Option>
                <Option key="68" value="68:LD B,H">LD B,H</Option>
                <Option key="69" value="69:LD B,L">LD B,L</Option>
                <Option key="70" value="70:LD B,(HL)">LD B,(HL)</Option>
                <Option key="71" value="71:LD B,A">LD B,A</Option>
                <Option key="72" value="72:LD C,B">LD C,B</Option>
                <Option key="73" value="73:LD C,C">LD C,C</Option>
                <Option key="74" value="74:LD C,D">LD C,D</Option>
                <Option key="75" value="75:LD C,E">LD C,E</Option>
                <Option key="76" value="76:LD C,H">LD C,H</Option>
                <Option key="77" value="77:LD C,L">LD C,L</Option>
                <Option key="78" value="78:LD C,(HL)">LD C,(HL)</Option>
                <Option key="79" value="79:LD C,A">LD C,A</Option>
                <Option key="80" value="80:LD D,B">LD D,B</Option>
                <Option key="81" value="81:LD D,C">LD D,C</Option>
                <Option key="82" value="82:LD D,D">LD D,D</Option>
                <Option key="83" value="83:LD D,E">LD D,E</Option>
                <Option key="84" value="84:LD D,H">LD D,H</Option>
                <Option key="85" value="85:LD D,L">LD D,L</Option>
                <Option key="86" value="86:LD D,(HL)">LD D,(HL)</Option>
                <Option key="87" value="87:LD D,A">LD D,A</Option>
                <Option key="88" value="88:LD E,B">LD E,B</Option>
                <Option key="89" value="89:LD E,C">LD E,C</Option>
                <Option key="90" value="90:LD E,D">LD E,D</Option>
                <Option key="91" value="91:LD E,E">LD E,E</Option>
                <Option key="92" value="92:LD E,H">LD E,H</Option>
                <Option key="93" value="93:LD E,L">LD E,L</Option>
                <Option key="94" value="94:LD E,(HL)">LD E,(HL)</Option>
                <Option key="95" value="95:LD E,A">LD E,A</Option>
                <Option key="96" value="96:LD H,B">LD H,B</Option>
                <Option key="97" value="97:LD H,C">LD H,C</Option>
                <Option key="98" value="98:LD H,D">LD H,D</Option>
                <Option key="99" value="99:LD H,E">LD H,E</Option>
                <Option key="100" value="100:LD H,H">LD H,H</Option>
                <Option key="101" value="101:LD H,L">LD H,L</Option>
                <Option key="102" value="102:LD H,(HL)">LD H,(HL)</Option>
                <Option key="103" value="103:LD H,A">LD H,A</Option>
                <Option key="104" value="104:LD L,B">LD L,B</Option>
                <Option key="105" value="105:LD L,C">LD L,C</Option>
                <Option key="106" value="106:LD L,D">LD L,D</Option>
                <Option key="107" value="107:LD L,E">LD L,E</Option>
                <Option key="108" value="108:LD L,H">LD L,H</Option>
                <Option key="109" value="109:LD L,L">LD L,L</Option>
                <Option key="110" value="110:LD L,(HL)">LD L,(HL)</Option>
                <Option key="111" value="111:LD L,A">LD L,A</Option>
                <Option key="112" value="112:LD (HL),B">LD (HL),B</Option>
                <Option key="113" value="113:LD (HL),C">LD (HL),C</Option>
                <Option key="114" value="114:LD (HL),D">LD (HL),D</Option>
                <Option key="115" value="115:LD (HL),E">LD (HL),E</Option>
                <Option key="116" value="116:LD (HL),H">LD (HL),H</Option>
                <Option key="117" value="117:LD (HL),L">LD (HL),L</Option>
                <Option key="118" value="118:HALT">HALT</Option>
                <Option key="119" value="119:LD (HL),A">LD (HL),A</Option>
                <Option key="120" value="120:LD A,B">LD A,B</Option>
                <Option key="121" value="121:LD A,C">LD A,C</Option>
                <Option key="122" value="122:LD A,D">LD A,D</Option>
                <Option key="123" value="123:LD A,E">LD A,E</Option>
                <Option key="124" value="124:LD A,H">LD A,H</Option>
                <Option key="125" value="125:LD A,L">LD A,L</Option>
                <Option key="126" value="126:LD A,(HL)">LD A,(HL)</Option>
                <Option key="127" value="127:LD A,A">LD A,A</Option>
                <Option key="128" value="128:ADD A,B">ADD A,B</Option>
                <Option key="129" value="129:ADD A,C">ADD A,C</Option>
                <Option key="130" value="130:ADD A,D">ADD A,D</Option>
                <Option key="131" value="131:ADD A,E">ADD A,E</Option>
                <Option key="132" value="132:ADD A,H">ADD A,H</Option>
                <Option key="133" value="133:ADD A,L">ADD A,L</Option>
                <Option key="134" value="134:ADD A,(HL)">ADD A,(HL)</Option>
                <Option key="135" value="135:ADD A,A">ADD A,A</Option>
                <Option key="136" value="136:ADC A,B">ADC A,B</Option>
                <Option key="137" value="137:ADC A,C">ADC A,C</Option>
                <Option key="138" value="138:ADC A,D">ADC A,D</Option>
                <Option key="139" value="139:ADC A,E">ADC A,E</Option>
                <Option key="140" value="140:ADC A,H">ADC A,H</Option>
                <Option key="141" value="141:ADC A,L">ADC A,L</Option>
                <Option key="142" value="142:ADC A,(HL)">ADC A,(HL)</Option>
                <Option key="143" value="143:ADC A,A">ADC A,A</Option>
                <Option key="144" value="144:SUB B">SUB B</Option>
                <Option key="145" value="145:SUB C">SUB C</Option>
                <Option key="146" value="146:SUB D">SUB D</Option>
                <Option key="147" value="147:SUB E">SUB E</Option>
                <Option key="148" value="148:SUB H">SUB H</Option>
                <Option key="149" value="149:SUB L">SUB L</Option>
                <Option key="150" value="150:SUB (HL)">SUB (HL)</Option>
                <Option key="151" value="151:SUB A">SUB A</Option>
                <Option key="152" value="152:SBC A,B">SBC A,B</Option>
                <Option key="153" value="153:SBC A,C">SBC A,C</Option>
                <Option key="154" value="154:SBC A,D">SBC A,D</Option>
                <Option key="155" value="155:SBC A,E">SBC A,E</Option>
                <Option key="156" value="156:SBC A,H">SBC A,H</Option>
                <Option key="157" value="157:SBC A,L">SBC A,L</Option>
                <Option key="158" value="158:SBC A,(HL)">SBC A,(HL)</Option>
                <Option key="159" value="159:SBC A,A">SBC A,A</Option>
                <Option key="160" value="160:AND B">AND B</Option>
                <Option key="161" value="161:AND C">AND C</Option>
                <Option key="162" value="162:AND D">AND D</Option>
                <Option key="163" value="163:AND E">AND E</Option>
                <Option key="164" value="164:AND H">AND H</Option>
                <Option key="165" value="165:AND L">AND L</Option>
                <Option key="166" value="166:AND (HL)">AND (HL)</Option>
                <Option key="167" value="167:AND A">AND A</Option>
                <Option key="168" value="168:XOR B">XOR B</Option>
                <Option key="169" value="169:XOR C">XOR C</Option>
                <Option key="170" value="170:XOR D">XOR D</Option>
                <Option key="171" value="171:XOR E">XOR E</Option>
                <Option key="172" value="172:XOR H">XOR H</Option>
                <Option key="173" value="173:XOR L">XOR L</Option>
                <Option key="174" value="174:XOR (HL)">XOR (HL)</Option>
                <Option key="175" value="175:XOR A">XOR A</Option>
                <Option key="176" value="176:OR B">OR B</Option>
                <Option key="177" value="177:OR C">OR C</Option>
                <Option key="178" value="178:OR D">OR D</Option>
                <Option key="179" value="179:OR E">OR E</Option>
                <Option key="180" value="180:OR H">OR H</Option>
                <Option key="181" value="181:OR L">OR L</Option>
                <Option key="182" value="182:OR (HL)">OR (HL)</Option>
                <Option key="183" value="183:OR A">OR A</Option>
                <Option key="184" value="184:CP B">CP B</Option>
                <Option key="185" value="185:CP C">CP C</Option>
                <Option key="186" value="186:CP D">CP D</Option>
                <Option key="187" value="187:CP E">CP E</Option>
                <Option key="188" value="188:CP H">CP H</Option>
                <Option key="189" value="189:CP L">CP L</Option>
                <Option key="190" value="190:CP (HL)">CP (HL)</Option>
                <Option key="191" value="191:CP A">CP A</Option>
                <Option key="192" value="192:RET NZ">RET NZ</Option>
                <Option key="193" value="193:POP BC">POP BC</Option>
                <Option key="194" value="194:JP NZ,a16">JP NZ,a16</Option>
                <Option key="195" value="195:JP a16">JP a16</Option>
                <Option key="196" value="196:CALL NZ,a16">CALL NZ,a16</Option>
                <Option key="197" value="197:PUSH BC">PUSH BC</Option>
                <Option key="198" value="198:ADD A,d8">ADD A,d8</Option>
                <Option key="199" value="199:RST 00H">RST 00H</Option>
                <Option key="200" value="200:RET Z">RET Z</Option>
                <Option key="201" value="201:RET">RET</Option>
                <Option key="202" value="202:JP Z,a16">JP Z,a16</Option>
                <Option key="203" value="203:PREFIX CB">PREFIX CB</Option>
                <Option key="204" value="204:CALL Z,a16">CALL Z,a16</Option>
                <Option key="205" value="205:CALL a16">CALL a16</Option>
                <Option key="206" value="206:ADC A,d8">ADC A,d8</Option>
                <Option key="207" value="207:RST 08H">RST 08H</Option>
                <Option key="208" value="208:RET NC">RET NC</Option>
                <Option key="209" value="209:POP DE">POP DE</Option>
                <Option key="210" value="210:JP NC,a16">JP NC,a16</Option>
                <Option key="212" value="212:CALL NC,a16">CALL NC,a16</Option>
                <Option key="213" value="213:PUSH DE">PUSH DE</Option>
                <Option key="214" value="214:SUB d8">SUB d8</Option>
                <Option key="215" value="215:RST 10H">RST 10H</Option>
                <Option key="216" value="216:RET C">RET C</Option>
                <Option key="217" value="217:RETI">RETI</Option>
                <Option key="218" value="218:JP C,a16">JP C,a16</Option>
                <Option key="220" value="220:CALL C,a16">CALL C,a16</Option>
                <Option key="222" value="222:SBC A,d8">SBC A,d8</Option>
                <Option key="223" value="223:RST 18H">RST 18H</Option>
                <Option key="224" value="224:LDH (a8),A">LDH (a8),A</Option>
                <Option key="225" value="225:POP HL">POP HL</Option>
                <Option key="226" value="226:LD (C),A">LD (C),A</Option>
                <Option key="229" value="229:PUSH HL">PUSH HL</Option>
                <Option key="230" value="230:AND d8">AND d8</Option>
                <Option key="231" value="231:RST 20H">RST 20H</Option>
                <Option key="232" value="232:ADDSP,r8">ADDSP,r8</Option>
                <Option key="233" value="233:JP (HL)">JP (HL)</Option>
                <Option key="234" value="234:LD (a16),A">LD (a16),A</Option>
                <Option key="238" value="238:XOR d8">XOR d8</Option>
                <Option key="239" value="239:RST 28H">RST 28H</Option>
                <Option key="240" value="240:LDH A,(a8)">LDH A,(a8)</Option>
                <Option key="241" value="241:POP AF">POP AF</Option>
                <Option key="242" value="242:LD A,(C)">LD A,(C)</Option>
                <Option key="243" value="243:DI">DI</Option>
                <Option key="245" value="245:PUSH AF">PUSH AF</Option>
                <Option key="246" value="246:OR d8">OR d8</Option>
                <Option key="247" value="247:RST 30H">RST 30H</Option>
                <Option key="248" value="248:LDHL SP,r8">LDHL SP,r8</Option>
                <Option key="249" value="249:LD SP,HL">LD SP,HL</Option>
                <Option key="250" value="250:LD A,(a16)">LD A,(a16)</Option>
                <Option key="251" value="251:EI">EI</Option>
                <Option key="254" value="254:CP d8">CP d8</Option>
                <Option key="255" value="255:RST 38H">RST 38H</Option>
            </Select>
            {this.dataInput()}
        </div>
    }

}

const OPCODES_DATA = [null, "uint16", null, null, null, null, "uint8", null, "uint16", null, null, null, null, null, "uint8", null, null, "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, "int8", "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, "int8", "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "uint16", "uint16", "uint16", null, "uint8", null, null, null, "uint16", null, "uint16", "uint16", "uint8", null, null, null, "uint16", null, "uint16", null, "uint8", null, null, null, "uint16", null, "uint16", null, "uint8", null, "uint8", null, null, null, null, null, "uint8", null, "uint8", null, "uint16", null, null, null, "uint8", null, "uint8", null, null, null, null, null, "uint8", null, "uint8", null, "uint16", null, null, null, "uint8", null];