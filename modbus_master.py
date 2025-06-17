from machine import UART
import time

class ModbusRTU:
    def __init__(self, uart_id=1, tx=6, rx=7, baudrate=9600, timeout=250):
        self.uart = UART(uart_id, baudrate=baudrate, tx=tx, rx=rx)
        self.timeout = timeout

    def calculate_crc(self, data):
        crc = 0xFFFF
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 0x0001:
                    crc >>= 1
                    crc ^= 0xA001
                else:
                    crc >>= 1
        return crc.to_bytes(2, 'little')  # Trả về CRC theo little-endian

    def send_request(self, slave_addr, function_code, register_addr, register_count):
        frame = bytearray([
            slave_addr,
            function_code,
            (register_addr >> 8) & 0xFF,
            register_addr & 0xFF,
            (register_count >> 8) & 0xFF,
            register_count & 0xFF
        ])
        frame += self.calculate_crc(frame)
        self.uart.write(frame)

    def read_response(self, expected_length):
        frame = bytearray()
        start_time = time.ticks_ms()
        while len(frame) < expected_length:
            if self.uart.any():
                frame.append(self.uart.read(1)[0])
            if time.ticks_diff(time.ticks_ms(), start_time) > self.timeout:
                print("Lỗi: Không có phản hồi từ thiết bị!")
                return None
        return frame

    def read_holding_registers(self, slave_addr, func_code, register_addr, register_count):
        self.send_request(slave_addr, func_code, register_addr, register_count)
        expected_bytes = 5 + 2 * register_count  # 1 slave + 1 func + 1 len + N*2 data + 2 CRC
        response = self.read_response(expected_bytes)
        if not response or len(response) < expected_bytes:
            return None
        data = response[3:-2]  # Bỏ header và CRC
        result = []
        for i in range(0, len(data), 2):
            val = (data[i] << 8) + data[i + 1]
            result.append(val)
        return result

