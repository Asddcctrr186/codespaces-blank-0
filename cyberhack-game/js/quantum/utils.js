class SystemUtils {
    constructor() {
        this.crypto = new CryptoEngine();
        this.logger = new LogManager();
        this.cache = new CacheSystem();
        this.metrics = new MetricsCollector();
    }

    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

class CryptoEngine {
    async hash(data, algorithm = 'SHA-256') {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    generateKey(length = 32) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        return Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map(x => charset[x % charset.length])
            .join('');
    }

    async encrypt(data, key) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const keyBuffer = await this.deriveKey(key);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            keyBuffer,
            dataBuffer
        );

        return {
            data: Array.from(new Uint8Array(encryptedData)),
            iv: Array.from(iv)
        };
    }
}

class LogManager {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.listeners = new Set();
    }

    log(level, message, context = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            id: SystemUtils.generateUUID()
        };

        this.logs.push(logEntry);
        this.trim();
        this.notifyListeners(logEntry);
        return logEntry.id;
    }

    query(filter) {
        return this.logs.filter(log => {
            return Object.entries(filter).every(([key, value]) => {
                return log[key] === value;
            });
        });
    }
}

class CacheSystem {
    constructor() {
        this.cache = new Map();
        this.stats = { hits: 0, misses: 0 };
        this.maxSize = 100;
    }

    set(key, value, ttl = 3600) {
        const entry = {
            value,
            expires: Date.now() + (ttl * 1000),
            accessed: 0,
            created: Date.now()
        };

        this.cache.set(key, entry);
        this.cleanup();
        return true;
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        if (entry.expires < Date.now()) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        entry.accessed++;
        this.stats.hits++;
        return entry.value;
    }
}

class MetricsCollector {
    constructor() {
        this.metrics = new Map();
        this.startTime = Date.now();
        this.initializeMetrics();
    }

    initializeMetrics() {
        this.metrics.set('system', {
            uptime: () => Date.now() - this.startTime,
            memory: () => performance.memory?.usedJSHeapSize || 0,
            cpu: () => navigator.hardwareConcurrency || 1
        });
    }

    track(category, name, value) {
        const metricKey = `${category}:${name}`;
        const metric = {
            value,
            timestamp: Date.now(),
            metadata: {
                browser: navigator.userAgent,
                platform: navigator.platform
            }
        };

        if (!this.metrics.has(category)) {
            this.metrics.set(category, new Map());
        }
        this.metrics.get(category).set(name, metric);
    }
}

class DataFormatter {
    static formatDuration(ms) {
        const units = [
            { label: 'd', div: 86400000 },
            { label: 'h', div: 3600000 },
            { label: 'm', div: 60000 },
            { label: 's', div: 1000 },
            { label: 'ms', div: 1 }
        ];

        return units.reduce((acc, unit) => {
            const value = Math.floor(ms / unit.div);
            ms %= unit.div;
            return value ? `${acc}${value}${unit.label} ` : acc;
        }, '').trim();
    }

    static formatTable(data, columns) {
        const columnWidths = columns.map(col => 
            Math.max(col.length, ...data.map(row => String(row[col]).length))
        );

        const separator = columnWidths.map(w => '-'.repeat(w)).join('-+-');
        const header = columns.map((col, i) => 
            col.padEnd(columnWidths[i])
        ).join(' | ');

        const rows = data.map(row =>
            columns.map((col, i) => 
                String(row[col]).padEnd(columnWidths[i])
            ).join(' | ')
        );

        return `${header}\n${separator}\n${rows.join('\n')}`;
    }
}

// Initialize and export
const utils = new SystemUtils();
export default utils;