from setuptools import find_packages, setup

package_name = 'kakao_package'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(exclude=['test']),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='men',
    maintainer_email='sv03123@naver.com',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'kakao_pub = kakao_package.kakao_pub:main',
            'kakao_sub = kakao_package.kakao_sub:main'
        ],
    },
)
