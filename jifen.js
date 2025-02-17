// const serverUrl = 'https://c861-2409-8a60-1916-b294-508-430c-c5fc-865c.ngrok-free.app';
const serverUrl = 'http://localhost:3000';
const container = document.querySelector('.ranking-container');
const input = document.getElementById('verification-input');
const signBtn = document.getElementById('signBtn');
const signTips = document.getElementById('signTips');
const rankingList = document.getElementById('rankingList');

if (!input || !signBtn || !signTips ) {
    console.error('必要的 DOM 元素未找到');
} else {
    signTips.textContent = '请输入验证码后点击签到';

    // 监听输入变化
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            signBtn.disabled = false;
            signTips.textContent = '请输入正确的验证码';
            signTips.style.color = '#666';
        } else {
            signBtn.disabled = true;
            signTips.textContent = '请输入验证码后点击签到';
            signTips.style.color = '#666';
        }
    });

    // 页面加载时初始化排行榜数据
    updateRankingData();

    // 签到按钮点击事件
    signBtn.addEventListener('click', async () => {
        const username = input.value.trim();
        if (!username) {
            signTips.textContent = '请输入姓名';
            signTips.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${serverUrl}/api/sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            const result = await response.json();

            if (result.success) {
                signBtn.classList.add('signed');
                signBtn.disabled = true;
                signTips.innerHTML = `
                    ✅ 签到成功！积分+${result.points}
                    <br>连续签到：${result.days} 天
                `;
                signTips.style.color = 'green';

                // 更新排行榜数据
                updateRankingData();
            } else {
                signTips.textContent = result.message || '签到失败，请重试';
                signTips.style.color = 'red';
            }
        } catch (error) {
            console.error('签到失败:', error);
            signTips.textContent = '网络错误，请稍后重试';
            signTips.style.color = 'red';
        }
    });
}

// 更新排行榜数据（从后端获取最新数据）
async function updateRankingData() {
    try {
        const response = await fetch(`${serverUrl}/api/ranking`);
        console.log('获取排行榜数据的响应:', response);

        // 检查响应状态码
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP 错误！状态码：${response.status}，响应内容：${errorText}`);
        }

        const data = await response.json();
        console.log('获取到的排行榜数据:', data);

        rankingList.innerHTML = ''; // 清空现有数据

        // 确保 data 是一个数组
        if (Array.isArray(data.data)) {
            data.data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'rank-item';
                div.innerHTML = `
                    <div class="rank-number">${item.rank}</div>
                    <div class="user-info">
                        <span>${item.name}</span>
                    </div>
                    <div class="points">${item.points}</div>
                `;
                rankingList.appendChild(div);
            });
        } else {
            console.error('排行榜数据格式错误:', data);
        }
    } catch (error) {
        console.error('更新排行榜失败:', error);
    }
}