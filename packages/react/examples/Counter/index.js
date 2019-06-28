import React from '../../src/react';

class Counter extends React.Component {
  state = {
    count: 0,
  };

  increase = () => {
    const { count } = this.state;

    this.setState({
      count: count + 1,
    });
  };

  decrease = () => {
    const { count } = this.state;

    this.setState({
      count: count - 1,
    });
  };

  render() {
    const { count } = this.state;

    return (
      <div>
        <span>{count}</span>
        <div>
          <button onClick={this.increase}>+</button>
          <button onClick={this.decrease}>-</button>
        </div>
      </div>
    )
  }
}

export default Counter;
