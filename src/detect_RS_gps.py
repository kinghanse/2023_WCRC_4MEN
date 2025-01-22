import argparse
import time
from pathlib import Path
import requests
from depth import Depth_Camera 
import serial
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random
from datetime import datetime
from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel
import pyrealsense2 as rs
import numpy as np

def GPS():
    serial_port = '/dev/ttyUSB0'  # 시리얼 포트를 실제 사용하는 포트로 변경해야 합니다.
    baud_rate = 115200
    file_path = 'gps.txt'
    ser = serial.Serial(serial_port, baud_rate, timeout=1)

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


def read_GPS(file_path='gps.txt'):
    try:
        with open(file_path, 'r') as file:
            # 파일의 첫 번째 줄을 읽어옵니다.
            line = file.readline().strip()

            # x 좌표와 y 좌표를 ','를 기준으로 분리하여 부동 소수점으로 변환합니다.
            x, y = map(float, line.split(','))

            return x, y
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None, None
    except ValueError as e:
        print(f"Error: {e}")
        return None, None



def detect(save_img=False):
    source, weights, view_img, save_txt, imgsz, trace = opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, not opt.no_trace
    detect_count = 0
    last_time = 0
    capture_count = 0 

    # Directories
    save_dir = Path(increment_path(Path(opt.project) / opt.name, exist_ok=opt.exist_ok))  # increment run
    (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)  # make dir

    # Initialize
    set_logging()
    device = select_device(opt.device)
    half = device.type != 'cpu'  # half precision only supported on CUDA

    # Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(imgsz, s=stride)  # check img_size

    if trace:
        model = TracedModel(model, device, opt.img_size)

    if half:
        model.half()  # to FP16

    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

    # Run RealSense configuration
    config = rs.config()
    config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)
    config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)

    pipeline = rs.pipeline()
    profile = pipeline.start(config)  ## 

    align_to = rs.stream.color
    align = rs.align(align_to)

    depth_info = {}  # 초기화 추가


    while True:
        frames = pipeline.wait_for_frames()

        aligned_frames = align.process(frames)
        color_frame = aligned_frames.get_color_frame()
        depth_frame = aligned_frames.get_depth_frame()

        if not depth_frame or not color_frame:
            continue

        img = np.asanyarray(color_frame.get_data())
        depth_image = np.asanyarray(depth_frame.get_data())
        depth_colormap = cv2.applyColorMap(cv2.convertScaleAbs(depth_image, alpha=0.08), cv2.COLORMAP_JET)

        im0 = img.copy()

        # Convert depth image to meters (optional)
        depth_scale = profile.get_device().first_depth_sensor().get_depth_scale()
        depth_image_meters = depth_image * depth_scale

        img = img[np.newaxis, :, :, :]
        img = np.stack(img, 0)
        img = img[..., ::-1].transpose((0, 3, 1, 2))  # BGR to RGB, BHWC to BCHW
        img = np.ascontiguousarray(img)

        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()
        img /= 255.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        with torch.no_grad():
            pred = model(img, augment=opt.augment)[0]

        pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)

        for i, det in enumerate(pred):  # detections per image
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                depth_info = {}

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class

                    # Write results
                    for *xyxy, conf, cls in reversed(det):
                        c = int(cls)  # integer class
                        label = f'{names[c]} {conf:.2f}'

                        x_center = int(((xyxy[0]) + xyxy[2]) / 2)
                        y_center = int((xyxy[1] + xyxy[3]) / 2)

                        depth_value = depth_frame.get_distance(x_center, y_center)

                        # 깊이 프로필을 가져옵니다.
                        depth_profile = depth_frame.get_profile()
                        color_profile = color_frame.get_profile()

                        # (x, y) 좌표를 실세계 좌표로 변환합니다.
                        depth_intrinsics = depth_profile.as_video_stream_profile().get_intrinsics()
                        depth_to_color_extrinsics = depth_profile.get_extrinsics_to(color_profile)
                        depth_point = rs.rs2_deproject_pixel_to_point(depth_intrinsics, [x_center, y_center], depth_value)
                        depth_point_in_color = rs.rs2_transform_point_to_point(depth_to_color_extrinsics, depth_point)


                        #print(f"{names[c]} 위치 실측값: ({depth_point_in_color[0]}, {depth_point_in_color[1]}, {depth_point_in_color[2]})")
                        depth_info[names[c]] = (depth_point_in_color[0], depth_point_in_color[1], depth_point_in_color[2])


                        # pixel 데이터를 텍스트 파일에 저장
                            

                        # with open("pixel_data.txt", "a") as file:
                        #     file.write(f"{label}{depth_point_in_color[0]} {depth_point_in_color[1]}, {depth_point_in_color[2]}\n")

                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=2)
                        plot_one_box(xyxy, depth_colormap, label=label, color=colors[int(cls)], line_thickness=2)
                        print(f'{label}, {depth_point_in_color[0]:.5f}m, {depth_point_in_color[1]:.5f}m, {depth_point_in_color[2]:.5f}m,')

                        if names[c] == 'person' or 'animal' or 'fire':
                            detect_count += 1

                            if detect_count >= 30 and time.time() - last_time > 10: # Adjust the threshold as needed
                                GPS() 
                                print(names[c], "detecting")
                                _, img_encoded = cv2.imencode('.jpg', im0)
                                capture_time = datetime.now().isoformat()
                                # image_name = f"{names[c]}_{capture_count}.jpg"
                                image_name = f"person_{capture_count}.jpg"
                                capture_count += 1

                                x_coordinate, y_coordinate = read_GPS()

                                if x_coordinate is not None and y_coordinate is not None:
                                    print(f"GPS_X : {x_coordinate}")
                                    print(f"GPS_Y : {y_coordinate}")
                                else:
                                    print("Failed to read GPS coordinates from file.")
                                
                            
                                others = {
                                    "id": "e707d230-6d51-44a7-b0d5-646331e1a174",
                                    "source_id": "cam-2",
                                    "category": names[c],
                                    "level": 1,
                                    "image_name": image_name,
                                    "created_time": capture_time,
                                    "x": x_coordinate, 
                                    "y": y_coordinate,
                                }
                            
                                files = {'image': (image_name, img_encoded.tobytes(), 'image/jpeg')}

                                requests.post('http://34.22.94.133:3000/event-reports', json=others, timeout=10)      
                                requests.post('http://34.22.94.133:3000/event-reports/images', files=files, timeout=10)
                            
                                print("로봇 위험 감지 ! 대상 :",names[c])
                        
                                last_time = time.time()
                                detect_count = 0

                        elif not (names[c] == 'person' or 'animal' or 'fire'):
                            detect_count = 0



            
            with open("pixel_data.txt", "w") as file:
                for label, (depth_point_in_color[0], depth_point_in_color[1], depth_point_in_color[2]) in depth_info.items():
                    file.write(f'{names[c]}: {depth_point_in_color[0]:.5f},{depth_point_in_color[1]:.5f},{depth_point_in_color[2]:.5f}\n')                        

