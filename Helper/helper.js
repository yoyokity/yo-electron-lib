import { Cmd } from './cmd.js'
import { Pathlib } from './path.js'

export const Helper = {
    Cmd,
    /** @type {Pathlib} */
    path: null,
    /**
     * 初始化，放在入口文件最开头，
     *
     * 示例：
     *
     * const __dirname = dirname(fileURLToPath(import.meta.url))
     *
     * Helper.init(app.getAppPath(), join(__dirname, '../'))
     * @param {string} appDir 程序所在根目录
     * @param {string} dataDir 程序内部根目录
     */
    init: (appDir, dataDir) => {
        Helper.path = new Pathlib(appDir, dataDir)
    }
}

