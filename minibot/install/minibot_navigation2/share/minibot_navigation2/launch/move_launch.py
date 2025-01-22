from nav2_simple_commander.robot_navigator import BasicNavigator
import rclpy
from geometry_msgs.msg import PoseStamped
rclpy.init()
nav = BasicNavigator()
nav.waitUntilNav2Active()


def move_1():
    goal_pose = PoseStamped()
    goal_pose.header.frame_id= './map_minibot/map_name'
    goal_pose.header.stamp = nav.get_clock().now().to_msg()
    goal_pose.pose.position.x : 1.6146497
    goal_pose.pose.position.y : -0.108592
    goal_pose.pose.position.z : 0.0065917
    goal_pose.pose.orientation.x = 0.0
    goal_pose.pose.orientation.y = 0.0
    goal_pose.pose.orientation.z = 0.0
    goal_pose.pose.orientation.w = 1.0

    nav.goToPose(goal_pose)

if __name__ == '__main__':
    move_1()