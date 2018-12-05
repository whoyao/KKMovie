# 项目说明

本项目使用云开发构建后台

## 数据库构建

须在后台建立 **comment** 、**movie** 、**user** 三个数据库，使用other目录下的csv文件分别初始化数据库。

![image](https://raw.githubusercontent.com/whoyao/KKMovie/master/other/screenshot/db.png)
 

## 对象储存构建

须在后台建立 **comment_audio** 目录，用来存放音频文件

![image](https://raw.githubusercontent.com/whoyao/KKMovie/master/other/screenshot/store.png)


## 上传云函数

![image](https://raw.githubusercontent.com/whoyao/KKMovie/master/other/screenshot/function.png)


## 已知bug

如需在后台修改comment数据集合，请确保该comment未被用户收藏，否则可能导致该用户页面加载错误