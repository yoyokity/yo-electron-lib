### 服务端



#### 加载preload

```js
 const mainWindow = new BrowserWindow({
    width: 1090,
    height: 670,
    minWidth: 1100,
    minHeight: 500,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
        preload: join(__dirname, '../webSocket/preload.cjs'),
    },
})
```



#### 启动

```js
const WsServer = require('./server.js')

const wsServer = new WsServer()
wsServer.start()
```





### 客户端

#### 连接

```js
import WsClient from '../webSocket/client.js'

window.wsClient = new WsClient('mainWindow')
await wsClient.connect()
```

