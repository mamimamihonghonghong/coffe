const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const fs = require('fs');
const dataFilePath = __dirname + '/orders.json';

// 用于存储订单数据
let orders = [];

// 加载订单数据
if (fs.existsSync(dataFilePath)) {
    orders = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
}

// 保存订单数据到文件
function saveOrders() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2), 'utf-8');
        console.log('订单数据已保存到文件。');
    } catch (error) {
        console.error('文件写入失败：', error);
    }
}

// 用于存储用户数据
let users = [];

// 解析 JSON 请求体
app.use(bodyParser.json());

// 允许跨域请求
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 注册接口
app.post('/register', (req, res) => {
    const { phone, code } = req.body;

    // 校验手机号和验证码
    if (!phone || !code) {
        return res.status(400).json({ message: '手机号和验证码不能为空！' });
    }

    // 检查手机号是否已注册
    if (users.some(user => user.phone === phone)) {
        return res.status(400).json({ message: '手机号已注册！' });
    }

    // 保存用户数据
    users.push({ phone, code });
    res.status(200).json({ message: '注册成功！' });
});

// 获取所有用户数据接口
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// 提交订单接口
app.post('/order', (req, res) => {
    const { coffeeType, quantity, notes } = req.body;

    // 校验数据
    if (!coffeeType || !quantity) {
        return res.status(400).json({ message: '咖啡类型和数量不能为空！' });
    }

    // 保存订单数据
    const order = {
        id: orders.length + 1, // 生成唯一ID
        coffeeType,
        quantity,
        notes,
        timestamp: new Date().toISOString() // 添加时间戳
    };
    orders.push(order);
    saveOrders(); // 保存数据到文件

    res.status(200).json({ message: '订单提交成功！', order });
});

// 获取所有订单接口
app.get('/orders', (req, res) => {
    res.status(200).json(orders);
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器已启动，访问地址：http://localhost:${port}`);
});