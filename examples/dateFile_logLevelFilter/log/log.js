const {configure, getLogger} = require('log4js');

/**
 * 更多详细配置参考官方 api
 *
 * done:
 *    1、type : dateFile or file 实现按时长 or 文件大小 自动多文件保存
 *    2、降错误 error 日志过滤到单独的日志另存一份！方便查看 or 邮件通知！
 *
 * todo:
 *    1、logFaces 根据具体用户 or 特定参数单独保留数据包
 *
 */

configure({
    // 输出源设置
    appenders: {
        // 同时输出到控制台方便开发阶段使用。or 不会输出控制台信息
        console: {
            type: "console"
        },
        // 记录所有日志
        app: {
            // 按日分文件保存 （也可以定义 type:file 。then 设置文件大小控制分文件保存）
            type: "dateFile",
            filename: "logs/app",
            pattern: "yyyy-MM-dd.log",
            daysToKeep: 30,//最多保存天数
            alwaysIncludePattern: true

        },
        errs: {
            type: "dateFile",
            filename: "logs/errs",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        },
        // type: "logLevelFilter", 将错误信息单独输出到一个问题。更方便定位错误日志
        error_filter: {
            type: "logLevelFilter",
            appender: "errs",
            level: "error"
        },
        // todo: 需要额外 插件支持！
        logFaces: {
            type: "dateFile",
            filename: "logs/userFaces",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        }
    },
    // 通过 getLogger 控制日志记录的保存目录
    categories: {
        // 没有匹配到日志目录（must has default）
        default: {
            appenders: ["console", "app", "error_filter"],
            // 最低级别：所有高于的日志记录都被记录
            level: "trace"
        }
    },
    // pm2: true,
    // @ts-ignore console.log(msg) 无法被记录
    replaceConsole: true
});


/**
 *
 * @param {string } catePath 设置归档: 可以区分具体记录日志的所在文件信息
 * @returns {Logger}
 */
module.exports = (catePath, context) => {
    let _getLogger = getLogger(catePath);
    if (context && context.key) {
        _getLogger.addContext('key', context.key)
    }
    return _getLogger
}
