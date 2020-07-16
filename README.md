# log4js
> https://log4js-node.github.io/log4js-node/api.html

## 配置详解
```js
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
```

### appenders
> 定义具体日志数据输出格式。可选的官方 type 很多，也可以根据需要自定义。
> 本身不决定具体的日志数据格式，要业务命中的 categories 决定

### categories
> 根据业务分类配置，决定要走哪些 appenders 日志数据输出格式。


## 目录详解
> lib

### appenders
> 处理具体日志类型的。

### log4js.js
> 入口文件

```js
function getLogger(category) {
  if (!enabled) {
    configure(
      process.env.LOG4JS_CONFIG || {
        appenders: { out: { type: "stdout" } },
        categories: { default: { appenders: ["out"], level: "OFF" } }
      }
    );
  }
  // 没有业务设置的 category 走 default 分类
  return new Logger(category || "default");
}

function sendLogEventToAppender(logEvent) {
  if (!enabled) return;
  debug("Received log event ", logEvent);
  // 根据当前业务 categoryName 获取应该应用的 appenders 输出类型
  const categoryAppenders = categories.appendersForCategory(
    logEvent.categoryName
  );
  categoryAppenders.forEach(appender => {
    appender(logEvent);
  });
}
// 添加 listeners[appenders] 遍历处理 日志对象
function configure(configurationFileOrObject) {
  let configObject = configurationFileOrObject;

  if (typeof configObject === "string") {
    configObject = loadConfigurationFile(configurationFileOrObject);
  }
  debug(`Configuration is ${configObject}`);

  configuration.configure(deepClone(configObject));

  clustering.onMessage(sendLogEventToAppender);

  enabled = true;

  // eslint-disable-next-line no-use-before-define
  return log4js;
}
```

### configuration.js
> 配置文件

### logger.js
> 
```js
// 通过 clustering.send(loggingEvent); 将格式化之后的日志对象 在 configuration 时设置的 listeners 事件数组总遍历处理
class Logger {
      constructor(name) {
        if (!name) {
          throw new Error("No category provided.");
        }
        this.category = name;
        this.context = {};
        this.parseCallStack = defaultParseCallStack;
        debug(`Logger created (${this.category}, ${this.level})`);
      }

    _log(level, data) {
        debug(`sending log data (${level}) to appenders`);
        const loggingEvent = new LoggingEvent(
          this.category,
          level,
          data,
          this.context,
          this.useCallStack && this.parseCallStack(new Error())
        );
        clustering.send(loggingEvent);
      }
}
```

### categories.js
> 获取当前分类下 应该 应用的 appenders 输出类型 

```js
//  // 根据当前业务 categoryName 获取应该应用的 appenders 输出类型 。没有匹配到会默认 configForCategory('default')
const configForCategory = (category) => {
  console.log(categories)
  debug(`configForCategory: searching for config for ${category}`);
  if (categories.has(category)) {
    debug(`configForCategory: ${category} exists in config, returning it`);
    return categories.get(category);
  }
  if (category.indexOf('.') > 0) {
    debug(`configForCategory: ${category} has hierarchy, searching for parents`);
    return configForCategory(category.substring(0, category.lastIndexOf('.')));
  }
  debug('configForCategory: returning config for default category');
  return configForCategory('default');
};

const appendersForCategory = category => configForCategory(category).appenders;
const getLevelForCategory = category => configForCategory(category).level;

```

### LoggingEvent.js
> 日志对象格式化

### levels.js
> 日志级别定义 & 校验等

### layouts.js
> 输出样式格式

### clustering.js
> 兼容处理 pm2 & cluster 不同运行环境下的事件处理

