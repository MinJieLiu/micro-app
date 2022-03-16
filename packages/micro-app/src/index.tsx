import type {
  ReactNode,
  RefObject,
  CSSProperties,
  HTMLAttributes,
} from 'react';
import React, { useEffect, useRef, useState } from 'react';

export type Entry = string | (() => Promise<unknown>);

export interface MicroAppProps extends HTMLAttributes<HTMLElement> {
  /**
   * 加载地址
   * @example //localhost:3002/src/main.tsx
   */
  entry: Entry;
  /**
   * 加载中反馈
   */
  fallback?: ReactNode;
  /**
   * 渲染错误信息
   */
  renderError?: (message: string) => ReactNode;
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

/**
 * App 格式
 */
export interface AppConfig {
  /**
   * 挂载
   */
  mount?: (props: unknown) => void;
  /**
   * 更新
   */
  render?: (props: unknown) => ReactNode;
  /**
   * 卸载
   */
  unmount?: () => void;
}

export interface ResponseModule {
  default: (container: HTMLElement | null) => Promise<AppConfig>|AppConfig;
}

/**
 * 微应用加载组件
 */
export function MicroApp({
  entry,
  fallback,
  renderError,
  className,
  style,
  forwardProps,
  ...props
}: MicroAppProps) {
  // 传递给子应用的节点
  const containerRef = useRef<HTMLDivElement>(null);
  // 子应用配置
  const configRef = useRef<AppConfig>();
  // 加载中
  const [loading, setLoading] = useState(true);
  // 错误信息
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    handleLoadApp(entry)
      .then( async (res) => await resolveErrors(res, entry, containerRef))
      .then((config) => {
        if (config.mount) {
          setLoading(false);
          configRef.current = config;
          config.mount(forwardProps);
          return;
        }
        // render 模式处理
        configRef.current = config;
        setLoading(false);
      })
      .catch((msg) => {
        console.error(msg);
        setLoading(false);
        setErrorMsg(
          typeof msg === 'string'
            ? msg
            : (msg && msg.message) || `Failed to load: ${entry}`
        );
      });
    return () => {
      const config = configRef.current;
      if (config && config.unmount) {
        config.unmount();
      }
    };
  }, []);
  const config = configRef.current;

  return (
    <div {...props} ref={containerRef}>
      {errorMsg
        ? renderError
          ? renderError(errorMsg)
          : errorMsg
        : loading && fallback
        ? fallback
        : config && config.render && config.render(forwardProps)}
    </div>
  );
}

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
  containerRef: RefObject<HTMLElement>
) {
  if (typeof res.default !== 'function') {
    return Promise.reject(`[MicroApp] - 导出格式不正确: ${entry}`);
  }
  const config = await res.default(containerRef.current) as AppConfig;
  if (!(config.mount || config.render)) {
    return Promise.reject(
      `[MicroApp] - 导出方法缺失 'mount' 或 'render': ${entry}`
    );
  }
  if (config.mount && !config.unmount) {
    return Promise.reject(`[MicroApp] - 导出方法缺失 'unmount': ${entry}`);
  }
  return config;
}
