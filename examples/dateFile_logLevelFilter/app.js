const logService = require('./log/log');
const getLogger = logService('logFromAppFile');
// 初始化不同的日志归档
const getLogger_cate = logService('logFromOtherFile');

const getLogger_yourCateLog_only = logService('yourCateLog');

// const getLogger_context = logService('app', {key: 'value'});


getLogger.info('info', 'log something with log4js');
getLogger.error('error', 'log something with log4js');

getLogger_cate.info('info', 'log something with log4js');
getLogger_cate.error('error', 'log something with log4js');

getLogger_yourCateLog_only.info('info', 'getLogger_yourCateLog_only something with log4js');
getLogger_yourCateLog_only.error('error', 'getLogger_yourCateLog_only 不会单独记录到err.log中');

// getLogger_context.info('info', 'log something with log4js');
// getLogger_context.error('error', 'log something with log4js');
