const Store = require('electron-store');
const store = new Store();

module.exports = {
    store: store,
    defaults: {
        width: 660,
        height: 1000,
        minWidth: 600,
        minHeight: 800,
        maxWidth: 660,
        maxHeight: 800,
        resizable: true,
    },
    loadStore: function () {
        return {
            defaults: this.defaults,
            custom: {
                cliFilePath: this.store.get('custom.cliFilePath'),
                width: this.store.get('custom.width', this.defaults.width),
                height: this.store.get('custom.height', this.defaults.height),
                resizable: this.store.get('custom.resizable', this.defaults.resizable),
                minWidth: this.store.get('custom.minWidth', this.defaults.minWidth),
                minHeight: this.store.get('custom.minHeight', this.defaults.minHeight),
                maxWidth: this.store.get('custom.maxWidth', this.defaults.maxWidth),
                maxHeight: this.store.get('custom.maxHeight', this.defaults.maxHeight),
                shouldUseDarkColors: this.store.get('custom.shouldUseDarkColors'),
            }
        };
    },
    saveWindowState: function (mainWindow) {
        this.store.set('defaults', this.defaults);
        this.store.set('custom.width', mainWindow.getBounds().width);
        this.store.set('custom.height', mainWindow.getBounds().height);
        this.store.set('custom.minWidth', mainWindow.getMinimumSize()[0]);
        this.store.set('custom.minHeight', mainWindow.getMinimumSize()[1]);
        this.store.set('custom.maxWidth', mainWindow.getMaximumSize()[0]);
        this.store.set('custom.maxHeight', mainWindow.getMaximumSize()[1]);
        this.store.set('custom.resizable', mainWindow.resizable);
        this.store.get('custom.cliFilePath', mainWindow.resizable);
    },
    saveSettings: function (settingsValues) {
        this.store.set ('custom.cliFilePath', settingsValues.cliFilePath);
        this.store.set ('custom.resizable', settingsValues.resizable);
        this.store.set ('custom.shouldUseDarkColors', settingsValues.shouldUseDarkColors);
    },
    setDarkMode: function (isDarkMode) {
        this.store.set('custom.shouldUseDarkColors', isDarkMode);
    }
}
