(function () {
    var siteConfig = window.KALAMATIC_SITE_CONFIG || {};
    var chatConfig = siteConfig.chat || {};
    var pageKey = window.KALAMATIC_CHAT_PAGE || '';
    var pageConfig = chatConfig.pages && chatConfig.pages[pageKey] ? chatConfig.pages[pageKey] : {};
    var fallbackHref = siteConfig.supportContactUrl || '#';
    var isRaychatEnabled = Boolean(
        chatConfig.enabled &&
        chatConfig.provider === 'raychat' &&
        pageConfig.raychatId
    );
    var raychatLoader;

    function getRaychatSource(raychatId) {
        var rayToken = localStorage.getItem('rayToken');

        return rayToken
            ? 'https://app.raychat.io/scripts/js/' + raychatId + '?rid=' + rayToken + '&href=' + window.location.href
            : 'https://app.raychat.io/scripts/js/' + raychatId;
    }

    function shouldSkipAutoload() {
        var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        var prefersReducedMotion = typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
        var lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
        var constrainedNetwork = Boolean(connection && (
            connection.saveData || /2g/.test(connection.effectiveType || '')
        ));

        return prefersReducedMotion || lowMemory || lowCpu || constrainedNetwork;
    }

    function waitForRaychatToggle() {
        return new Promise(function (resolve, reject) {
            var remainingChecks = 50;

            function checkAvailability() {
                if (typeof window.raychat_toggle_container === 'function') {
                    resolve(window.raychat_toggle_container);
                    return;
                }

                remainingChecks -= 1;

                if (remainingChecks <= 0) {
                    reject(new Error('Raychat did not finish loading.'));
                    return;
                }

                window.setTimeout(checkAvailability, 100);
            }

            checkAvailability();
        });
    }

    function ensureFallbackLinks(triggers) {
        triggers.forEach(function (trigger) {
            if (trigger.hasAttribute('data-chat-direct')) {
                return;
            }

            var href = trigger.getAttribute('href');

            if (!href || href === '#') {
                trigger.setAttribute('href', fallbackHref);
            }

            if (!trigger.getAttribute('target')) {
                trigger.setAttribute('target', '_blank');
            }

            if (!trigger.getAttribute('rel')) {
                trigger.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    function syncTriggerVisibility(triggers) {
        triggers.forEach(function (trigger) {
            if (!trigger.hasAttribute('data-chat-direct')) {
                return;
            }

            trigger.hidden = !isRaychatEnabled;
        });
    }

    function ensureRaychatLoaded() {
        if (!isRaychatEnabled) {
            return Promise.resolve(null);
        }

        if (typeof window.raychat_toggle_container === 'function') {
            return Promise.resolve(window.raychat_toggle_container);
        }

        if (raychatLoader) {
            return raychatLoader;
        }

        raychatLoader = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            var firstScript = document.getElementsByTagName('script')[0];

            script.type = 'text/javascript';
            script.async = true;
            script.src = getRaychatSource(pageConfig.raychatId);
            script.onload = function () {
                waitForRaychatToggle().then(resolve).catch(reject);
            };
            script.onerror = function () {
                reject(new Error('Raychat script failed to load.'));
            };

            firstScript.parentNode.insertBefore(script, firstScript);
        }).catch(function (error) {
            raychatLoader = null;
            throw error;
        });

        return raychatLoader;
    }

    function openFallbackLink(trigger) {
        var href = trigger.getAttribute('href') || fallbackHref;

        if (trigger.getAttribute('target') === '_blank') {
            window.open(href, '_blank', 'noopener');
            return;
        }

        window.location.href = href;
    }

    function bindChatTriggers(triggers) {
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (event) {
                if (!isRaychatEnabled) {
                    if (trigger.hasAttribute('data-chat-direct')) {
                        event.preventDefault();
                    }

                    return;
                }

                event.preventDefault();

                ensureRaychatLoaded()
                    .then(function (toggleRaychat) {
                        if (typeof toggleRaychat === 'function') {
                            toggleRaychat();
                        }
                    })
                    .catch(function () {
                        openFallbackLink(trigger);
                    });
            });
        });
    }

    function scheduleAutoload() {
        if (!isRaychatEnabled || !pageConfig.autoload || shouldSkipAutoload()) {
            return;
        }

        function loadWhenIdle() {
            ensureRaychatLoaded().catch(function () {
                return null;
            });
        }

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadWhenIdle, { timeout: 2500 });
            return;
        }

        window.addEventListener('load', function () {
            window.setTimeout(loadWhenIdle, 1200);
        }, { once: true });
    }

    function init() {
        var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-chat-trigger]'));

        syncTriggerVisibility(triggers);
        ensureFallbackLinks(triggers);
        bindChatTriggers(triggers);
        scheduleAutoload();
    }

    window.KalamaticChat = {
        isEnabled: function () {
            return isRaychatEnabled;
        },
        load: ensureRaychatLoaded,
        open: function () {
            return ensureRaychatLoaded().then(function (toggleRaychat) {
                if (typeof toggleRaychat === 'function') {
                    toggleRaychat();
                    return true;
                }

                return false;
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
        return;
    }

    init();
}());
