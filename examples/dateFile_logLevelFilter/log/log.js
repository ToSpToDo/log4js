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
    // 具体的日志记录类型,通过type 指定输出日志格式 。名称只是配合 categories 方便指示具体使用哪些日志记录类型
    appenders: {
        console: {
            // 同时输出到控制台方便开发阶段使用。or 不会输出控制台信息
            type: "console"
        },
        app: {
            // 按日分文件保存 （也可以定义 type:file 。then 设置文件大小控制分文件保存）
            type: "dateFile",
            // 可以只全路径 或者相对路径
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
        error_filter: {
            // 按照 level 过滤日志
            type: "logLevelFilter",
            // 具体应用的 日志输出类型
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
    // 默认会有 { categories: { default: { appenders: ['out'], level: 'OFF' } } }
    categories: {
        // 如果自己设置了categories，则必须要有default配置。默认没有匹配到分类的日志都走default
        default: {
            // 应用哪些 具体的日志记录类型输出日志格式
            appenders: ["console", "app", "error_filter"],
            // 最低级别：所有高于的日志记录都被记录
            level: "trace"
        },
        //
        yourCateLog: {
            appenders: ["console", "app"],
            // 最低级别：所有高于的日志记录都被记录
            level: "trace"
        }
    },
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
