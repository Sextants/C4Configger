import C4ConfigLoaderInterface from './LoaderInstance/C4ConfigLoaderInterface';
import { C4ConfigInfo } from './ConfigTypes/C4ConfigInfo';
import C4BaseLoader from './C4BaseLoader';
export default class C4LocalLoader extends C4BaseLoader {
    private m_Loaders;
    constructor();
    init(): Promise<void>;
    /**
     * 加载配置
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    load(rootDir: string, loadString: string, configInfo: C4ConfigInfo): Promise<any>;
    /**
     * 实际加载的方法
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    _load(rootDir: string, loadString: string, configInfo: C4ConfigInfo): Promise<any>;
    /**
     * 注册文件加载器
     * @param key 文件扩展名
     * @param loaderFactory 创建加载器的工厂方法
     */
    registerLoader(key: string, loaderFactory: () => C4ConfigLoaderInterface): Promise<void>;
}
