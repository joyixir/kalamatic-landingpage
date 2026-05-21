'use strict';

var chatSiteConfig = {
    supportContactUrl: 'tel:+982632238307',
    chat: {
        // Set to true only when you want chat actions enabled across the landing.
        enabled: false,
        provider: 'raychat',
        pages: {
            landing: {
                autoload: true,
                raychatId: 'f5eb30e7-900f-42dd-9ea8-afac645b5c19'
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.KALAMATIC_SITE_CONFIG = chatSiteConfig;
}

if (typeof module === 'object' && module.exports) {
    module.exports = chatSiteConfig;
}
