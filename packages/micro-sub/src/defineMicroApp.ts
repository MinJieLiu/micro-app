/**
 * App 格式
 */
export interface AppConfig<P> {
  /**
   * 挂载
   */
  mount?: (props: P) => void;
  /**
   * 更新
   */
  render?: (props: P) => any;
  /**
   * 卸载
   */
  unmount?: () => void;
}

type MicroCallback<P> = (container: HTMLElement) => AppConfig<P>;

export interface DefineApp<P> extends MicroCallback<P> {
  /**
   * 样式注入方法，配合 vite 插件
   */
  styleInject?: (container: HTMLElement) => void;
}

/**
 * 定义 micro app，额外处理样式问题
 */
export function defineMicroApp<P>(callback: MicroCallback<P>) {
  const defineApp: DefineApp<P> = (container: HTMLElement) => {
    const appConfig = callback(container);

    // 处理样式局部插入
    const mountFn = appConfig.mount;
    const inject = defineApp.styleInject;
    if (mountFn && inject) {
      appConfig.mount = (props) => {
        mountFn(props);
        inject(container);
      };
    }
    return appConfig;
  };

  return defineApp;
}
