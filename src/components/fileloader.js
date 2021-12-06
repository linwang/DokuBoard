import React from 'react';

export function FileLoader(props) {
    console.log('Render FileLoader');
    return (
      <div>
        <label>Load doku board:</label>
        <input type = 'file' id = 'input' onChange = {props.handleLoad}/>
      </div>
    );
  }