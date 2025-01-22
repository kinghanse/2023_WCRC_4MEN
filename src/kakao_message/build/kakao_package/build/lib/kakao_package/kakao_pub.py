import rclpy as rp
from rclpy.node import Node
from std_msgs.msg import String

class Publisher(Node):
    def __init__(self):
        super().__init__('pub')  # ROS 2 노드를 초기화하고 이름을 'pub'으로 설정
        self.publisher_ = self.create_publisher(String, 'topic', 10)  # 'topic' 토픽에 String 메시지를 발행하는 게시자 생성

    def get_user_input(self):
        user_input = input("")  # 사용자로부터 입력을 받음
        return user_input

    def publish_user_message(self):
        user_input = self.get_user_input()
        msg = String()  # String 메시지 생성
        
        # 사용자 입력이 비어있는지(Enter를 눌렀는지) 확인합니다.
        if not user_input:
            msg.data = '10'
        else:
            msg.data = user_input
        
        self.publisher_.publish(msg)  # 메시지를 게시
        print(msg.data)  # 게시된 메시지를 콘솔에 출력


def main(args=None):
    rp.init(args=args)  # ROS 2 노드를 초기화

    node = Publisher()  # Publisher 클래스의 인스턴스를 생성하여 노드 시작

    while rp.ok():  # ROS 2가 동작 중인 동안 반복
        node.publish_user_message()  # 사용자로부터 입력받은 메시지를 발행

    node.destroy_node()  # 노드를 종료
    rp.shutdown()  # ROS 2를 종료

if __name__ == '__main__':
    main()  # main 함수를 호출하여 스크립트 실행
