// 获取表单和消息元素
const coffeeOrderForm = document.getElementById('coffeeOrderForm');
const orderMessage = document.getElementById('orderMessage');

// 监听表单提交事件
coffeeOrderForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // 阻止表单默认提交行为

    // 获取用户输入的值
    const coffeeType = document.getElementById('coffeeType').value;
    const quantity = document.getElementById('quantity').value;
    const notes = document.getElementById('notes').value;

    // 校验咖啡类型是否选择
    if (!coffeeType) {
        showOrderMessage('请选择咖啡类型！', 'red');
        return;
    }

      // 提交订单到后端
      try {
        const response = await fetch(`${serverUrl}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coffeeType, quantity, notes })
        });

        const result = await response.json();
        if (response.ok) {
            showOrderMessage(`订单提交成功：${quantity}杯${coffeeType}，备注：${notes || '无'}`, 'green');
        } else {
            showOrderMessage(result.message, 'red');
        }
    } catch (error) {
        showOrderMessage('网络错误，请稍后重试！', 'red');
    }

    // 模拟提交订单
    const order = {
        coffeeType: coffeeType,
        quantity: quantity,
        notes: notes
    };

    // 显示订单提交结果
    showOrderMessage(`订单已提交：${quantity}杯${coffeeType}，备注：${notes || '无'}`, 'green');

    // 清空表单
    coffeeOrderForm.reset();
});

// 显示订单提交结果
function showOrderMessage(text, color) {
    orderMessage.textContent = text;
    orderMessage.style.color = color;
}