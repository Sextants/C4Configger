import { C4ConfigInfo } from '../ConfigTypes/C4ConfigInfo';
export default abstract class C4ConfigLoaderInterface {
    /**
     * 初始化方法
     * @param initString 初始参数
     */
    abstract init(initString: string): Promise<any>;
    /**
     * 加载方法
     * @param rootDir 根目录
     * @param loadString 加载文件
     * @param configInfo C4ConfigInfo
     */
    abstract load(rootDir: string, loadString: string, configInfo: C4ConfigInfo): Promise<any>;
}
