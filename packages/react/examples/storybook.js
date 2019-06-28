import React from 'react';
import ReactDOM from '../src/react-dom';

const REACT_APP_ID = 'react-app';

class ReactApp extends React.PureComponent {
  componentDidMount() {
    const { renderApp } = this.props;
    const App = renderApp();
    const rootEl = document.getElementById(REACT_APP_ID);

    ReactDOM.render(App, rootEl);
  }

  render() {
    return <div id={REACT_APP_ID}></div>
  }
}

export const withReactApp = (render, disabled) => {
  if (disabled) {
    return render;
  }

  return () => <ReactApp renderApp={render} />;
};
