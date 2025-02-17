const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// 连接 MongoDB
const MONGODB_URI = 'mongodb+srv://458397072:7q79jsR7IeRALqcr@cluster0.kr1hh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// 定义签到记录模型
const signRecordSchema = new mongoose.Schema({
    user: { type: String, required: true },
    date: { type: String, required: true },
    points: { type: Number, required: true },
    consecutiveDays: { type: Number, required: true }
});
const SignRecord = mongoose.model('SignRecord', signRecordSchema);

// 解析 JSON 请求体
app.use(bodyParser.json());

// 允许跨域请求
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});






// 签到接口
app.post('/api/sign', async (req, res) => {
    try {
        const username = req.body.username; // 假设前端传递 userId
        console.log(username);
        
        const today = new Date().toISOString().split('T')[0];
        console.log(today)
        const existingSign = await SignRecord.findOne({ user: username, date: today });
        console.log(existingSign)
        if (existingSign) {
            return res.json({ success: false, message: '今日已签到' });
        }

        const lastSign = await SignRecord.findOne({ user: username }).sort({ date: -1 });
        console.log(lastSign)
        const consecutiveDays = lastSign ? lastSign.consecutiveDays + 1 : 1;
    
        console.log(consecutiveDays)
        let points = 1;
        if (consecutiveDays >= 5) points += 4;

        await SignRecord.create({
            user: username,
            date: today,
            points,
            consecutiveDays
        });

        res.json({ success: true, points, days: consecutiveDays });
    } catch (error) {
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器已启动，访问地址：http://localhost:${port}`);
});