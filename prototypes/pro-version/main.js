// 模拟数据
const capsules = [
    {
        id: 1,
        code: 'A1B2C3D4',
        title: '给十年后的自己',
        preview: '当你看到这封信的时候，应该已经完成学业并在自己热爱的领域里发光发热了吧。不要忘记当初为什么出发...',
        author: { name: 'Alex', avatar: 'A' },
        createdAt: '2023-10-01',
        openAt: '2033-10-01',
        status: 'sealed',
        likes: 128,
        views: 450,
        isLiked: false
    },
    {
        id: 2,
        code: 'X9Y8Z7W6',
        title: '大学毕业那天的狂欢',
        preview: '这是我们最后一次以学生的身份聚在一起，视频里记录了每个人的梦想和对未来的期许。青春永不散场。',
        author: { name: 'Sarah', avatar: 'S' },
        createdAt: '2019-06-15',
        openAt: '2024-06-15',
        status: 'opened',
        likes: 543,
        views: 1200,
        isLiked: true
    },
    {
        id: 3,
        code: 'M5N6O7P8',
        title: '致未出生的宝宝',
        preview: '亲爱的宝贝，我和你妈妈正在期待你的到来。不知道你打开这个胶囊的时候，是不是已经是个小大人了。',
        author: { name: 'John Doe', avatar: 'J' },
        createdAt: '2023-12-25',
        openAt: '2041-12-25',
        status: 'sealed',
        likes: 89,
        views: 230,
        isLiked: false
    },
    {
        id: 4,
        code: 'Q1W2E3R4',
        title: '第一行代码',
        preview: 'console.log("Hello World"); 这是我人生中写下的第一行代码，它改变了我的人生轨迹。',
        author: { name: 'Coder01', avatar: 'C' },
        createdAt: '2015-09-01',
        openAt: '2025-09-01',
        status: 'sealed',
        likes: 312,
        views: 890,
        isLiked: false
    },
    {
        id: 5,
        code: 'T5Y6U7I8',
        title: '写在疫情解封之际',
        preview: '经历了漫长的等待，终于可以自由呼吸新鲜空气了。希望未来的我们，能更加珍惜平凡的每一天。',
        author: { name: 'Emma', avatar: 'E' },
        createdAt: '2022-12-05',
        openAt: '2023-12-05',
        status: 'opened',
        likes: 876,
        views: 3400,
        isLiked: false
    },
    {
        id: 6,
        code: 'A9S8D7F6',
        title: '关于火星的狂想',
        preview: '也许等你看到这个胶囊时，人类已经在火星建立了永久基地。我想知道，那里的星空和地球上一样美吗？',
        author: { name: 'SpaceFan', avatar: 'SF' },
        createdAt: '2024-01-10',
        openAt: '2050-01-01',
        status: 'sealed',
        likes: 45,
        views: 120,
        isLiked: false
    }
];

let isLoggedIn = false;
let currentSort = 'latest';
let currentFilter = 'all';
let searchQuery = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCapsules();
    setupEventListeners();
});

function setupEventListeners() {
    // 排序标签切换
    document.querySelectorAll('.sort-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentSort = target.dataset.sort;
            renderCapsules();
        });
    });

    // 过滤标签切换
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentFilter = target.dataset.filter;
            renderCapsules();
        });
    });

    // 搜索监听
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderCapsules();
    });
}

