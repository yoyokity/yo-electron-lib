const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getWsPort: () => ipcRenderer.invoke('wsPort'),
})