Blockly.Blocks['modbus_init'] = {
  init: function () {
    this.jsonInit({
      type: "modbus_init",
      message0: "khởi tạo Modbus RX %1 TX %2 Baudrate %3",
      previousStatement: null,
      nextStatement: null,
      args0: [
        { type: "field_dropdown", name: "RX", options: digitalPins },
        { type: "field_dropdown", name: "TX", options: digitalPins },
        { type: "field_number", name: "BAUD", value: 9600 }
      ],
      colour: 230,
      tooltip: "Khởi tạo kết nối Modbus RTU",
      helpUrl: ""
    });
  }
};

Blockly.Blocks['modbus_read_input_registers'] = {
  init: function () {
    this.jsonInit({
      message0: "đọc input register thiết bị %4 %1 địa chỉ %5 %2 số lượng %6 %3",
      args0: [
        { type: "input_value", name: "SLAVE_ID"},
        { type: "input_value", name: "ADDRESS"},
        { type: "input_value", name: "QUANTITY"},
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" }
      ],
      output: null,
      colour: 160,
      tooltip: "Đọc input register từ thiết bị Modbus",
      helpUrl: ""
    });
  }
};

Blockly.Blocks['modbus_read_holding_registers'] = {
  init: function () {
    this.jsonInit({
      message0: "đọc holding register thiết bị %4 %1 function code %7 %8 địa chỉ %5 %2 số lượng %6 %3",
      args0: [
        { type: "input_value", name: "SLAVE_ID"},
        { type: "input_value", name: "ADDRESS"},
        { type: "input_value", name: "QUANTITY"},
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_value", name: "FUNC_CODE"}

      ],
      output: null,
      colour: 160,
      tooltip: "Đọc holding register từ thiết bị Modbus",
      helpUrl: ""
    });
  }
};

Blockly.Blocks['modbus_write_single_register'] = {
  init: function () {
    this.jsonInit({
      message0: "ghi giá trị %4 %3 vào register thiết bị %5 %1 địa chỉ %6 %2",
      args0: [
        { type: "input_value", name: "SLAVE_ID"},
        { type: "input_value", name: "ADDRESS"},
        { type: "input_value", name: "VALUE"},
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Ghi giá trị vào holding register",
      helpUrl: ""
    });
  }
};


Blockly.Blocks['modbus_read_float'] = {
  init: function () {
    this.jsonInit({
      type: "modbus_read_float",
      message0: "đọc float từ thiết bị %4 %1 function code %6 %7 địa chỉ %5 %2 thứ tự byte %3",
      args0: [
        {
          type: "input_value",
          name: "SLAVE_ID",
          value: 1,
          min: 1,
          max: 247
        },
        {
          type: "input_value",
          name: "REGISTER_ADDR",
          value: 0,
          min: 0,
          max: 65535
        },
        {
          type: "field_dropdown",
          name: "BYTE_ORDER",
          options: [
            ["Big-endian", "big"],
            ["Little-endian", "little"]
          ]
        },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_value", name: "FUNC_CODE"}

      ],
      output: "Number",
      colour: 20,
      tooltip: "Đọc 2 thanh ghi và ghép thành giá trị float từ thiết bị Modbus",
      helpUrl: ""
    });
  }
};

Blockly.Blocks['modbus_read_raw_bytes'] = {
  init: function () {
    this.jsonInit({
      "type": "modbus_read_raw_bytes",
      "message0": "Modbus đọc dữ liệu RAW (dạng byte) thiết bị %4 %1 function code %7 %8 địa chỉ %5 %2 số thanh ghi %6 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "SLAVE_ID",
          "value": 1,
          "min": 1,
          "max": 247
        },
        {
          "type": "input_value",
          "name": "REGISTER_ADDR",
          "value": 0,
          "min": 0,
          "max": 65535
        },
        {
          "type": "input_value",
          "name": "REGISTER_COUNT",
          "value": 2,
          "min": 1,
          "max": 125
        },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_dummy" },
        { type: "input_value", name: "FUNC_CODE"}
      ],
      "output": "Array",
      "colour": 20,
      "tooltip": "Đọc dữ liệu dạng byte thô từ slave Modbus",
      "helpUrl": ""
    });
  }
};



