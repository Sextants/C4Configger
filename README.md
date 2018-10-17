<h1>C4Configger</h1>

<h2>模块简介</h2>

C4Configger是用来加载和解析本地或远程配置文件的工具，支持：

* 本地配置文件支持yaml和json格式，其中json格式支持注释；
* 本地配置文件支持宏定义和文件引用（@link://{filePath}）;
* 远程配置文件支持Spring Cloud的Configer Server；
* 远程配置文件支持宏定义但不支持文件引用；
* 支持将远程配置文件展开为标准JSON对象，如：
  <code>
  
        {
            name : 'sdfsdfsdf/app01-dev.yml',
            source : {
                xxx[0].Path : '123',
                xxx[1].main : 'sadsd',
                oooo.host : 'sdfdsf'
            }
        }
  
  </code>
  解析为：

  <code>
  
      {
          name : 'sdfsdfsdf/app01-dev.yml',
          source: {
              xxx : [
                  {
                      Path : '123'
                  },
                  {
                      main : 'asdsd'
                  }
              ],
              ooo : {
                  host : 'sdfdsf'
              }
          }
      }
  
  </code>

* 支持将加载完毕的配置Dump为一个完整的配置文件输出。

<h2>使用</h2>

<h3>配置</h3>
Configger的配置项默认从 ./Config/Configger.yml 加载，在初始化时可以从国AppInfo中的ConfigPath属性修改Configger的配置项的加载路径。

配置文件详解参考 ./Config/Configger.yml中的注释

<h3>手动配置</h3>

使用时需要手动配置AppInfo进行C4Configger的构造。

<h3>类s</h3>

* C4Configger

  * 说明：C4Configger对象
  * 路径：./src/C4Configger.ts
  * 成员变量：

    * m_LocalLoader，本地加载器，用来加载json或yaml格式配置文件；
    * m_RemoteLoader，远程加载器，用来从Spring Cloud的Config Server加载配置；
    * m_AJV，C4AJV用来对Configger的配置项进行校验；
    * m_ConfigInfo，C4ConfigInfo用来配置一些宏需要的信息。

  * 成员方法：

    * init

    <code>
    
        /**
        * 初始化
        */
        async init() 
    
    </code>

    <hr>

    * load

    <code>
    
        /**
        * 加载
        */
        async load()
    
    </code>

    <hr>

    * refresh

    <code>
    
        /**
        * 刷新
        */
        async refresh()
    
    </code>

    <hr>

    * loadType

    <code>
    
        /**
        * 获取当前的加载器类型
        */
        loadType() 
    
    </code>

    <hr>

    * dump

    <code>
    
        /**
        * 将当前数据dump到文件中
        * @param type 输出的文件类型
        * @param savePath 保存的路径
        */
        async dump(type : C4ConfigFileType, savePath ?: string) 
    
    </code>

  <hr>

* C4BaseLoader

  * 说明：配置加载器的基类
  * 路径：./src/C4BaseLoader.ts
  * 成员变量：无
  * 成员方法：

    * init，初始化方法，需要子类去实现；

    <hr>

    * _processMacro

    <code>
    
        /**
        * 处理宏
        * @param value 当前值
        * @param configInfo C4ConfigInfo
        */
        async _processMacro(value : string, configInfo : C4ConfigInfo)
    
    </code>

    <hr>

    * _isLink

    <code>
    
        /**
        * 判断是否是文件引用
        * @param value 当前配置项的值
        */
        _isLink(value : string)
    
    </code>

  <hr>

* C4LocalLoader

  * 说明：本地加载器，可以设置不同的类型文件（根据文件扩展名）设置加载器进行加载；
  * 路径：./src/C4LocalLoader.ts
  * 成员变量：

    * m_Loaders，文件加载器的存储字典，key为文件扩展名，value为C4ConfigLoaderInterface

  * 成员方法：

    * init

    <hr>

    * load

    <code>
    
        /**
        * 加载配置
        * @param rootDir 根目录
        * @param loadString 加载文件
        * @param configInfo C4ConfigInfo
        */
        async load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) 
    
    </code>

    <hr>

    * _load

    <code>
    
        /**
        * 实际加载的方法
        * @param rootDir 根目录
        * @param loadString 加载文件
        * @param configInfo C4ConfigInfo
        */
        async _load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) 
    
    </code>

    <hr>

    * registerLoader

    <code>
    
        /**
        * 注册文件加载器
        * @param key 文件扩展名
        * @param loaderFactory 创建加载器的工厂方法
        */
        async registerLoader(key : string, loaderFactory : () => C4ConfigLoaderInterface) 
    
    </code>

  <hr>

* C4RemoteLoader

  * 说明：远程加载器，从Spring Cloud的Config Server加载配置，并将结果转换为标准JSON对象；
  * 路径：./src/C4RemoteLoader.ts
  * 成员变量：

    * m_Client，C4RESTFulClient，用于进行请求。

  * 成员方法：

    * init

    <code>
    
        /**
        * 初始化
        * @param option ClientOption
        * @param changeServer 是否切换Client配置
        */
        async init(option ?: ClientOption, changeServer : boolean = false)
    
    </code>

    <hr>

    * load

    <code>
    
        /**
        * 加载配置
        * @param configInfo C4ConfigInfo
        */
        async load(configInfo : C4ConfigInfo)
    
    </code>

    <hr>

    * _parse

    <code>
    
        /**
        * 对结果进行解析
        * @param config 返回的配置项
        * @param configInfo C4ConfigInfo
        */
        _parse(config : any, configInfo : C4ConfigInfo)
    
    </code>

  <hr>

* C4ConfigLoaderInterface

  * 说明：本地配置文件加载对象的接口类；
  * 路径：./src/LoaderInstance/C4ConfigLoaderInterface.ts
  * 成员变量：无
  * 成员方法：

    * init

    <code>
    
        /**
        * 初始化方法
        * @param initString 初始参数
        */
        abstract async init(initString : string) : Promise<any>
    
    </code>

    <hr>

    * load

    <code>
    
        /**
        * 加载方法
        * @param rootDir 根目录
        * @param loadString 加载文件
        * @param configInfo C4ConfigInfo
        */
        abstract async load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) : Promise<any>

    </code>

  <hr>

* C4JSONLoader

  * 说明：本地配置文件JSON类型的加载器；
  * 路径：./src/LoaderInstance/C4JSONLoader.ts
  * 成员变量：无
  * 成员方法：

    * init

    <code>
    
        /**
        * 初始化方法
        * @param initString 初始参数
        */
        abstract async init(initString : string) : Promise<any>
    
    </code>

    <hr>

    * load

    <code>
    
        /**
        * 加载方法
        * @param rootDir 根目录
        * @param loadString 加载文件
        * @param configInfo C4ConfigInfo
        */
        abstract async load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) : Promise<any>

    </code>

  <hr>

* C4YamlLoader

  * 说明：本地配置文件JSON类型的加载器；
  * 路径：./src/LoaderInstance/C4YamlLoader.ts
  * 成员变量：无
  * 成员方法：

    * init

    <code>
    
        /**
        * 初始化方法
        * @param initString 初始参数
        */
        abstract async init(initString : string) : Promise<any>
    
    </code>

    <hr>

    * load

    <code>
    
        /**
        * 加载方法
        * @param rootDir 根目录
        * @param loadString 加载文件
        * @param configInfo C4ConfigInfo
        */
        abstract async load(rootDir : string, loadString : string, configInfo : C4ConfigInfo) : Promise<any>

    </code>

  <hr>
