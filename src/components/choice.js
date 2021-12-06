import React from 'react';

export function Choice(props)
{
    console.log('Render Choice');
  return (
    <button className = "button-choice" onClick = {props.handleClick}>
    {props.labelProp}
    </button>);
}