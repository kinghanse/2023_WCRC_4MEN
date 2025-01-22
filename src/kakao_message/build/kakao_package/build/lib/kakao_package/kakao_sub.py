import json
import requests
import datetime
import os
import rclpy
from rclpy.node import Node
from std_msgs.msg import String



# 카카오 토큰을 저장할 파일명
KAKAO_TOKEN_FILENAME = "/home/men/dev_ws/kakao api/kakao_message/res/kakao_message/kakao_token.json"

# 저장하는 함수
def save_tokens(filename, tokens):
    with open(filename, "w") as fp:
        json.dump(tokens, fp)

# 읽어오는 함수
def load_tokens(filename):
    with open(filename) as fp:
        tokens = json.load(fp)

    return tokens

# refresh_token으로 access_token 갱신하는 함수
def update_tokens(app_key, filename) :
    tokens = load_tokens(filename)

    url = "https://kauth.kakao.com/oauth/token"
    data = {
        "grant_type" : "refresh_token",
        "client_id" : app_key,
        "refresh_token" : tokens['refresh_token']
    }
    response = requests.post(url, data=data)

    # 요청에 실패했다면,
    if response.status_code != 200:
        print("error! because ", response.json())
        tokens = None
    else: # 성공했다면,
        print(response.json())
        # 기존 파일 백업
        now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = filename+"."+ now
        os.rename(filename, backup_filename)
        # 갱신된 토큰 저장
        tokens['access_token'] = response.json()['access_token']
        save_tokens(filename, tokens)
        
    return tokens

# 토큰 저장
# save_tokens(KAKAO_TOKEN_FILENAME, tokens)

# 토큰 업데이트 -> 토큰 저장 필수!


KAKAO_APP_KEY = "b13983d6f19f1ce03b46fa1035dcb70d"
tokens = update_tokens(KAKAO_APP_KEY, KAKAO_TOKEN_FILENAME)
save_tokens(KAKAO_TOKEN_FILENAME, tokens)



# 저장된 토큰 정보를 읽어옴
tokens = load_tokens(KAKAO_TOKEN_FILENAME)

# 특정 템플릿 아이디 사용
template_id = "100628"

# 템플릿 메시지 url
url = f"https://kapi.kakao.com/v2/api/talk/memo/send?template_id={template_id}"

# request parameter 설정
headers = {
    "Authorization": "Bearer " + tokens['access_token']
}

# 나에게 카카오톡 메시지 보내기 요청(특정 템플릿 아이디 사용)


class Subscriber(Node):
    
    def __init__(self):
        super().__init__('sub')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.callback,
            10)
        
def callback(self, msg):
        self.msg_data = msg.data  # 메시지 데이터를 변수에 저장
        if(self.msg_data=="10"):
            
            response = requests.post(url, headers=headers)
            print(response.status_code)

            # 요청에 실패했다면,
            if response.status_code != 200:
                print("error! because ", response.json())
            else:  # 성공했다면,
                print('메시지를 성공적으로 보냈습니다.')

def main(args=None):
    rp.init(args=args)
    
    node = Subscriber()
    rp.spin(node)
    
    node.destroy_node() # 노드 종료
    rp.shutdown()


if __name__ == '__main__':
    main()

