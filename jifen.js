const serverUrl = 'https://c861-2409-8a60-1916-b294-508-430c-c5fc-865c.ngrok-free.app';
const rankingData = [
    { rank: 3, avatar: 'https://via.placeholder.com/40', name: '王五', points: 12800 },
    { rank: 4, avatar: 'https://via.placeholder.com/40', name: '赵六', points: 11500 },
    { rank: 5, avatar: 'https://via.placeholder.com/40', name: '陈七', points: 9800 }
];

const container = document.querySelector('.ranking-container');
const input = document.getElementById('verification-input');
const signBtn = document.getElementById('signBtn');
const signTips = document.getElementById('signTips');


if (!input || !signBtn || !signTips) {
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

    // 动态加载排行榜数据
    rankingData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'rank-item';
        div.innerHTML = `
            <div class="rank-number">${item.rank}</div>
            <div class="user-info">
                <span>${item.name}</span>
            </div>
            <div class="points">${item.points}</div>
        `;
        container.appendChild(div);
    });

    // 签到按钮点击事件
    signBtn.addEventListener('click', async () => {
        const userName = document.getElementById('verification-input').value;
        console.log(userName)
        console.log("大是大非")
        try {
            const response = await fetch(`${serverUrl}/api/sign`, { method: 'POST' , body: JSON.stringify({  userName })});
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

// 更新排行榜数据（假设从后端获取最新数据）
async function updateRankingData() {
    try {
        const response = await fetch(`${serverUrl}/api/ranking`);
        const data = await response.json();
        container.innerHTML = ''; // 清空现有数据
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'rank-item';
            div.innerHTML = `
                <div class="rank-number">${item.rank}</div>
                <div class="user-info">
                    <img src="${item.avatar}" alt="${item.name}" class="avatar">
                    <span>${item.name}</span>
                </div>
                <div class="points">${item.points}</div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('更新排行榜失败:', error);
    }
}