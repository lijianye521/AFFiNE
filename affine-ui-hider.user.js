// ==UserScript==
// @name         AFFiNE UI元素隐藏脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  100%有效隐藏AFFiNE的顶部横幅和Download App按钮
// @author       您的名字
// @match        http://localhost:3010/*
// @match        http://127.0.0.1:3010/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=affine.pro
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log('[AFFiNE UI Hider] 脚本已加载');

    // 隐藏函数
    function hideElements() {
        let hiddenCount = 0;

        // 1. 隐藏顶部红色横幅（多种方法确保隐藏）
        const bannerSelectors = [
            '[data-testid="local-demo-tips"]',
            '[class*="tipsContainer"]',
            '[class*="localDemoTips"]',
            'div[style*="backgroundErrorColor"]'
        ];

        bannerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.style.display !== 'none') {
                    el.style.cssText = 'display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important;';
                    hiddenCount++;
                    console.log(`[AFFiNE UI Hider] 隐藏横幅: ${selector}`);
                }
            });
        });

        // 2. 隐藏Download App按钮（通过文本内容）
        const allButtons = document.querySelectorAll('button, a');
        allButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('Download App') ||
                text.includes('download') && text.includes('app')) {
                if (btn.style.display !== 'none') {
                    btn.style.cssText = 'display: none !important; visibility: hidden !important;';
                    hiddenCount++;
                    console.log('[AFFiNE UI Hider] 隐藏Download App按钮');

                    // 同时隐藏父容器（如果父容器只有这一个按钮）
                    const parent = btn.parentElement;
                    if (parent && parent.children.length === 1) {
                        parent.style.cssText = 'display: none !important;';
                    }
                }
            }
        });

        // 3. 隐藏文档图标选择按钮（新增）
        const iconSelectors = [
            '.doc-icon-container',
            'div.doc-icon-container',
            'button[aria-label="Select Icon"]',
            'button[title="Select Icon"]',
            '[class*="doc-icon"]'
        ];

        iconSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.style.display !== 'none') {
                    el.style.cssText = 'display: none !important; visibility: hidden !important; height: 0 !important; padding: 0 !important; margin: 0 !important;';
                    hiddenCount++;
                    console.log(`[AFFiNE UI Hider] 隐藏图标按钮: ${selector}`);
                }
            });
        });

        // 4. 隐藏"Add icon"按钮（通过文本）
        const iconButtons = document.querySelectorAll('button');
        iconButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text === 'Add icon' || text.includes('Add icon')) {
                if (btn.style.display !== 'none') {
                    btn.style.cssText = 'display: none !important; visibility: hidden !important;';
                    // 隐藏父容器
                    if (btn.parentElement) {
                        btn.parentElement.style.cssText = 'display: none !important;';
                    }
                    hiddenCount++;
                    console.log('[AFFiNE UI Hider] 隐藏Add icon按钮');
                }
            }
        });

        // 5. 隐藏分隔线
        const separators = document.querySelectorAll('span._1f82jwd, span[class*="_1f82jwd"]');
        separators.forEach(sep => {
            if (sep && sep.style.display !== 'none') {
                sep.style.cssText = 'display: none !important;';
                hiddenCount++;
            }
        });

        // 6. 隐藏底部更新按钮（如果存在）
        const updateButtons = document.querySelectorAll('[class*="updater"], [class*="update"]');
        updateButtons.forEach(btn => {
            if (btn.tagName === 'BUTTON' || btn.tagName === 'A') {
                if (btn.style.display !== 'none') {
                    btn.style.cssText = 'display: none !important;';
                    hiddenCount++;
                }
            }
        });

        if (hiddenCount > 0) {
            console.log(`[AFFiNE UI Hider] 本次隐藏了 ${hiddenCount} 个元素`);
        }
    }

    // 添加全局CSS样式（作为备用）
    function addGlobalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏顶部横幅 */
            [data-testid="local-demo-tips"],
            [class*="tipsContainer"],
            [class*="localDemoTips"],
            [class*="browserWarningStyle"] {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
            }

            /* 隐藏Download App按钮 */
            button:has-text("Download App"),
            a:has-text("Download App"),
            [class*="downloadButton"],
            [class*="download-button"],
            a[href*="/download"] {
                display: none !important;
                visibility: hidden !important;
            }

            /* 隐藏文档图标选择按钮 */
            .doc-icon-container,
            div.doc-icon-container,
            button[aria-label="Select Icon"],
            button[title="Select Icon"],
            [class*="doc-icon"] {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            /* 隐藏分隔线 */
            span._1f82jwd,
            span[class*="_1f82jwd"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[AFFiNE UI Hider] CSS样式已注入');
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        hideElements();
    });

    // 页面加载完成后开始监听
    function init() {
        console.log('[AFFiNE UI Hider] 初始化...');

        // 立即隐藏一次
        hideElements();

        // 添加CSS
        addGlobalCSS();

        // 开始监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定时检查（作为backup）
        setInterval(hideElements, 1000);

        console.log('[AFFiNE UI Hider] 初始化完成，正在监听DOM变化');
    }

    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 立即执行一次（在页面加载前）
    if (document.body) {
        hideElements();
    }
})();
