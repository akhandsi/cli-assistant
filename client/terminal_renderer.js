const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { AttachAddon } = require('xterm-addon-attach');
const os = require("os");
const pty = require("node-pty");
const { ipcRenderer } = require('electron')

ipcRenderer.on('forWin2', function (event, commandToExec){
    createTerminal(commandToExec);
});

function createTerminal (commandToExec) {
    const fitAddon = new FitAddon();
    const terminal = new Terminal({
        fontFamily: 'Fira Code, Iosevka, monospace',
        cursorBlink: true,
        rows: 12,
        fontSize: 14
    });
    terminal.loadAddon(fitAddon);
    terminal.open(document.getElementById('commandTerminal'));
    //terminal.write(`~$ ${commandToExec}`);
    fitAddon.fit();
    
    const shell = os.platform() === "win32" ? "powershell.exe" : process.env.SHELL || '/bin/bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cwd: process.env.HOME,
        env: process.env
    });
    
    ptyProcess.on("data", function(data) {
        terminal.write(data);
    });
    
    terminal.onData(data => ptyProcess.write(data));
}
