import React from 'react';
import ReactDOM from 'react-dom';
import { defineMicroApp } from './defineMicroApp';

/**
 * 导出 @micro-web 微应用格式
 */
export function withReactMicroApp<P>(App: React.FC<P>) {
  return defineMicroApp((container) => {
    function render(props: P) {
      ReactDOM.render(<App {...props} />, container);
    }
    return {
      mount: render,
      render: render,
      unmount() {
        ReactDOM.unmountComponentAtNode(container);
      },
    };
  });
}
