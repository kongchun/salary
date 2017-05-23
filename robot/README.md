# Salary - robot 
 自动爬取机器人

## 目录介绍
* history 历史代码（待删除）
* model 数据模型
* source 抓取数据来源
* utils 帮助类
* container.js 抓取容器
* main.js 抓取业务函数
* viewDate.js 展示业务函数
* run.js 运行入口 范例

## Source 文件介绍
文件夹 lagou 是指 抓取的来源 来自 拉钩网

* config.js 简化读取配置
* etl.js 数据清洗函数
* loader.js 数据加载器
* parse.js 数据解析器

>所有source都需要相同的目录结构。所有类都必须实现内部所有的方法，由于js没有接口函数所以这里隐含规约。

## loader与parse 说明

* list 加载与解析列表界面
* info 加载与解析详情界面
* position 加载与解析位置信息

## 其他

数据采用 mongodb ，项目依赖 iRobot 爬虫项目
