const store = require(__dirname + '/store/store.js');

module.exports = {
    init: function() {
        this.loadSettings();
    },
    loadSettings: function () {
        const options = store.loadStore();
        this.getFilePathSetting ().innerText = this.getFileName(options.custom.cliFilePath);
        this.getResizableSetting ().checked = options.custom.resizable;
        this.getDarkModeSetting ().checked = options.custom.shouldUseDarkColors;
    },
    onFilePathValueChange: function () {
        this.getFilePathSetting ().innerText = this.getFileName(this.getFilePath());
    },
    onSettingsSave: function () {
        // save settings
        const options = store.loadStore();
        const filePath = this.getFilePath() || options.custom.cliFilePath;
        store.saveSettings({
            cliFilePath: filePath,
            resizable: this.getResizableSetting ().checked,
            shouldUseDarkColors: this.getDarkModeSetting ().checked,
        });
    
        // reload the app for the settings to take effect
        const {getCurrentWindow} = require('electron').remote;
        getCurrentWindow().reload()
    },
    getFilePathSetting: function () {
        return document.getElementById ("settingsAliasFilePath");
    },
    getFilePathPickerSetting: function () {
        return document.getElementById ("settingsAliasFilePathPicker");
    },
    getResizableSetting: function () {
        return document.getElementById ("settingsResizable");
    },
    getDarkModeSetting: function () {
        return document.getElementById ("settingsDarkMode");
    },
    getFileName: function (filePath) {
        return filePath.replace(/^.*[\\\/]/, '');
    },
    getFilePath: function () {
        return this.getFilePathPickerSetting().files[0]?.path;
    }
}
