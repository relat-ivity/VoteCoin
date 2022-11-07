# 区块链DApp

### 一、 功能分析

+ 用户初始获得100积分：使用_mint方法
+ 用户花费30积分发起提案：使用transferFrom，配合结构体储存提案
+ 用户在规定时间里投票，花费5积分：使用transferFrom，配合修改结构体数据
+ 时间截止后通过提案给予50积分奖励：使用_mint进行奖励，并删除改提案

### 二、如何运行项目

1.  首先打开Ganache，复制一个用户的私钥，写入合约配置文件，来交部署合约的费用
2. 然后使用`npx hardhat run scripts/deploy.ts  --network ganache`指令进行部署，把部署的合约地址以及合约生成的json文件复制到前端文件夹里。
3. `npm start`运行前端即可。

### 三、关键界面

 本网页为单页面程序，分为四个部分：账户信息，提出提案，本用户提案和所有提案。

 <img src="screenshot\1.png" style="zoom: 33%;" />

 <img src="screenshot\2.png" style="zoom: 33%;" />

### 三、运行截图

1. 领取初始货币点击新用户奖励

   <img src="screenshot\3.png" style="zoom: 33%;" />

   - 领取之后，余额为100：

   <img src="screenshot\4.png" style="zoom: 33%;" />

2. 发起提案

   <img src="screenshot\5.png" style="zoom:33%;" />

   - 发送提案后，提案会显示在表格中：

     <img src="screenshot\6.png" style="zoom:33%;" />

3. 在另一个账户中投票：（不能投自己的提案，以及必须在提案截止时间之前投票，也有投票次数限制）

   <img src="screenshot\7.png" style="zoom:33%;" />

   - 投票成功后，赞成票数加1：

   <img src="screenshot\image-20221107104727821.png" alt="image-20221107104727821" style="zoom: 33%;" />

4. 投票到截止时间后，手动确认结算（未到时间会报错）

   <img src="screenshot\8.png" style="zoom:33%;" />

   - 结算之后，余额加50，通过提案数加1，提案删除：

   <img src="screenshot\9.png" style="zoom:33%;" />

   
