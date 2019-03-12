import React, { Component } from 'react';

import testUtil from "../../../utils/test-util";
import RegularLayout from '../RegularLayout/RegularLayout';
import { THEMES } from '../../../constants/UI';

class AuthLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props
    const theme = THEMES.LIGHT

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { theme })
    );

    return (
      <RegularLayout>
        {childrenWithProps}
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(AuthLayout);
