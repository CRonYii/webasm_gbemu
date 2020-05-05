import { Select } from 'antd';
import React from 'react';
import { RangedNumberInput } from './RangedNumberInput';
import { toHexText } from './utils';

const { Option } = Select;

const dataRange = {
    'uint8': { min: 0, max: (1 << 8) - 1, display: val => toHexText(val, 2) },
    'uint16': { min: 0, max: (1 << 16) - 1, toByte: (val) => [val & 0xff, val >> 8], display: val => toHexText(val, 4) },
    'int8': { min: -(1 << 7), max: (1 << 7) - 1, display: val => toHexText(val >= 0 ? val : val + 256, 2) },
};

export class OpcodeInput extends React.Component {

    state = {
        binary: null,
        datatype: null
    }

    onFinish = (data) => {
        let binary = new Array(this.state.binary);
        const { datatype } = this.state;
        if (datatype) {
            const toByte = dataRange[datatype].toByte || ((val) => [val]);
            data = toByte(data);
            binary = binary.concat(data);
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(new Uint8Array(binary));
        }
    }

    filterOption = (input, option) => {
        if (!isNaN(Number(input))) {
            return Number(option.value) === Number(input);
        }

        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    onSelectOpcode = (opcode) => {
        opcode = Number(opcode);
        const datatype = OPCODES_DATA[opcode];
        this.setState(
            {
                binary: [opcode],
                datatype
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
        if (!datatype) return;
        const { min, max, display } = dataRange[datatype];
        return <RangedNumberInput
            key={datatype}
            defaultDisplay="0x" display={display}
            min={min} max={max}
            onPressEnter={this.onFinish}
        />
    }

    render() {
        return <div>
            <Select
                showSearch
                style={{ width: 200 }}
                onSelect={this.onSelectOpcode}
                filterOption={this.filterOption}
            >
                <Option key="0" value="0">NOP</Option>
                <Option key="1" value="1">LD BC,d16</Option>
                <Option key="2" value="2">LD (BC),A</Option>
                <Option key="3" value="3">INC BC</Option>
                <Option key="4" value="4">INC B</Option>
                <Option key="5" value="5">DEC B</Option>
                <Option key="6" value="6">LD B,d8</Option>
                <Option key="7" value="7">RLCA</Option>
                <Option key="8" value="8">LD (a16),SP</Option>
                <Option key="9" value="9">ADD HL,BC</Option>
                <Option key="10" value="10">LD A,(BC)</Option>
                <Option key="11" value="11">DEC BC</Option>
                <Option key="12" value="12">INC C</Option>
                <Option key="13" value="13">DEC C</Option>
                <Option key="14" value="14">LD C,d8</Option>
                <Option key="15" value="15">RRCA</Option>
                <Option key="16" value="16">STOP 0</Option>
                <Option key="17" value="17">LD DE,d16</Option>
                <Option key="18" value="18">LD (DE),A</Option>
                <Option key="19" value="19">INC DE</Option>
                <Option key="20" value="20">INC D</Option>
                <Option key="21" value="21">DEC D</Option>
                <Option key="22" value="22">LD D,d8</Option>
                <Option key="23" value="23">RLA</Option>
                <Option key="24" value="24">JR r8</Option>
                <Option key="25" value="25">ADD HL,DE</Option>
                <Option key="26" value="26">LD A,(DE)</Option>
                <Option key="27" value="27">DEC DE</Option>
                <Option key="28" value="28">INC E</Option>
                <Option key="29" value="29">DEC E</Option>
                <Option key="30" value="30">LD E,d8</Option>
                <Option key="31" value="31">RRA</Option>
                <Option key="32" value="32">JR NZ,r8</Option>
                <Option key="33" value="33">LD HL,d16</Option>
                <Option key="34" value="34">LD (HL+),A</Option>
                <Option key="35" value="35">INC HL</Option>
                <Option key="36" value="36">INC H</Option>
                <Option key="37" value="37">DEC H</Option>
                <Option key="38" value="38">LD H,d8</Option>
                <Option key="39" value="39">DAA</Option>
                <Option key="40" value="40">JR Z,r8</Option>
                <Option key="41" value="41">ADD HL,HL</Option>
                <Option key="42" value="42">LD A,(HL+)</Option>
                <Option key="43" value="43">DEC HL</Option>
                <Option key="44" value="44">INC L</Option>
                <Option key="45" value="45">DEC L</Option>
                <Option key="46" value="46">LD L,d8</Option>
                <Option key="47" value="47">CPL</Option>
                <Option key="48" value="48">JR NC,r8</Option>
                <Option key="49" value="49">LD SP,d16</Option>
                <Option key="50" value="50">LD (HL-),A</Option>
                <Option key="51" value="51">INC SP</Option>
                <Option key="52" value="52">INC (HL)</Option>
                <Option key="53" value="53">DEC (HL)</Option>
                <Option key="54" value="54">LD (HL),d8</Option>
                <Option key="55" value="55">SCF</Option>
                <Option key="56" value="56">JR C,r8</Option>
                <Option key="57" value="57">ADD HL,SP</Option>
                <Option key="58" value="58">LD A,(HL-)</Option>
                <Option key="59" value="59">DEC SP</Option>
                <Option key="60" value="60">INC A</Option>
                <Option key="61" value="61">DEC A</Option>
                <Option key="62" value="62">LD A,d8</Option>
                <Option key="63" value="63">CCF</Option>
                <Option key="64" value="64">LD B,B</Option>
                <Option key="65" value="65">LD B,C</Option>
                <Option key="66" value="66">LD B,D</Option>
                <Option key="67" value="67">LD B,E</Option>
                <Option key="68" value="68">LD B,H</Option>
                <Option key="69" value="69">LD B,L</Option>
                <Option key="70" value="70">LD B,(HL)</Option>
                <Option key="71" value="71">LD B,A</Option>
                <Option key="72" value="72">LD C,B</Option>
                <Option key="73" value="73">LD C,C</Option>
                <Option key="74" value="74">LD C,D</Option>
                <Option key="75" value="75">LD C,E</Option>
                <Option key="76" value="76">LD C,H</Option>
                <Option key="77" value="77">LD C,L</Option>
                <Option key="78" value="78">LD C,(HL)</Option>
                <Option key="79" value="79">LD C,A</Option>
                <Option key="80" value="80">LD D,B</Option>
                <Option key="81" value="81">LD D,C</Option>
                <Option key="82" value="82">LD D,D</Option>
                <Option key="83" value="83">LD D,E</Option>
                <Option key="84" value="84">LD D,H</Option>
                <Option key="85" value="85">LD D,L</Option>
                <Option key="86" value="86">LD D,(HL)</Option>
                <Option key="87" value="87">LD D,A</Option>
                <Option key="88" value="88">LD E,B</Option>
                <Option key="89" value="89">LD E,C</Option>
                <Option key="90" value="90">LD E,D</Option>
                <Option key="91" value="91">LD E,E</Option>
                <Option key="92" value="92">LD E,H</Option>
                <Option key="93" value="93">LD E,L</Option>
                <Option key="94" value="94">LD E,(HL)</Option>
                <Option key="95" value="95">LD E,A</Option>
                <Option key="96" value="96">LD H,B</Option>
                <Option key="97" value="97">LD H,C</Option>
                <Option key="98" value="98">LD H,D</Option>
                <Option key="99" value="99">LD H,E</Option>
                <Option key="100" value="100">LD H,H</Option>
                <Option key="101" value="101">LD H,L</Option>
                <Option key="102" value="102">LD H,(HL)</Option>
                <Option key="103" value="103">LD H,A</Option>
                <Option key="104" value="104">LD L,B</Option>
                <Option key="105" value="105">LD L,C</Option>
                <Option key="106" value="106">LD L,D</Option>
                <Option key="107" value="107">LD L,E</Option>
                <Option key="108" value="108">LD L,H</Option>
                <Option key="109" value="109">LD L,L</Option>
                <Option key="110" value="110">LD L,(HL)</Option>
                <Option key="111" value="111">LD L,A</Option>
                <Option key="112" value="112">LD (HL),B</Option>
                <Option key="113" value="113">LD (HL),C</Option>
                <Option key="114" value="114">LD (HL),D</Option>
                <Option key="115" value="115">LD (HL),E</Option>
                <Option key="116" value="116">LD (HL),H</Option>
                <Option key="117" value="117">LD (HL),L</Option>
                <Option key="118" value="118">HALT</Option>
                <Option key="119" value="119">LD (HL),A</Option>
                <Option key="120" value="120">LD A,B</Option>
                <Option key="121" value="121">LD A,C</Option>
                <Option key="122" value="122">LD A,D</Option>
                <Option key="123" value="123">LD A,E</Option>
                <Option key="124" value="124">LD A,H</Option>
                <Option key="125" value="125">LD A,L</Option>
                <Option key="126" value="126">LD A,(HL)</Option>
                <Option key="127" value="127">LD A,A</Option>
                <Option key="128" value="128">ADD A,B</Option>
                <Option key="129" value="129">ADD A,C</Option>
                <Option key="130" value="130">ADD A,D</Option>
                <Option key="131" value="131">ADD A,E</Option>
                <Option key="132" value="132">ADD A,H</Option>
                <Option key="133" value="133">ADD A,L</Option>
                <Option key="134" value="134">ADD A,(HL)</Option>
                <Option key="135" value="135">ADD A,A</Option>
                <Option key="136" value="136">ADC A,B</Option>
                <Option key="137" value="137">ADC A,C</Option>
                <Option key="138" value="138">ADC A,D</Option>
                <Option key="139" value="139">ADC A,E</Option>
                <Option key="140" value="140">ADC A,H</Option>
                <Option key="141" value="141">ADC A,L</Option>
                <Option key="142" value="142">ADC A,(HL)</Option>
                <Option key="143" value="143">ADC A,A</Option>
                <Option key="144" value="144">SUB B</Option>
                <Option key="145" value="145">SUB C</Option>
                <Option key="146" value="146">SUB D</Option>
                <Option key="147" value="147">SUB E</Option>
                <Option key="148" value="148">SUB H</Option>
                <Option key="149" value="149">SUB L</Option>
                <Option key="150" value="150">SUB (HL)</Option>
                <Option key="151" value="151">SUB A</Option>
                <Option key="152" value="152">SBC A,B</Option>
                <Option key="153" value="153">SBC A,C</Option>
                <Option key="154" value="154">SBC A,D</Option>
                <Option key="155" value="155">SBC A,E</Option>
                <Option key="156" value="156">SBC A,H</Option>
                <Option key="157" value="157">SBC A,L</Option>
                <Option key="158" value="158">SBC A,(HL)</Option>
                <Option key="159" value="159">SBC A,A</Option>
                <Option key="160" value="160">AND B</Option>
                <Option key="161" value="161">AND C</Option>
                <Option key="162" value="162">AND D</Option>
                <Option key="163" value="163">AND E</Option>
                <Option key="164" value="164">AND H</Option>
                <Option key="165" value="165">AND L</Option>
                <Option key="166" value="166">AND (HL)</Option>
                <Option key="167" value="167">AND A</Option>
                <Option key="168" value="168">XOR B</Option>
                <Option key="169" value="169">XOR C</Option>
                <Option key="170" value="170">XOR D</Option>
                <Option key="171" value="171">XOR E</Option>
                <Option key="172" value="172">XOR H</Option>
                <Option key="173" value="173">XOR L</Option>
                <Option key="174" value="174">XOR (HL)</Option>
                <Option key="175" value="175">XOR A</Option>
                <Option key="176" value="176">OR B</Option>
                <Option key="177" value="177">OR C</Option>
                <Option key="178" value="178">OR D</Option>
                <Option key="179" value="179">OR E</Option>
                <Option key="180" value="180">OR H</Option>
                <Option key="181" value="181">OR L</Option>
                <Option key="182" value="182">OR (HL)</Option>
                <Option key="183" value="183">OR A</Option>
                <Option key="184" value="184">CP B</Option>
                <Option key="185" value="185">CP C</Option>
                <Option key="186" value="186">CP D</Option>
                <Option key="187" value="187">CP E</Option>
                <Option key="188" value="188">CP H</Option>
                <Option key="189" value="189">CP L</Option>
                <Option key="190" value="190">CP (HL)</Option>
                <Option key="191" value="191">CP A</Option>
                <Option key="192" value="192">RET NZ</Option>
                <Option key="193" value="193">POP BC</Option>
                <Option key="194" value="194">JP NZ,a16</Option>
                <Option key="195" value="195">JP a16</Option>
                <Option key="196" value="196">CALL NZ,a16</Option>
                <Option key="197" value="197">PUSH BC</Option>
                <Option key="198" value="198">ADD A,d8</Option>
                <Option key="199" value="199">RST 00H</Option>
                <Option key="200" value="200">RET Z</Option>
                <Option key="201" value="201">RET</Option>
                <Option key="202" value="202">JP Z,a16</Option>
                <Option key="203" value="203">PREFIX CB</Option>
                <Option key="204" value="204">CALL Z,a16</Option>
                <Option key="205" value="205">CALL a16</Option>
                <Option key="206" value="206">ADC A,d8</Option>
                <Option key="207" value="207">RST 08H</Option>
                <Option key="208" value="208">RET NC</Option>
                <Option key="209" value="209">POP DE</Option>
                <Option key="210" value="210">JP NC,a16</Option>
                <Option key="212" value="212">CALL NC,a16</Option>
                <Option key="213" value="213">PUSH DE</Option>
                <Option key="214" value="214">SUB d8</Option>
                <Option key="215" value="215">RST 10H</Option>
                <Option key="216" value="216">RET C</Option>
                <Option key="217" value="217">RETI</Option>
                <Option key="218" value="218">JP C,a16</Option>
                <Option key="220" value="220">CALL C,a16</Option>
                <Option key="222" value="222">SBC A,d8</Option>
                <Option key="223" value="223">RST 18H</Option>
                <Option key="224" value="224">LDH (a8),A</Option>
                <Option key="225" value="225">POP HL</Option>
                <Option key="226" value="226">LD (C),A</Option>
                <Option key="229" value="229">PUSH HL</Option>
                <Option key="230" value="230">AND d8</Option>
                <Option key="231" value="231">RST 20H</Option>
                <Option key="232" value="232">ADDSP,r8</Option>
                <Option key="233" value="233">JP (HL)</Option>
                <Option key="234" value="234">LD (a16),A</Option>
                <Option key="238" value="238">XOR d8</Option>
                <Option key="239" value="239">RST 28H</Option>
                <Option key="240" value="240">LDH A,(a8)</Option>
                <Option key="241" value="241">POP AF</Option>
                <Option key="242" value="242">LD A,(C)</Option>
                <Option key="243" value="243">DI</Option>
                <Option key="245" value="245">PUSH AF</Option>
                <Option key="246" value="246">OR d8</Option>
                <Option key="247" value="247">RST 30H</Option>
                <Option key="248" value="248">LDHL SP,r8</Option>
                <Option key="249" value="249">LD SP,HL</Option>
                <Option key="250" value="250">LD A,(a16)</Option>
                <Option key="251" value="251">EI</Option>
                <Option key="254" value="254">CP d8</Option>
                <Option key="255" value="255">RST 38H</Option>
            </Select>
            {this.dataInput()}
        </div>
    }

}

const OPCODES_DATA = [null, "uint16", null, null, null, null, "uint8", null, "uint16", null, null, null, null, null, "uint8", null, null, "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, "int8", "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, "int8", "uint16", null, null, null, null, "uint8", null, "int8", null, null, null, null, null, "uint8", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "uint16", "uint16", "uint16", null, "uint8", null, null, null, "uint16", null, "uint16", "uint16", "uint8", null, null, null, "uint16", null, "uint16", null, "uint8", null, null, null, "uint16", null, "uint16", null, "uint8", null, "uint8", null, null, null, null, null, "uint8", null, "uint8", null, "uint16", null, null, null, "uint8", null, "uint8", null, null, null, null, null, "uint8", null, "uint8", null, "uint16", null, null, null, "uint8", null];