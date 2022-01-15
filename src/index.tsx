import type { ReactNode, RefObject, CSSProperties } from 'react';
import React, { useLayoutEffect, useRef, useState } from 'react';

export type Entry = string | (() => Promise<ResponseModule>);

export interface MicroAppProps {
  /**
   * 加载地址
   * @example //localhost:3002/src/main.tsx
   */
  entry: Entry;
  /**
   * 加载中节点
   */
  fallback?: ReactNode;
  /**
   * 错误信息渲染
   */
  renderError?: (message: string) => ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

/**
 * 导出格式
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
  default: (container: HTMLElement | null) => AppConfig;
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
  ...props
}: MicroAppProps) {
  // 传递给子应用的节点
  const containerRef = useRef<HTMLDivElement>(null);
  // 判断加载后当前组件是否在挂载中
  const mountRef = useRef<Entry | undefined>();
  // 子应用配置
  const configRef = useRef<AppConfig>();
  // 加载中
  const [loading, setLoading] = useState(false);
  // 错误信息
  const [errorMsg, setErrorMsg] = useState<string>();

  useLayoutEffect(() => {
    mountRef.current = entry;
    setLoading(true);
    setErrorMsg(undefined);
    handleLoadApp(entry)
      .then((res) => {
        setLoading(false);
        return handleErrors(res, entry, containerRef);
      })
      .then((config) => {
        if (mountRef.current === entry) {
          configRef.current = config;
          config.mount?.(props);
        }
      })
      .catch((msg) => {
        setErrorMsg(
          typeof msg === 'string'
            ? msg
            : msg?.message ?? `Failed to load: ${entry}`
        );
      });
    return () => {
      configRef.current?.unmount?.();
      mountRef.current = undefined;
      configRef.current = undefined;
    };
  }, [entry]);

  return (
    <div className={className} ref={containerRef} style={style}>
      {errorMsg
        ? renderError?.(errorMsg) ?? errorMsg
        : loading && fallback
        ? fallback
        : configRef.current?.render?.(props)}
    </div>
  );
}

function handleLoadApp(entry: Entry): Promise<ResponseModule> {
  if (typeof entry === 'function') {
    return entry();
  }
  const source = `${entry}?microAppEnv&t=${Date.now()}`;
  return import(/* @vite-ignore */ source);
}

function handleErrors(
  res: ResponseModule,
  entry: Entry,
  containerRef: RefObject<HTMLElement>
) {
  if (typeof res.default !== 'function') {
    return Promise.reject(`[MicroApp] - 导出格式不正确: ${entry}`);
  }
  const config = res.default(containerRef.current) as AppConfig;
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
