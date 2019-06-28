/** @jsx createElement */

import createElement from '../createElement';

describe('createElement', () => {
  it('should create element', () => {
    const reactElement = (
      <div>reactElement</div>
    );

    expect(reactElement).toEqual({
      type: 'div',
      props: {
        children: [
          'reactElement',
        ],
      },
    });
  });
});
