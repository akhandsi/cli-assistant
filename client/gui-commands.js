const store = require(__dirname + '/store/store.js');

module.exports = {
    sampleHelpInfo: `#CMD_BEGIN
                     #CMD_TITLE_START cd_home CMD_TITLE_END
                     #CMD_TAG_START CD CMD_TAG_END
                     #CMD_DESC_START cd to home folder CMD_DESC_END
                     #CMD_USAGE_START cd_home CMD_USAGE_END
                     #CMD_END`,
    // ------------ main background process --------------
    init: function () {
        this.loadPlatformInfo ();
        this.loadAvailableCommands ();
    },
    
    // ------------ Load --------------
    loadPlatformInfo: function () {
        this.addToPlatformInfo ();
    },
    
    loadAvailableCommands: function () {
        this.addToCommandHeader ();
        
        const fs = require('fs')
        const options = store.loadStore();
        let cliHelpFilePath = options.custom.cliFilePath;
        if (fs.existsSync(cliHelpFilePath)) {
            const response = fs.readFileSync(cliHelpFilePath).toString();
            if (response !== '') {
                this.addToCommandList (response);
            } else {
                this.addToCommandStatusOrError({
                    code: -999,
                    filePath: cliHelpFilePath,
                });
            }
        } else {
            this.addToCommandStatusOrError({
                code: -999,
                filePath: cliHelpFilePath,
            });
        }
    },
    
    // ------------ Event --------------
    showCommandCopyToast: function (id, message) {
        const toastCallEvent = () => {
            setTimeout (() => {
                showToastButton.removeEventListener ('click', toastCallEvent);
            });
            
            const snackbarContainer = document.querySelector ('#commandCopyToastContainer');
            snackbarContainer.MaterialSnackbar.showSnackbar ({
                message: `Command '${message}' copied to clipboard!`,
                timeout: 1000
            });
        }
        const showToastButton = document.querySelector (`#${id}`);
        showToastButton.addEventListener ('click', toastCallEvent);
    },
    
    copyCommandToClipboard: function (msg) {
        const {clipboard} = require ('electron');
        clipboard.writeText (msg);
    },
    
    // ------------ Rendering --------------
    addToPlatformInfo: function () {
        const os = require ('os');
        const msg = `
        <span class="mdl-chip mdl-chip--contact">
            <span class="mdl-chip__contact">O</span>
            <span class="mdl-chip__text">OS: ${os.type ()} ${os.release ()}</span>
        </span>
        <span class="mdl-chip mdl-chip--contact">
            <span class="mdl-chip__contact">N</span>
            <span class="mdl-chip__text">Node: ${process.versions.node}</span>
        </span>
        <span class="mdl-chip mdl-chip--contact">
            <span class="mdl-chip__contact">C</span>
            <span class="mdl-chip__text">Chrome: ${process.versions.chrome}</span>
        </span>
         <span class="mdl-chip mdl-chip--contact">
            <span class="mdl-chip__contact">E</span>
            <span class="mdl-chip__text">Electron: ${process.versions.electron}</span>
        </span>
       `;
        document.getElementById ('platformInfo').innerHTML += (msg + '<br>');
    },
    
    addToCommandHeader: function () {
        document.getElementById ('commandListHeader').innerHTML += (`Available Commands<br>`);
    },
    
    addToCommandList: function (data) {
        let message = (data + '');
        const formattedItems = message.split (/(?<=CMD_USAGE_END)/);
        const formattedMessage = formattedItems.map (item => {
            const command = item.match (new RegExp ('#CMD_TITLE_START' + "(.*)" + 'CMD_TITLE_END'));
            const commandTag = item.match (new RegExp ('#CMD_TAG_START' + "(.*)" + 'CMD_TAG_END'));
            const commandDesc = item.match (new RegExp ('#CMD_DESC_START' + "(.*)" + 'CMD_DESC_END'));
            const commandUsage = item.match (new RegExp ('#CMD_USAGE_START' + "(.*)" + 'CMD_USAGE_END'));
            if (command) {
                return this.toCommandHelpInfo ({
                    command: command[1],
                    commandTag: commandTag ? commandTag[1] : '?',
                    commandDesc: commandDesc ? commandDesc[1] : '',
                    commandUsage: commandUsage ? commandUsage[1] : command[1],
                });
            } else {
                return '';
            }
        }).join ("\n");
        document.getElementById ('commandList').innerHTML += (`${formattedMessage}`);
    },
    
    addToCommandStatusOrError: function (error) {
        const code = error.code;
        let message;
        if (code === -999) {
            const filePath = error.filePath;
            message = `<div class="statusError">
                         <span class="statusErrorHeading">Invalid response of your cli file, please check content or file path!</span>
                         <br><br>
                         <span class="statusErrorFilePathTitle">File Path:</span>
                         <br>
                         <br>
                         <span class="statusErrorFilePath">${filePath}</span>
                         <br>
                         <br>
                         <span class="statusErrorSampleResponse">Sample Response:</span>
                         <br>
                         <span>
                               ${this.toCommandFormatSuggestion()}
                         </span>
                       </div>`
        } else {
            message = `Error code ${code}`;
        }
        
        document.getElementById ('commandStatusOrError').innerHTML += (`${message}<br><br>`);
    },
    
    toCommandHelpInfo: function (info) {
        const identifier = `list-item-${this.createIdentifier ()}`;
        const tag = info.commandTag.trim ();
        const command = info.command;
        const commandDesc = info.commandDesc;
        const commandToCopy = info.commandUsage.trim ();
        return `<li id="${identifier}" class="mdl-list__item mdl-list__item--three-line">
                <span class="mdl-list__item-primary-content"
                      onclick="copyCommandToClipboard('${identifier}','${commandToCopy}')">
                      <span class="mdl-list__item-tag mdl-list__item-avatar mdl-list__item-tag-${tag}">${tag}</span>
                      <span class="mdl-list__item-text">${command}</span>
                      <span class="mdl-list__item-text-body">
                        ${commandDesc}
                        <br>
                        <br>
                        <span class="mdl-list__item-text-body-usage">${commandToCopy}</span>
                      </span>
                </span>
                <span class="mdl-list__item-secondary-content">
                  <a class="mdl-list__item-secondary-action" onclick="openTerminal('${commandToCopy}')">
                    <i class="material-icons">star</i>
                  </a>
                </span>
           </li>`;
    },
    
    toCommandFormatSuggestion: function() {
        const sampleText = this.sampleHelpInfo.split("\n").map(text => {
            return `<br>${text}`;
        });
        return `<div>${sampleText}</div>`;
    },
    
    // ------------ Utility --------------
    createIdentifier: function () {
        const {v4: uuidv4} = require ('uuid');
        return uuidv4 ();
    }
}







