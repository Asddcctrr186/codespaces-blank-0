class TerminalEffects {
    constructor() {
        this.initializeEffects();
        this.setupEventListeners();
    }

    initializeEffects() {
        this.systemStats = {
            cpu: 0,
            memory: 0
        };
        this.coordinates = { x: 0, y: 0 };
        this.updateSystemStats();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.updateCoordinates(e));
        this.setupQuickActions();
    }

    updateSystemStats() {
        setInterval(() => {
            this.systemStats.cpu = Math.floor(Math.random() * 100);
            this.systemStats.memory = Math.floor(Math.random() * 100);
            
            document.getElementById('cpu-usage').textContent = `CPU: ${this.systemStats.cpu}%`;
            document.getElementById('memory-usage').textContent = `MEM: ${this.systemStats.memory}%`;
        }, 2000);
    }

    updateCoordinates(e) {
        this.coordinates.x = Math.floor(e.clientX);
        this.coordinates.y = Math.floor(e.clientY);
        document.getElementById('coordinates').textContent = 
            `X: ${this.coordinates.x} Y: ${this.coordinates.y}`;
    }

    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupQuickActions() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'scan':
                this.createNotification('Scanning network...', 'info');
                break;
            case 'hack':
                this.initiateHackSequence();
                break;
            case 'decrypt':
                this.createNotification('Decryption module activated', 'warning');
                break;
            case 'analyze':
                this.createNotification('System analysis in progress', 'info');
                break;
        }
    }

    initiateHackSequence() {
        const modal = document.getElementById('hackingModal');
        modal.style.display = 'flex';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    modal.style.display = 'none';
                    this.createNotification('Hack successful!', 'success');
                }, 500);
            }
            modal.querySelector('.hack-progress').style.width = `${progress}%`;
            modal.querySelector('.hack-status').textContent = 
                `Progress: ${Math.floor(progress)}%`;
        }, 100);
    }
}

// Initialize Terminal Effects
const terminalEffects = new TerminalEffects();