### ROS realsense package -> node.py  ros2 run package node    -> node.py 는 import os / os.sys(python3 py --we .pt) / txt 'r' pub -> mani sub
        cv2.imshow("Depth Colormap", depth_colormap)
        cv2.imshow("Recognition result", im0)

        key = cv2.waitKey(1) & 0xFF

            # # 'p' 키를 눌렀을 때의 동작
            # with open("pixel_data.txt", "w") as file:
            #     for label, (depth_point_in_color[0], depth_point_in_color[1], depth_point_in_color[2]) in depth_info.items():
            #         file.write(f'{label}: {depth_point_in_color[0]:.5f},{depth_point_in_color[1]:.5f},{depth_point_in_color[2]:.5f}\n')
        if key == ord('q'):
            break

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default='yolov7-tiny.pt', help='model.pt path(s)')
    parser.add_argument('--source', type=str, default='inference/images', help='source')  # file/folder, 0 for webcam
    parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.25, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--update', action='store_true', help='update all models')
    parser.add_argument('--project', default='runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
    parser.add_argument('--no-trace', action='store_true', help="don't trace model")
    opt = parser.parse_args()
    print(opt)
    
    with torch.no_grad():
        if opt.update:
            for opt.weights in ['yolov7.pt']:  
                detect()
                strip_optimizer(opt.weights)
        else:
            detect()