Blockly.Python['modbus_init'] = function(block) {
  const rx = block.getFieldValue('RX');
  const tx = block.getFieldValue('TX');
  const baud = block.getFieldValue('BAUD');

  Blockly.Python.definitions_['import_modbus_master'] = 'from modbus_master import ModbusRTU';
  Blockly.Python.definitions_['create_modbus_master'] = `modbus = ModbusRTU(rx=${rx}_PIN, tx=${tx}_PIN, baudrate=${baud})\n`;
  const code =``
  return code;
};

Blockly.Python['modbus_read_input_registers'] = function(block) {
  const slave = Blockly.Python.valueToCode(block, 'SLAVE_ID', Blockly.Python.ORDER_ATOMIC);
  const addr = Blockly.Python.valueToCode(block, 'ADDRESS', Blockly.Python.ORDER_ATOMIC);
  const qty = Blockly.Python.valueToCode(block, 'QUANTITY', Blockly.Python.ORDER_ATOMIC);
  const code = `modbus.read_input_registers(${slave}, ${addr}, ${qty})`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['modbus_read_holding_registers'] = function(block) {
  const slave = Blockly.Python.valueToCode(block, 'SLAVE_ID', Blockly.Python.ORDER_ATOMIC);
  const addr = Blockly.Python.valueToCode(block, 'ADDRESS', Blockly.Python.ORDER_ATOMIC);
  const func_code = Blockly.Python.valueToCode(block, 'FUNC_CODE', Blockly.Python.ORDER_ATOMIC);
  const qty = Blockly.Python.valueToCode(block, 'QUANTITY', Blockly.Python.ORDER_ATOMIC);
  const code = `modbus.read_holding_registers(${slave}, ${func_code}, ${addr}, ${qty})`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['modbus_write_single_register'] = function(block) {
  const slave = Blockly.Python.valueToCode(block, 'SLAVE_ID', Blockly.Python.ORDER_ATOMIC);
  const addr = Blockly.Python.valueToCode(block, 'ADDRESS', Blockly.Python.ORDER_ATOMIC);
  const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC);
  const code = `modbus.write_single_register(${slave}, ${addr}, ${value})\n`;
  return code;
};

Blockly.Python['modbus_read_float'] = function(block) {
  var slave_id = Blockly.Python.valueToCode(block, 'SLAVE_ID', Blockly.Python.ORDER_ATOMIC);
  var func_code = Blockly.Python.valueToCode(block, 'FUNC_CODE', Blockly.Python.ORDER_ATOMIC);
  var reg_addr = Blockly.Python.valueToCode(block, 'REGISTER_ADDR', Blockly.Python.ORDER_ATOMIC);
  var byte_order = block.getFieldValue('BYTE_ORDER');
  let code = `modbus.read_float(${slave_id}, ${func_code}, ${reg_addr}, byte_order="${byte_order}")`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['modbus_read_raw_bytes'] = function(block) {
  var slave_id = Blockly.Python.valueToCode(block, 'SLAVE_ID', Blockly.Python.ORDER_ATOMIC);
  var func_code = Blockly.Python.valueToCode(block, 'FUNC_CODE', Blockly.Python.ORDER_ATOMIC);
  var reg_addr = Blockly.Python.valueToCode(block, 'REGISTER_ADDR', Blockly.Python.ORDER_ATOMIC);
  var count = block.getFieldValue('REGISTER_COUNT');
  var code = `modbus.read_raw_bytes(${slave_id}, ${func_code}, ${reg_addr}, ${count})`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};
