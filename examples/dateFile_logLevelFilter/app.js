const logService = require('./log/log');
const getLogger = logService('logFromAppFile');
// 初始化不同的日志归档
const getLogger_cate = logService('logFromOtherFile');

const getLogger_context = logService('logFromOtherFile', {key: 'value'});


getLogger.info('info', 'log something with log4js');
// getLogger.error('error', 'log something with log4js');

getLogger_cate.info('info', 'log something with log4js');
// getLogger_cate.error('error', 'log something with log4js');

// getLogger_context.info('info', 'log something with log4js');
// getLogger_context.error('error', 'log something with log4js');
