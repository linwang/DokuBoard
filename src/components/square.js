import React from 'react';

export function Square(props)
{
    console.log('Render Square');
  return(<button className = "square">
        {props.value}
        </button>);
}