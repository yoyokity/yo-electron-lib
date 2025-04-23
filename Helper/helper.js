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
    },

    /**
     * 包装异步函数的try-catch逻辑，简化错误处理
     *
     * 示例：
     * const [err, result] = await Helper.tryAsync(async () => {
     *     return await someAsyncFunction();
     * });
     *
     * if (err) {
     *     console.error('发生错误:', err);
     *     return;
     * }
     *
     * console.log('操作成功:', result);
     *
     * @param {Function} fn 需要执行的异步函数
     * @param {Function} [errorHandler] 可选的错误处理函数
     * @returns {Promise<[Error|null, any]>} 返回一个包含错误和结果的数组
     */
    tryAsync: async (fn, errorHandler) => {
        try {
            const result = await fn();
            return [null, result];
        } catch (err) {
            if (Helper.logging) {
                Helper.logging.error(err);
            }

            if (typeof errorHandler === 'function') {
                errorHandler(err);
            }

            return [err, null];
        }
    },

    /**
     * 包装同步函数的try-catch逻辑，简化错误处理
     *
     * 示例：
     * const [err, result] = Helper.trySync(() => {
     *     return someSyncFunction();
     * });
     *
     * @param {Function} fn 需要执行的同步函数
     * @param {Function} [errorHandler] 可选的错误处理函数
     * @returns {[Error|null, any]} 返回一个包含错误和结果的数组
     */
    trySync: (fn, errorHandler) => {
        try {
            const result = fn();
            return [null, result];
        } catch (err) {
            if (Helper.logging) {
                Helper.logging.error(err);
            }

            if (typeof errorHandler === 'function') {
                errorHandler(err);
            }

            return [err, null];
        }
    }
}
