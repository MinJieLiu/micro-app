import React from 'react';
import ReactDOM from 'react-dom';
import { defineMicroApp } from './defineMicroApp';

/**
 * 导出 @micro-web 微应用格式
 */
export function withReactMicroApp<P>(App: React.FC<P>) {
  return defineMicroApp((container) => {
    let handleRender: (props: P) => void;

    function Main(props: P) {
      const [state, setState] = React.useState(props);
      handleRender = setState;
      return <App {...state} />;
    }

    return {
      mount(props: P) {
        ReactDOM.render(<Main {...props} />, container);
      },
      render(props: P) {
        handleRender?.(props);
      },
      unmount() {
        ReactDOM.unmountComponentAtNode(container);
      },
    };
  });
}
