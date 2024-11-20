class CyberHack {
    constructor() {
        this.level = 1;
        this.points = 0;
        this.systems = {
            'mainframe': { security: 3, hacked: false },
            'database': { security: 4, hacked: false },
            'firewall': { security: 5, hacked: false }
        };
        this.init();
    }

    init() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('commandInput');
        this.statusBar = document.getElementById('status');
        this.timeDisplay = document.getElementById('time');
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processCommand(this.input.value);
                this.input.value = '';
            }
        });

        this.updateClock();
        this.welcome();
    }

    updateClock() {
        setInterval(() => {
            const now = new Date();
            this.timeDisplay.textContent = now.toLocaleTimeString();
        }, 1000);
    }

    welcome() {
        this.print(`
            ╔══════════════════════════════════════╗
            ║         CYBERHACK V1.0               ║
            ║     Advanced Hacking Terminal        ║
            ╚══════════════════════════════════════╝
            
            Type 'help' for available commands.
        `, 'success');
    }

    print(message, type = '') {
        const div = document.createElement('div');
        div.className = type;
        div.textContent = message;
        this.output.appendChild(div);
        this.output.scrollTop = this.output.scrollHeight;
    }

    processCommand(cmd) {
        const command = cmd.toLowerCase().trim();
        this.print(`> ${cmd}`);

        switch(command) {
            case 'help':
                this.showHelp();
                break;
            case 'scan':
                this.scanSystems();
                break;
            case 'status':
                this.showStatus();
                break;
            case 'hack':
                this.initiateHack();
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            case 'initialize_hacking_sequence':
                this.initializeHackingSequence();
                break;
            default:
                this.print('Command not recognized. Type "help" for available commands.', 'error');
        }
    }

    showHelp() {
        this.print(`
            Available Commands:
            - help                        : Show this help message
            - scan                        : Scan for vulnerable systems
            - status                      : Show current progress
            - hack                        : Attempt to hack current target
            - clear                       : Clear terminal
            - initialize_hacking_sequence : Start advanced hacking sequence
        `, 'warning');
    }

    scanSystems() {
        this.print('Scanning for vulnerable systems...', 'warning');
        setTimeout(() => {
            Object.entries(this.systems).forEach(([name, system]) => {
                if (!system.hacked) {
                    this.print(`Found: ${name} | Security Level: ${system.security}`, 'success');
                }
            });
        }, 1500);
    }

    showStatus() {
        this.print(`
            Level: ${this.level}
            Points: ${this.points}
            Systems Hacked: ${Object.values(this.systems).filter(s => s.hacked).length}/${Object.keys(this.systems).length}
        `);
    }

    initiateHack() {
        const target = Object.entries(this.systems).find(([_, system]) => !system.hacked);
        if (!target) {
            this.print('No available systems to hack!', 'error');
            return;
        }

        this.print(`Attempting to hack ${target[0]}...`, 'warning');
        
        const hackingGame = () => {
            const code = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            const guess = prompt(`Enter the 4-digit code for ${target[0]}: (${code})`);
            
            if (guess === code) {
                this.systems[target[0]].hacked = true;
                this.points += 100 * this.systems[target[0]].security;
                this.print(`Successfully hacked ${target[0]}!`, 'success');
                this.showStatus();
            } else {
                this.print('Hack failed! Security systems detected!', 'error');
            }
        };

        setTimeout(hackingGame, 2000);
    }

    initializeHackingSequence() {
        const sequences = [
            { type: 'status', text: 'INITIALIZING NEURAL INTERFACE...', delay: 1000 },
            { type: 'warning', text: 'BYPASSING SECURITY PROTOCOLS...', delay: 1500 },
            { type: 'error', text: 'WARNING: FIREWALL DETECTED!', delay: 2000 },
            { type: 'status', text: 'DEPLOYING QUANTUM DECRYPTION...', delay: 2500 },
            { type: 'success', text: 'ACCESS GRANTED - BEGINNING SYSTEM INFILTRATION', delay: 3000 }
        ];

        let totalDelay = 0;
        sequences.forEach(seq => {
            setTimeout(() => {
                this.print(seq.text, seq.type);
                this.updateStatus(seq.text);
                
                document.querySelector('.terminal-container').style.animation = 'glitch 0.3s infinite';
                setTimeout(() => {
                    document.querySelector('.terminal-container').style.animation = '';
                }, 300);
            }, totalDelay);
            totalDelay += seq.delay;
        });

        setTimeout(() => {
            this.startHackingMinigame();
        }, totalDelay);
    }

    startHackingMinigame() {
        const target = {
            name: 'MAINFRAME',
            security: ['ALPHA', 'BETA', 'GAMMA', 'DELTA'],
            currentLevel: 0
        };

        this.print(`TARGET ACQUIRED: ${target.name}`, 'warning');
        this.print('SECURITY LAYERS DETECTED: ' + target.security.length, 'warning');
        this.print('INITIATE BREACH SEQUENCE? [Y/N]', 'status');

        this.hackingModeEnabled = true;
        this.currentTarget = target;
    }

    processHackingInput(input) {
        if (!this.hackingModeEnabled) return;

        if (input === 'Y') {
            this.startBreachSequence();
        } else if (input === 'N') {
            this.hackingModeEnabled = false;
            this.print('BREACH SEQUENCE ABORTED', 'error');
        } else {
            this.handleHackingCommand(input);
        }
    }

    startBreachSequence() {
        const securityLayer = this.currentTarget.security[this.currentTarget.currentLevel];
        this.print(`BREACHING SECURITY LAYER: ${securityLayer}`, 'warning');
        
        const accessCode = Array.from({length: 4}, () => 
            Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
        
        this.print(`ACCESS CODE REQUIRED: ${accessCode}`, 'status');
        this.currentAccessCode = accessCode;
    }

    handleHackingCommand(input) {
        if (input === this.currentAccessCode) {
            this.currentTarget.currentLevel++;
            this.print('SECURITY LAYER BREACHED!', 'success');
            
            if (this.currentTarget.currentLevel >= this.currentTarget.security.length) {
                this.completeHack();
            } else {
                this.startBreachSequence();
            }
        } else {
            this.print('INVALID ACCESS CODE - SECURITY ALERT TRIGGERED!', 'error');
            this.securityCountermeasures();
        }
    }

    completeHack() {
        this.hackingModeEnabled = false;
        this.print('SYSTEM SUCCESSFULLY COMPROMISED', 'success');
        this.print('DOWNLOADING CLASSIFIED DATA...', 'status');
        
        document.body.style.animation = 'success-flash 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    securityCountermeasures() {
        this.print('INITIATING SYSTEM LOCKDOWN...', 'error');
        document.querySelector('.terminal-window').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.querySelector('.terminal-window').style.animation = '';
        }, 500);
    }
}

// Initialize the game
const game = new CyberHack();