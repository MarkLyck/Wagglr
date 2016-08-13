import React from 'react';

import Nav from './Nav';
import Searchbar from './Searchbar';

export default React.createClass({
  render: function() {
      return (
        <header>
          <Nav />
          <Searchbar />
        </header>
    );
  }
});
