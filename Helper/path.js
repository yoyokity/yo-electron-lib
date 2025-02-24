import _path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

String.prototype.getPath = function () {
    return new Path(this)
}

class Path {
    /**
     * @type {string}
     */
    #path

    constructor (path) {
        this.#path = _path.resolve(path)
    }

    /**
     * 返回path的字符串形式
     */
    get str () {
        return _path.normalize(this.#path)
    }

    /**
     * 判断path是否存在于磁盘上
     */
    get isExist () {
        return fs.existsSync(this.#path)
    }

    /**
     * 判断path是否为目录
     */
    get isDir () {
        if (this.isExist) {
            return fs.statSync(this.#path).isDirectory()
        } else {
            return _path.extname(this.#path) === ''
        }
    }

    /**
     * 判断path是否为文件
     */
    get isFile () {
        if (this.isExist) {
            return fs.statSync(this.#path).isFile()
        } else {
            return _path.extname(this.#path) !== ''
        }
    }

    /**
     * 拼接路径
     * @param {string} paths
     * @returns {Path}
     */
    join (...paths) {
        if (this.isFile)
            return new Path(_path.join(this.parent.str, ...paths))
        return new Path(_path.join(this.#path, ...paths))
    }

    /**
     * 完整文件名，非文件则抛出错误
     * @returns {string}
     */
    get fileName () {
        if (this.isDir)
            throw new Error(`"${this.#path}" is not a file`)
        return _path.basename(this.#path)
    }

    /**
     * 文件后缀名，非文件则抛出错误
     * @returns {string}
     */
    get extname () {
        if (this.isDir)
            throw new Error(`"${this.#path}" is not a file`)
        return _path.extname(this.#path)
    }

    /**
     * 无后缀文件名，非文件则抛出错误
     * @returns {string}
     */
    get basename () {
        if (this.isDir)
            throw new Error(`"${this.#path}" is not a file`)
        return _path.basename(this.#path, this.extname)
    }

    /**
     * 路径所在的父目录
     * @returns {Path}
     */
    get parent () {
        return new Path(_path.dirname(this.#path))
    }
}

export class Pathlib {
    #appDir
    #dataDir

    /**
     * @param {string} appDir
     * @param {string} dataDir
     */
    constructor (appDir, dataDir) {
        this.#appDir = appDir
        this.#dataDir = dataDir
    }

    new (path) {
        return new Path(path)
    }

    /**
     * 程序所在根目录
     */
    get appDir () {
        return new Path(this.#appDir)
    }

    /**
     * 程序内部根目录
     */
    get dataDir () {
        return new Path(this.#dataDir)
    }

    /**
     * 此目录存储由 Session 生成的数据，例如 localStorage，cookies，磁盘缓存，下载的字典，网络 状态，开发者工具文件等。 默认为 userData 目录。
     * @return {Path}
     */
    get sessionDataDir () {
        return new Path(yoyoNode.app.getPath('sessionData'))
    }

    /**
     * C盘的用户temp文件夹
     */
    get tempDir () {
        return new Path(process.env.TEMP)
    }

    /**
     * 是否为完整路径
     * @param {string} path
     * @returns {boolean}
     */
    isAbsolute (path) {
        return _path.isAbsolute(path)
    }

    /**
     * 替换掉路径中的非法字符
     * @param {string} path
     * @return {string}
     */
    sanitizePath (path) {
        const fullWidthMap = {
            '?': '？',
            '"': '＂',
            '<': '＜',
            '>': '＞',
            '|': '｜'
        }

        // 1. 替换非法字符为全角符号
        let sanitized = path.replace(/[?"<>|]/g, (char) => {
            return fullWidthMap[char] || ''
        })

        // 2. 移除开头和结尾的非法字符（如空格、点）
        return  sanitized
            .replace(/^[.\s]+/, '')
            .replace(/[.\s]+$/, '')
    }

    /**
     * 创建一个目录或文件。
     *
     * 如果path为目录且已创建，则忽略；path为文件且已创建，则覆盖
     * @param {string} path 要创建的路径
     */
    createPath (path) {
        const basePath = new Path(path)
        try {
            if (!basePath.isExist) 
                fs.mkdirSync(basePath.str, { recursive: true })
        } catch (e) {
            console.warn(`"${path}" create failed: ${e.message}`)
        }
    }

    /**
     * 创建文件（自动创建父目录，覆盖已存在文件）
     * @param {string} path 要创建的文件路径
     */
    createFile(path) {
        try {
            const basePath = new Path(path)
            const fileDir = basePath.parent
            if (!fileDir.isExist) {
                fs.mkdirSync(fileDir.str, { recursive: true })
            }
            if (basePath.isExist) {
                fs.unlinkSync(basePath.str)
            }
            fs.writeFileSync(basePath.str, '')
        } catch (e) {
            console.warn(`File "${path}" creation failed: ${e.message}`);
            throw e; // 可选择重新抛出错误
        }
    }

    /**
     * 在一个路径中搜索文件
     *
     * @param {string} dirPath 搜索路径
     * @param {string[]} extensions 要搜索的文件扩展名的数组，例如 ['.txt', '.jpg']。
     * @param {boolean} recursive 是否递归子目录查找文件。
     * @return {string[]} 表示所有文件的路径的数组。
     */
    searchFiles (dirPath, extensions = null, recursive = false) {
        /**
         * @type {string[]}
         */
        const allFiles = []
        const basePath = new Path(dirPath)

        if (!basePath.isDir)
            throw new Error(`${dirPath} is not a directory`)

        /**
         * @param {Path} currentDir
         */
        function traverseDir (currentDir) {
            const files = fs.readdirSync(currentDir.str)
            files.forEach(file => {
                const filePath = currentDir.join(file)

                if (filePath.isFile) {
                    if (!extensions || extensions.includes(filePath.extname))
                        allFiles.push(filePath.str)
                } else if (filePath.isDir) {
                    traverseDir(filePath)
                }
            })
        }

        traverseDir(basePath)
        return allFiles
    }

    /**
     * 删除文件或文件夹
     * @param path
     */
    delete (path) {
        const basePath = new Path(path)
        if (!basePath.isExist) return
        if (basePath.isDir) {
            try {
                fs.rmdirSync(basePath.str, { recursive: true })
            } catch (e) {
                console.warn(`delete "${path}" failed: ${e.message}`)
            }
        } else if (basePath.isFile) {
            try {
                fs.unlinkSync(basePath.str)
            } catch (e) {
                console.warn(`delete "${path}" failed: ${e.message}`)
            }
        }
    }

    /**
     * 移动或复制文件
     * @param {string} sourceFile 源文件
     * @param {string} targetPath 新文件所在文件夹路径，默认空为原文件夹
     * @param {string} newFileName 新文件名（不包含后缀名），默认空为原文件名
     * @param {boolean} isCopy 是否为复制，默认移动文件
     * @returns {Promise<void>}
     */
    async moveFile (sourceFile, targetPath = '', newFileName = '', isCopy = false) {
        //检查原路径
        const sourceFilePath = new Path(sourceFile)
        if (!sourceFilePath.isExist) return
        if (sourceFilePath.isDir) return

        //检查新路径
        if (targetPath === '') targetPath = sourceFilePath.parent.str
        let targetDirectoryPath = new Path(targetPath)
        if (!targetDirectoryPath.isExist) this.createPath(targetPath)
        if (targetDirectoryPath.isFile) targetDirectoryPath = targetDirectoryPath.parent

        if (newFileName === '') newFileName = sourceFilePath.basename
        let extname = sourceFilePath.extname
        let targetFilePath = targetDirectoryPath.join(newFileName + extname)

        if (sourceFilePath.str === targetFilePath.str) return

        //复制文件
        if (isCopy) {
            try {
                await fs.promises.copyFile(sourceFilePath.str, targetFilePath.str)
                return
            } catch (error) {
                console.error('Error copy file:', error)
            }
        }

        //移动文件
        let com = process.platform === 'win32' ? 'move' : 'mv'
        execSync(`${com} "${sourceFilePath.str}" "${targetFilePath.str}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error moving file:', error.message)
            }
        })
    }
}