const { remote } = require('electron');

module.exports = {
    openTerminalWindow: function(commandToExec) {
        let terminalWindow = new remote.BrowserWindow({
            width: 500,
            height: 500,
            webPreferences: {
                nodeIntegration: true,
            },
            title: commandToExec
        });
        terminalWindow.loadFile('terminal.html');
    
        terminalWindow.webContents.openDevTools();
        
        terminalWindow.on('closed', () => {
            terminalWindow = null;
        });
    
        setTimeout(() => {
            this.getWindow (commandToExec).webContents.send ('forWin2', commandToExec);
        }, 300);
    },
    getWindow: function(windowName) {
        const windowArray = remote.BrowserWindow.getAllWindows();
        for (let i = 0; i < windowArray.length; i++) {
            if (windowArray[i].getTitle() === windowName) {
                return windowArray[i];
            }
        }
        return null;
    }
}
