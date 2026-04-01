// src/app.js

const app = {
    currentView: 'home',
    views: ['home', 'create', 'created', 'search', 'read-locked', 'read-unlocked', 'about', 'admin'],
    adminClickCount: 0,

    init() {
        console.log("HelloTime Protocol Initialized.");
        this.startTimers();
        this.setupSecretTrigger();
    },

    setupSecretTrigger() {
        const trigger = document.getElementById('secret-admin-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                this.adminClickCount++;
                if (this.adminClickCount >= 5) {
                    this.adminClickCount = 0;
                    this.navigate('admin');
                }
            });
        }
    },

    navigate(viewId) {
        if (!this.views.includes(viewId)) return;
        
        // Hide all views
        document.querySelectorAll('.view').forEach(el => {
            el.classList.remove('active');
        });

        // Show target view
        document.getElementById(`view-${viewId}`).classList.add('active');
        this.currentView = viewId;

        // Trigger animations if needed
        if (viewId === 'read-unlocked') {
            this.triggerDecryptionAnimation();
        }
    },

    simulateSearch() {
        const codeInput = document.getElementById('search-code-input');
        const code = codeInput ? codeInput.value.trim() : '';
        
        if (code.length < 8) {
            alert("请输入8位提取码");
            return;
        }

        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "正在查询...";
        
        setTimeout(() => {
            btn.innerText = originalText;
            
            // Randomly pick locked or unlocked for demo, or based on input string
            // Even length codes -> unlocked, Odd length -> locked (just a determinist pseudo logic for demo)
            const sum = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            
            if (sum % 2 === 0) {
                this.navigate('read-unlocked');
            } else {
                this.navigate('read-locked');
            }
        }, 800);
    },

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        
        // Toggle icons
        const sun = document.querySelector('.sun-icon');
        const moon = document.querySelector('.moon-icon');
        if (newTheme === 'light') {
            sun.style.display = 'none';
            moon.style.display = 'block';
        } else {
            sun.style.display = 'block';
            moon.style.display = 'none';
        }
    },

    triggerDecryptionAnimation() {
        const overlay = document.getElementById('decrypt-overlay');
        overlay.style.display = 'flex';
        // reset binary string
        const binaryContainer = overlay.querySelector('.binary-rain');
        
        let interval = setInterval(() => {
            let str = '';
            for(let i=0; i<100; i++) {
                str += Math.round(Math.random());
            }
            binaryContainer.innerText = str + str + str;
        }, 50);

        // Hide overlay after animation
        setTimeout(() => {
            clearInterval(interval);
            overlay.style.display = 'none';
        }, 3000); // sync with CSS animation time
    },

    adminLogin() {
        const pwd = document.getElementById('admin-pwd').value;
        if(pwd === '') return;
        
        const btn = event.target.querySelector('button');
        const old = btn.innerText;
        btn.innerText = "正在验证...";
        
        setTimeout(() => {
            document.getElementById('admin-login-box').style.display = 'none';
            document.getElementById('admin-dashboard-box').style.display = 'block';
            btn.innerText = old;
            document.getElementById('admin-pwd').value = '';
        }, 600);
    },

    adminLogout() {
        document.getElementById('admin-dashboard-box').style.display = 'none';
        document.getElementById('admin-login-box').style.display = 'block';
    },

    deleteCapsule(btn) {
        if(confirm('确定要删除该胶囊吗？此操作不可恢复。')) {
            const tr = btn.closest('tr');
            tr.style.opacity = '0.3';
            tr.style.transform = 'translateX(20px)';
            setTimeout(() => tr.remove(), 300);
        }
    },

    startTimers() {
        // Just a simple visual countdown tick for the locked view demo
        const secElement = document.getElementById('locked-sec');
        if(!secElement) return;

        setInterval(() => {
            let currentStr = secElement.innerText;
            let currentNum = parseInt(currentStr, 10);
            if(isNaN(currentNum)) return;

            currentNum = currentNum - 1;
            if (currentNum < 0) currentNum = 59;
            
            secElement.innerText = currentNum < 10 ? '0' + currentNum : currentNum;
        }, 1000);
    }
};

// Start the app on load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
