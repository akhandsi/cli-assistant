const store = require ('../store/store.js');

module.exports = {
    init: function () {
        const {remote} = require ('electron');
        const options = store.loadStore ();
        
        let isDarkMode;
        
        // if we do not have user's preference then use from system
        const haveUseThemeInStore = options.custom.shouldUseDarkColors !== undefined;
        if (haveUseThemeInStore) {
            isDarkMode = options.custom.shouldUseDarkColors;
        } else {
            isDarkMode = remote.nativeTheme.shouldUseDarkColors;
        }
        
        this.setTheme (isDarkMode);
        remote.nativeTheme.on ('updated', () => {
            this.setTheme (isDarkMode);
        });
    },
    setTheme: function (isDarkMode) {
        store.setDarkMode (isDarkMode);
        document.documentElement.setAttribute (
            'data-theme',
            isDarkMode ? 'dark' : 'light',
        );
    }
}
