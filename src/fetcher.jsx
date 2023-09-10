import React, { Component } from 'react';

class JsonReader extends Component {
  componentDidMount() {
    const jsonUrl = 'http://raspberrypi.local/csv/data.json';

    fetch(jsonUrl)
      .then((response) => response.text())
      .then((jsonData) => {
        console.log(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching JSON:', error);
      });
  }

  render() {
    return (
      <div>
        {/* Your React component JSX */}
      </div>
    );
  }
}

export default JsonReader;
