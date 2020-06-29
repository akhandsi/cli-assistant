const { BrowserWindow, ipcMain } = require('electron');
const store = require(__dirname + '/store/store.js');

module.exports = {
    createWindow: function() {
        const options = store.loadStore();
        let mainWindow = new BrowserWindow({
            ...options.custom,
            webPreferences: {
                nodeIntegration: true,
            },
            title: 'mainWindow'
        });
        
        // initial state save
        store.saveWindowState(mainWindow);
        
        // on window resize update the store
        mainWindow.on('resize', () => {
            store.saveWindowState(mainWindow);
        });
    
        // load the html file
        mainWindow.loadFile('index.html')
    
        mainWindow.webContents.openDevTools();
        
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    },
}
