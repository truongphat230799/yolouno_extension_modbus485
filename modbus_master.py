from machine import UART, Pin
import ustruct
import time

class ModbusMaster:
    def __init__(self, rx, tx, baudrate=9600):
        self.uart = UART(2, baudrate=baudrate, tx=Pin(tx), rx=Pin(rx))
        self.uart.init(baudrate=baudrate, bits=8, parity=None, stop=1)

    def crc16(self, data: bytes) -> bytes:
        crc = 0xFFFF
        for pos in data:
            crc ^= pos
            for _ in range(8):
                lsb = crc & 0x0001
                crc >>= 1
                if lsb:
                    crc ^= 0xA001
        return ustruct.pack('<H', crc)

    def send(self, data: bytes):
        self.uart.write(data)

    def receive(self, size: int = 8, timeout=200) -> bytes:
        start = time.ticks_ms()
        while self.uart.any() < size:
            if time.ticks_diff(time.ticks_ms(), start) > timeout:
                return b''
        return self.uart.read(size)

    def build_request(self, slave, func, addr, qty_or_value):
        request = ustruct.pack('>B B H H', slave, func, addr, qty_or_value)
        return request + self.crc16(request)

    def read_input_registers(self, slave, addr, qty):
        request = self.build_request(slave, 0x04, addr, qty)
        self.send(request)
        return self.receive(5 + 2 * qty)

    def read_holding_registers(self, slave, addr, qty):
        request = self.build_request(slave, 0x03, addr, qty)
        self.send(request)
        return self.receive(5 + 2 * qty)

    def write_single_register(self, slave, addr, value):
        request = self.build_request(slave, 0x06, addr, value)
        self.send(request)
        return self.receive(8)
