import { Cmd } from './cmd.js'
import { Pathlib } from './path.js'
import { Logging } from './logging.js'

export const Helper = {
    Cmd,
    /** @type {Pathlib} */
    path: null,
    /** @type {Logging} */
    logging: null,
    /**
     * 初始化，放在入口文件最开头，
     *
     * 示例：
     *
     * const __dirname = dirname(fileURLToPath(import.meta.url))
     *
     * Helper.init(process.cwd(), join(__dirname, '../'))
     * @param {string} appDir 程序所在根目录
     * @param {string} dataDir 程序内部根目录
     * @param {boolean} logOn 是否开启日志
     */
    init: (appDir, dataDir,logOn = true) => {
        Helper.path = new Pathlib(appDir, dataDir)
        console.log(`appDir: ${appDir}`)
        console.log(`dataDir: ${dataDir}`)

        if (logOn) {
            //log目录
            let logDir = Helper.path.appDir.join('log')
            Helper.path.createPath(logDir.str)
            Helper.logging = new Logging(logDir)

            console.log(`logDir: ${logDir.str}`)
        }
    }
}

