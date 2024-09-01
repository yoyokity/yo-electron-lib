import fs from 'fs'

export class Logging {
    /**
     * 储存log文件的目录
     * @private
     * @type {import('./path.js').Path}
     */
    _logDir

    constructor (logDir) {
        this._logDir = logDir
    }

    /**
     * 获取 年-月-日
     * @private
     */
    get date () {
        const now = new Date()
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    }

    /**
     * 获取 时:分:秒:毫秒
     * @private
     */
    get time () {
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const seconds = String(now.getSeconds()).padStart(2, '0')
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
        return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }

    /**
     * @private
     * @param {string} lineText
     */
    writeFile (lineText) {
        const date = this.date
        let filePath = this._logDir.join(`${date}.log`)

        if (!lineText.endsWith('\n')) lineText += '\n'
        lineText = `[${date} ${this.time}] ${lineText}`

        fs.appendFileSync(filePath.str, lineText)
    }

    log(text){
        text = `[LOG] ${text}`
        console.info(text)
        this.writeFile(text)
    }

    warn(text){
        text = `[WARN] ${text}`
        console.warn(text)
        this.writeFile(text)
    }
}