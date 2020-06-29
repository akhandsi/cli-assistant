const {ipcRenderer, BrowserWindow} = require('electron')
const theme  = require(__dirname + '/client/theme/theme.js');
const guiCommand  = require(__dirname + '/client/gui-commands.js');
const guiSettings = require(__dirname + '/client/gui-settings.js');
const guiSearch = require(__dirname + '/client/gui-search.js');
const guiTerminal = require(__dirname + '/client/gui-terminalWindow.js');

function backgroundProcess() {
    theme.init();
    guiCommand.init();
    guiSettings.init();
}

function copyCommandToClipboard (identifier, commandToCopy) {
    guiCommand.copyCommandToClipboard(commandToCopy)
    guiCommand.showCommandCopyToast(identifier, commandToCopy);
}

function onSettingsSave() {
    guiSettings.onSettingsSave();
}

function onFilePathValueChange() {
    guiSettings.onFilePathValueChange();
}

function onSearch() {
    guiSearch.search();
}

function openTerminal(commandToExec) {
    guiTerminal.openTerminalWindow(commandToExec);
}
