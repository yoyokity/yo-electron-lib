const { contextBridge, ipcRenderer, webUtils} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getWsPort: () => ipcRenderer.invoke('wsPort'),
    getFilePath: (file) => webUtils.getPathForFile(file)
})