function renderCapsules() {
    const grid = document.getElementById('capsuleGrid');
    grid.innerHTML = '';

    let filtered = capsules.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery) || 
                              c.code.toLowerCase().includes(searchQuery);
        if (!matchesSearch) return false;

        if (currentFilter === 'opened') return c.status === 'opened';
        if (currentFilter === 'sealed') return c.status === 'sealed';
        return true;
    });

    // 排序
    if (currentSort === 'hot') {
        filtered.sort((a, b) => b.likes - a.likes);
    } else {
        // latest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">没有找到符合条件的胶囊</div>';
        return;
    }

    filtered.forEach(capsule => {
        const card = document.createElement('div');
        card.className = 'capsule-card glass-panel';
        
        const isOpened = capsule.status === 'opened';
        const statusClass = isOpened ? 'status-opened' : 'status-sealed';
        const statusText = isOpened ? '已开启' : '封存中';
        const statusIcon = isOpened ? 'fa-lock-open' : 'fa-lock';
        
        // 计算倒计时
        let countdownHtml = '';
        if (!isOpened) {
            const openDate = new Date(capsule.openAt);
            const now = new Date();
            const diffTime = Math.abs(openDate - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let timeString = '';
            if (diffDays > 365) {
                timeString = `${Math.floor(diffDays / 365)} 年后`;
            } else if (diffDays > 30) {
                timeString = `${Math.floor(diffDays / 30)} 个月后`;
            } else {
                timeString = `${diffDays} 天后`;
            }
            
            countdownHtml = `<span class="countdown" title="具体日期: ${capsule.openAt}"><i class="fa-solid fa-hourglass-half"></i> ${timeString}开启</span>`;
        } else {
            countdownHtml = `<span title="开启日期: ${capsule.openAt}"><i class="fa-regular fa-clock"></i> ${capsule.openAt.split('-')[0]}</span>`;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div class="author-info">
                    <div class="avatar">${capsule.author.avatar}</div>
                    <div class="author-meta">
                        <div class="author-name">${capsule.author.name}</div>
                        <div class="create-date">封存于 ${capsule.createdAt}</div>
                    </div>
                </div>
            </div>
            <h3 class="card-title">${capsule.title}</h3>
            <div class="capsule-code" onclick="copyCode(event, '${capsule.code}')" title="点击复制胶囊码">
                <i class="fa-solid fa-hashtag"></i> ${capsule.code}
            </div>
            
            <div class="card-preview ${!isOpened ? 'locked' : ''}">
                ${isOpened ? capsule.preview : '内容已被时间封存，直到开启之日才会显现...'}
                ${!isOpened ? `
                <div class="locked-overlay">
                    <i class="fa-solid fa-lock" style="font-size: 1.5rem; color: var(--secondary-glow)"></i>
                    <span>尚未到期</span>
                </div>
                ` : ''}
            </div>
            
            <div class="card-actions">
                <button class="action-btn primary" onclick="viewCapsule(event, ${capsule.id})" ${!isOpened ? 'disabled title="胶囊未到期"' : ''}>
                    <i class="fa-regular fa-eye"></i> 查看
                </button>
                <button class="action-btn" onclick="toggleLike(event, ${capsule.id})" title="收藏">
                    <i class="${capsule.isLiked ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${capsule.isLiked ? '#ff4757' : 'inherit'}"></i> 
                    <span>${capsule.likes}</span>
                </button>
            </div>
            
            <div class="card-footer">
                <div class="status-badge ${statusClass}">
                    <i class="fa-solid ${statusIcon}"></i>
                    ${statusText}
                </div>
                <div class="meta-info">
                    ${countdownHtml}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function copyCode(event, code) {
    event.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
        showToast(`已复制胶囊码: ${code}`, 'success');
    }).catch(err => {
        showToast('复制失败', 'warning');
    });
}

function viewCapsule(event, id) {
    event.stopPropagation();
    const capsule = capsules.find(c => c.id === id);
    if (capsule && capsule.status === 'opened') {
        showToast('正在打开胶囊详情...', 'success');
    } else {
        showToast('胶囊尚未到期，无法查看', 'warning');
    }
}

function checkLoginAndOpen() {
    if (!isLoggedIn) {
        showToast('请先登录才能通过胶囊码开启', 'warning');
        toggleModal('login-modal');
    } else {
        const code = prompt('请输入要开启的胶囊码：');
        if (code) {
            showToast(`正在查询胶囊: ${code}...`, 'success');
        }
    }
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('active');
}

function simulateLogin() {
    const inputs = document.querySelectorAll('#login-modal input');
    if (!inputs[0].value || !inputs[1].value) {
        showToast('请输入邮箱和密码', 'warning');
        return;
    }

    const btn = document.querySelector('.modal-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 验证中...';
    
    setTimeout(() => {
        isLoggedIn = true;
        toggleModal('login-modal');
        showToast('登录成功！欢迎回来', 'success');
        btn.innerHTML = originalText;
        
        // 更新导航栏状态
        const authBtn = document.querySelector('.nav-actions .btn-outline');
        authBtn.outerHTML = `
            <div class="author-info" style="cursor: pointer; padding: 0.5rem 1rem; border: 1px solid var(--glass-border); border-radius: 8px; background: rgba(255,255,255,0.05);">
                <div class="avatar" style="width: 28px; height: 28px; font-size: 0.8rem;">U</div>
                <span style="font-weight: 500;">User</span>
            </div>
        `;
    }, 1000);
}

function checkLoginAndPublish() {
    if (!isLoggedIn) {
        showToast('请先登录才能发布胶囊', 'warning');
        toggleModal('login-modal');
    } else {
        showToast('跳转到胶囊创作页面...', 'success');
    }
}

function toggleLike(event, id) {
    event.stopPropagation();
    
    if (!isLoggedIn) {
        showToast('请先登录才能收藏胶囊', 'warning');
        toggleModal('login-modal');
        return;
    }

    const capsule = capsules.find(c => c.id === id);
    if (capsule) {
        capsule.isLiked = !capsule.isLiked;
        capsule.likes += capsule.isLiked ? 1 : -1;
        renderCapsules();
        
        if (capsule.isLiked) {
            showToast('已加入收藏夹', 'success');
        }
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast glass-panel';
    
    const icon = type === 'success' ? 'fa-circle-check success' : 'fa-circle-exclamation warning';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if(toast.parentElement) {
            toast.remove();
        }
    }, 3500);
}