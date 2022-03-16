import {
  defineComponent,
  type PropType,
  type HTMLAttributes,
  type VNode,
  type CSSProperties,
  ref,
  type Ref,
  onBeforeUnmount,
} from 'vue';

export type Entry = string | (() => Promise<unknown>);

export interface MicroAppProps extends HTMLAttributes {
  /**
   * 加载地址
   * @example //localhost:3002/src/main.tsx
   */
  entry: Entry;
  /**
   * 加载中反馈
   */
  fallback?: VNode;
  /**
   * 渲染错误信息
   */
  renderError?: (message: string) => VNode;
  /**
   * className
   */
  className?: string;
  /**
   * style
   */
  style?: CSSProperties;
  /**
   * 传递给子应用的参数
   */
  forwardProps?: Record<string, any>;
}

export interface AppConfig {
  /**
   * 挂载
   */
  mount?: (props: unknown) => void;
  /**
   * 更新
   */
  render?: (props: unknown) => VNode;
  /**
   * 卸载
   */
  unmount?: () => void;
}

export interface ResponseModule {
  default: (container: HTMLElement | null) => Promise<AppConfig> | AppConfig;
}

export type ResponseFunc = (
  container: HTMLElement | null
) => Promise<AppConfig> | AppConfig;

const DEBUG_MODE = false;

export const MicroApp = defineComponent({
  name: 'MicroApp',
  props: {
    items: {
      type: Object as PropType<MicroAppProps>,
      required: true,
    },
  },
  setup(props) {
    if (DEBUG_MODE) {
      console.log('loading micro app, props is ', props);
      console.log('loading micro app, entry is ', props.items.entry);
      console.log(
        'loading micro app, forwardProps is ',
        props.items.forwardProps
      );
    }

    // 传递给子应用的节点
    const containerRef = ref<HTMLDivElement | null>(null);
    // 子应用配置
    const configRef = ref<AppConfig>();
    // 加载中
    const loading = ref(true);
    // 错误信息
    const errorMsg = ref<string>();

    handleLoadApp(props.items.entry)
      .then(
        async (res) =>
          await resolveErrors(res, props.items.entry, containerRef),
      )
      .then((config) => {
        if (config.mount) {
          loading.value = false;
          configRef.value = config;
          config.mount(props.items.forwardProps);
          return;
        }
        // render 模式处理
        configRef.value = config;
        loading.value = false;
      })
      .catch((msg) => {
        console.error(msg);
        loading.value = false;
        errorMsg.value =
          typeof msg === 'string'
            ? msg
            : msg?.message || `Failed to load: ${props.items.entry}`;
      });

    onBeforeUnmount(() => {
      const config = configRef.value;
      if (config?.unmount) {
        config.unmount();
      }
    });

    const config = configRef.value;
    return () => (
      <div {...props} ref={containerRef}>
        {errorMsg.value
          ? props.items.renderError
            ? props.items.renderError(errorMsg.value)
            : errorMsg.value
          : loading.value && props.items.fallback
          ? props.items.fallback
          : config?.render?.(props.items.forwardProps)}
      </div>
    );
  },
});

function handleLoadApp(entry: Entry): Promise<ResponseModule> {
  if (typeof entry === 'function') {
    return entry() as Promise<ResponseModule>;
  }
  const source = `${entry}?microAppEnv&t=${Date.now()}`;
  return import(/* @vite-ignore */ source);
}

async function resolveErrors(
  res: ResponseModule,
  entry: Entry,
  containerRef: Ref<HTMLElement | null>
) {
  if (DEBUG_MODE) {
    console.log('app module is :', res);
  }

  if (typeof res.default !== 'function') {
    return Promise.reject(new Error(`[MicroApp] - 导出格式不正确: ${entry}`));
  }
  const config = (await res.default(containerRef.value)) as AppConfig;
  if (DEBUG_MODE) {
    console.log('config :', config);
  }
  if (!(config.mount || config.render)) {
    return Promise.reject(
      new Error(`[MicroApp] - 导出方法缺失 'mount' 或 'render': ${entry}`)
    );
  }
  if (config.mount && !config.unmount) {
    return Promise.reject(
      new Error(`[MicroApp] - 导出方法缺失 'unmount': ${entry}`)
    );
  }
  return config;
}
