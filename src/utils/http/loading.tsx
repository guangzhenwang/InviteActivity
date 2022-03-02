import React from 'react'
import './loading.scss';
export default function Loading(props: { text?:string }) {
  return (
    <div className="loading_container" >
      <div className="loading_content">
        <span className="loading_circle"></span>
        {
          props.text ? <div className="loading_text">{props.text}</div> : null
        }
      </div>
    </div>
  )
}
