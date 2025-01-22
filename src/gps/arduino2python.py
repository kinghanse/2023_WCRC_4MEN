import serial
import time

# 시리얼 포트와 통신 속도를 설정합니다.
serial_port = '/dev/ttyUSB0'  # 시리얼 포트를 실제 사용하는 포트로 변경해야 합니다.
baud_rate = 115200

# 파일에 저장할 경로와 파일명을 설정합니다.
file_path = 'gps.txt'

# 시리얼 통신을 엽니다.
ser = serial.Serial(serial_port, baud_rate, timeout=1)

# 파일을 엽니다.
with open(file_path, 'w') as file:
    try:
        while True:
            # 시리얼 버퍼에서 한 라인을 읽어옵니다.
            line = ser.readline().decode('utf-8').strip()

            # "Location: "로 시작하는 라인을 찾습니다.
            if line.startswith("Location: "):
                # 위치 정보만 추출하여 파일에 씁니다.
                location_info = line[len("Location: "):]
                with open("gps.txt", "w") as file:
                    file.write(location_info) 

                # 옵션: 화면에도 출력합니다.
                print("GPS data:", location_info)

    except KeyboardInterrupt:
        # 프로그램을 종료하면서 시리얼 포트를 닫습니다.
        ser.close()

