const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');
const sendCodeButton = document.getElementById('sendCode');

// 后端服务器地址
const serverUrl = 'https://88ca-2409-8a60-191b-c994-71c3-5cdf-743d-662.ngrok-free.app';

// 模拟验证码（实际开发中应由后端生成并发送到用户手机）
let verificationCode = '';

// 监听发送验证码按钮点击事件
sendCodeButton.addEventListener('click', function () {
    const phone = document.getElementById('phone').value.trim();

    // 校验手机号格式
    if (!validatePhone(phone)) {
        showMessage('手机号格式不正确！', 'red');
        return;
    }

    // 生成随机验证码（6位数字）
    verificationCode = Math.floor(100 + Math.random() * 900).toString();
    showMessage(`验证码已发送至 ${phone}，验证码为：${verificationCode}`, 'green');

    // 禁用发送按钮10秒
    sendCodeButton.disabled = true;
    let countdown = 10;
    const timer = setInterval(() => {
        sendCodeButton.textContent = `重新发送(${countdown})`;
        countdown--;
        if (countdown < 0) {
            clearInterval(timer);
            sendCodeButton.textContent = '发送验证码';
            sendCodeButton.disabled = false;
        }
    }, 1000);
});

// 监听表单提交事件
registerForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const phone = document.getElementById('phone').value.trim();
    const code = document.getElementById('code').value.trim();

    // 校验手机号格式
    if (!validatePhone(phone)) {
        showMessage('手机号格式不正确！', 'red');
        return;
    }

    // 校验验证码
    if (code !== verificationCode) {
        showMessage('验证码错误！', 'red');
        return;
    }

    // 发送注册请求到后端
    try {
        const response = await fetch(`${serverUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, code })
        });


	
const result = await response.json();
showMessage(result.message, response.ok ? 'green' : 'red');

// 注册成功后跳转到主页
if (response.ok) {
    window.location.href = 'home.html';
}
    } catch (error) {
        showMessage('网络错误，请稍后重试！', 'red');
    }

    // 清空表单
    registerForm.reset();
});

// 校验手机号格式
function validatePhone(phone) {
    const phoneRegex = /^1[3456789]\d{9}$/;
    return phoneRegex.test(phone);
}

// 显示消息
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}