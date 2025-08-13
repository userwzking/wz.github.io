// 平衡源码保护系统 - 保护源码但不影响正常使用
(function() {
    'use strict';
    
    // 基础配置 - 更平衡的设置
    const _config = {
        enableProtection: true,
        enableObfuscation: true,
        enableAntiDebug: true,
        enableSourceHide: true,
        enableCodeEncryption: true,
        enableBreakpointProtection: true, // 新增：断点防护
        enableSelfDestruct: false, // 关闭自毁机制
        enableAntiTamper: false,  // 关闭防篡改检测
        enableMemoryProtection: false, // 关闭内存保护
        aggressiveMode: false     // 关闭激进模式
    };
    
    // 代码混淆和加密
    function _obfuscateAndEncrypt() {
        if (!_config.enableObfuscation) return;
        
        try {
            // 字符串混淆
            const _stringMap = {
                'a': 'b', 'c': 'd', 'e': 'f', 'g': 'h', 'i': 'j',
                'k': 'l', 'm': 'n', 'o': 'p', 'q': 'r', 's': 't',
                'u': 'v', 'w': 'x', 'y': 'z', '0': '1', '2': '3',
                '4': '5', '6': '7', '8': '9'
            };
            
            // 动态生成混淆函数
            for (let i = 0; i < 20; i++) { // 减少数量
                const _funcName = '_' + Math.random().toString(36).substr(2, 10);
                window[_funcName] = function() {
                    return Math.random().toString(36);
                };
            }
            
            // 代码加密
            if (_config.enableCodeEncryption) {
                const _encryptCode = function(code) {
                    return btoa(encodeURIComponent(code));
                };
                
                // 加密关键函数
                const _functions = {
                    'loadVideo': loadVideo ? loadVideo.toString() : '',
                    'showStatus': showStatus ? showStatus.toString() : '',
                    'createParticles': createParticles ? createParticles.toString() : ''
                };
                
                for (let key in _functions) {
                    if (_functions[key]) {
                        const _encrypted = _encryptCode(_functions[key]);
                        window['_encrypted_' + key] = _encrypted;
                        try {
                            delete window[key];
                        } catch(e) {}
                    }
                }
            }
        } catch(e) {}
    }
    
    // 断点防护系统 - 新增
    function _breakpointProtection() {
        if (!_config.enableBreakpointProtection) return;
        
        try {
            // 方法1: 函数执行时间检测
            const _originalFunctions = new Map();
            
            // 包装关键函数，检测执行时间异常
            const _wrapFunction = (func, name) => {
                if (typeof func !== 'function') return func;
                
                const _wrapped = function(...args) {
                    const _start = performance.now();
                    const _result = func.apply(this, args);
                    const _end = performance.now();
                    
                    // 如果执行时间异常长（可能是断点暂停），触发警告
                    if (_end - _start > 1000) { // 1秒阈值
                        _warningCount++;
                        if (_warningCount >= _maxWarnings) {
                            _showWarningScreen();
                        }
                    }
                    
                    return _result;
                };
                
                _originalFunctions.set(name, func);
                return _wrapped;
            };
            
            // 包装页面上的关键函数
            if (typeof loadVideo === 'function') {
                window.loadVideo = _wrapFunction(loadVideo, 'loadVideo');
            }
            if (typeof showStatus === 'function') {
                window.showStatus = _wrapFunction(showStatus, 'showStatus');
            }
            if (typeof createParticles === 'function') {
                window.createParticles = _wrapFunction(createParticles, 'createParticles');
            }
            
            // 方法2: 智能debugger检测
            let _debuggerCount = 0;
            const _maxDebuggerCount = 5;
            
            const _smartDebuggerDetector = () => {
                try {
                    // 使用多种方式检测断点
                    const _start = Date.now();
                    debugger;
                    const _end = Date.now();
                    
                    // 如果debugger被跳过（正常情况），时间差应该很小
                    if (_end - _start < 10) {
                        _debuggerCount = 0; // 重置计数
                    } else {
                        _debuggerCount++;
                        if (_debuggerCount >= _maxDebuggerCount) {
                            _warningCount++;
                            if (_warningCount >= _maxWarnings) {
                                _showWarningScreen();
                            }
                        }
                    }
                } catch(e) {
                    _debuggerCount = 0;
                }
            };
            
            // 方法3: 代码完整性检测
            const _checkCodeIntegrity = () => {
                try {
                    // 检查关键函数是否被修改
                    const _functions = ['loadVideo', 'showStatus', 'createParticles'];
                    for (let funcName of _functions) {
                        if (window[funcName] && _originalFunctions.has(funcName)) {
                            if (window[funcName] !== _originalFunctions.get(funcName)) {
                                _warningCount++;
                                if (_warningCount >= _maxWarnings) {
                                    _showWarningScreen();
                                }
                                break;
                            }
                        }
                    }
                } catch(e) {}
            };
            
            // 启动断点防护检测
            setInterval(_smartDebuggerDetector, 2000);
            setInterval(_checkCodeIntegrity, 5000);
            
        } catch(e) {}
    }
    
    // 增强源码隐藏系统 - 新增
    function _enhancedSourceHide() {
        if (!_config.enableSourceHide) return;
        
        try {
            // 方法1: 动态内容生成 - 延迟显示真实内容
            const _delayContent = () => {
                // 隐藏原始内容
                const _style = document.createElement('style');
                _style.textContent = `
                    .source-protected { 
                        opacity: 0; 
                        transition: opacity 0.5s ease-in-out;
                    }
                    .source-protected.loaded { 
                        opacity: 1; 
                    }
                `;
                document.head.appendChild(_style);
                
                // 为所有内容添加保护类
                document.body.classList.add('source-protected');
                
                // 延迟显示内容
                setTimeout(() => {
                    document.body.classList.add('loaded');
                }, 1000);
            };
            
            // 方法2: DOM结构混淆
            const _obfuscateDOM = () => {
                // 随机添加无用的DOM元素
                const _addNoise = () => {
                    const _noise = document.createElement('div');
                    _noise.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;';
                    _noise.innerHTML = '<!-- ' + Math.random().toString(36) + ' -->';
                    document.body.appendChild(_noise);
                };
                
                // 添加一些噪音元素
                for (let i = 0; i < 5; i++) {
                    _addNoise();
                }
            };
            
            // 方法3: 代码注入混淆
            const _injectConfusingCode = () => {
                // 注入一些混淆的JavaScript代码
                const _script = document.createElement('script');
                _script.textContent = `
                    // 混淆代码 - 增加源码阅读难度
                    (function(){
                        var _0x1a2b = ['prototype', 'constructor', 'toString', 'call', 'apply'];
                        var _0x3c4d = function(_0x5e6f) {
                            return _0x1a2b[_0x5e6f];
                        };
                        window._confusion = _0x3c4d;
                    })();
                `;
                document.head.appendChild(_script);
            };
            
            // 执行增强保护
            _delayContent();
            _obfuscateDOM();
            _injectConfusingCode();
            
        } catch(e) {}
    }
    
    // 平衡的源码隐藏
    function _balancedSourceHide() {
        if (!_config.enableSourceHide) return;
        
        // 禁用右键菜单
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });
        
        // 禁用部分快捷键 - 保留必要的操作
        document.addEventListener('keydown', e => {
            const _key = e.key?.toUpperCase();
            const _ctrl = e.ctrlKey;
            const _shift = e.shiftKey;
            
            // 禁用F12
            if (_key === 'F12') {
                e.preventDefault();
                return false;
            }
            
            // 禁用Ctrl+Shift+I/J/C (开发者工具)
            if (_ctrl && _shift && ['I', 'J', 'C'].includes(_key)) {
                e.preventDefault();
                return false;
            }
            
            // 禁用Ctrl+U (查看源码)
            if (_ctrl && _key === 'U') {
                e.preventDefault();
                return false;
            }
            
            // 禁用Ctrl+S (保存页面)
            if (_ctrl && _key === 'S') {
                e.preventDefault();
                return false;
            }
            
            // 保留F5和Ctrl+R (刷新) - 允许正常刷新
            // 保留Ctrl+A (全选) - 允许正常选择
        });
        
        // 禁用文本选择
        document.addEventListener('selectstart', e => {
            e.preventDefault();
            return false;
        });
        
        // 禁用复制
        document.addEventListener('copy', e => {
            e.preventDefault();
            return false;
        });
        
        // 禁用拖拽
        document.addEventListener('dragstart', e => {
            e.preventDefault();
            return false;
        });
        
        // 禁用打印
        window.addEventListener('beforeprint', e => {
            e.preventDefault();
            return false;
        });
    }
    
    // 平衡的反调试系统
    function _balancedAntiDebug() {
        if (!_config.enableAntiDebug) return;
        
        let _devtoolsOpen = false;
        const _threshold = 160;
        let _warningCount = 0;
        const _maxWarnings = 3; // 最多警告3次
        
        // 方法1: 窗口大小检测
        const _checkWindowSize = () => {
            const _widthThreshold = window.outerWidth - window.innerWidth > _threshold;
            const _heightThreshold = window.outerHeight - window.innerHeight > _threshold;
            
            if (_widthThreshold || _heightThreshold) {
                _devtoolsOpen = true;
                _warningCount++;
                if (_warningCount >= _maxWarnings) {
                    _showWarningScreen();
                }
            }
        };
        
        // 方法2: 控制台检测
        const _devtoolsDetector = /./;
        _devtoolsDetector.toString = function() {
            _devtoolsOpen = true;
            _warningCount++;
            if (_warningCount >= _maxWarnings) {
                _showWarningScreen();
            }
            return '';
        };
        
        // 方法3: 调试器检测
        const _debuggerDetector = () => {
            try {
                debugger;
            } catch(e) {}
        };
        
        // 启动检测器 - 降低频率
        setInterval(_checkWindowSize, 2000); // 从500ms改为2000ms
        setInterval(_debuggerDetector, 1000); // 从100ms改为1000ms
        
        // 定期检查状态 - 降低频率
        setInterval(() => {
            if (_devtoolsOpen && _warningCount >= _maxWarnings) {
                _showWarningScreen();
            }
        }, 5000); // 从100ms改为5000ms
    }
    
    // 显示警告界面 - 更友好的提示
    function _showWarningScreen() {
        try {
            // 创建警告覆盖层
            const _warningOverlay = document.createElement('div');
            _warningOverlay.id = 'balanced-protection-warning';
            _warningOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Arial', sans-serif;
                color: #ffffff;
                text-align: center;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            `;
            
            _warningOverlay.innerHTML = `
                <div style="padding: 30px; max-width: 600px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; backdrop-filter: blur(10px);">
                    <h1 style="color: #ffaa00; margin-bottom: 20px; font-size: 2.5em;">
                        ⚠️ 访问提醒
                    </h1>
                    <p style="font-size: 1.2em; margin-bottom: 15px; color: #ffcc66;">
                        检测到开发者工具访问
                    </p>
                    <p style="font-size: 1em; color: #cccccc; margin-bottom: 20px; line-height: 1.6;">
                        为了保护源码安全，请关闭开发者工具后刷新页面<br>
                        页面功能将正常恢复
                    </p>
                    <div style="margin: 20px 0;">
                        <button onclick="window.location.reload()" style="
                            background: linear-gradient(45deg, #ffaa00, #ff8800);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            margin: 0 10px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">刷新页面</button>
                        <button onclick="document.getElementById('balanced-protection-warning').remove()" style="
                            background: rgba(255, 255, 255, 0.2);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            padding: 15px 30px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 16px;
                            margin: 0 10px;
                            transition: transform 0.2s;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">关闭提示</button>
                    </div>
                    <p style="font-size: 0.9em; color: #888; margin-top: 20px;">
                        安全系统已激活 - 保护您的知识产权
                    </p>
                </div>
            `;
            
            // 添加到页面但不替换内容
            document.body.appendChild(_warningOverlay);
            
            // 允许关闭提示
            _warningOverlay.addEventListener('click', function(e) {
                if (e.target === _warningOverlay) {
                    _warningOverlay.remove();
                }
            });
            
        } catch (error) {
            console.warn('保护系统警告显示失败');
        }
    }
    
    // 初始化平衡保护系统
    function _initBalancedProtection() {
        if (!_config.enableProtection) return;
        
        try {
            // 执行保护措施
            _obfuscateAndEncrypt();
            _balancedAntiDebug();
            _enhancedSourceHide(); // 使用增强的源码隐藏
            _balancedSourceHide(); // 基础源码隐藏
            _breakpointProtection(); // 新增：初始化断点防护
            
            // 定期检查保护状态 - 降低频率
            setInterval(() => {
                // 只做基本检查，不触发破坏性操作
            }, 10000); // 10秒检查一次
            
        } catch (error) {
            console.warn('保护系统初始化失败:', error);
        }
    }
    
    // 导出保护函数（只读）
    Object.defineProperty(window, 'balancedProtection', {
        value: {
            init: _initBalancedProtection,
            showWarning: _showWarningScreen,
            config: Object.freeze({..._config}),
            version: '2.2.0',
            features: {
                breakpointProtection: _config.enableBreakpointProtection,
                antiDebug: _config.enableAntiDebug,
                sourceHide: _config.enableSourceHide
            }
        },
        writable: false,
        configurable: false,
        enumerable: false
    });
    
    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initBalancedProtection);
    } else {
        _initBalancedProtection();
    }
    
    // 防止代码被修改
    Object.freeze(_obfuscateAndEncrypt);
    Object.freeze(_breakpointProtection);
    Object.freeze(_balancedAntiDebug);
    Object.freeze(_enhancedSourceHide); // 冻结增强源码隐藏
    Object.freeze(_balancedSourceHide);
    Object.freeze(_showWarningScreen);
    Object.freeze(_initBalancedProtection);
    
})();
