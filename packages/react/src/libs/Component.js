import { scheduleUpdate } from './reconciler';

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {};
  }

  /**
   * Update state
   * @param {Object} partialState
   */
  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}

export default Component
