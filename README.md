# Helper初始化



添加到入口文件中

```js
//Helper初始化
import { Helper } from '../yo_electron_lib/Helper/helper.js'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
Helper.init(app.getAppPath(), join(__dirname, '../'))
```





# WS服务端



加载preload，用于前端获取ws端口

```js
 const mainWindow = new BrowserWindow({
    width: 1090,
    height: 670,
    minWidth: 1100,
    minHeight: 500,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
        preload: Helper.path.dataDir.join('yo_electron_lib/webSocket/preload.cjs').str,
    },
})
```



启动

```js
import WsServer from '../yo_electron_lib/webSocket/server.js'

const wsServer = new WsServer()
wsServer.start()
```





# WS客户端



连接

```js
import WsClient from './client.js'

window.wsClient = new WsClient('mainWindow')
await wsClient.connect()
```

