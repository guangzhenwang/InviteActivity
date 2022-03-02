import React from 'react'
type DefaultProps = {
    text:string
}
export default function Default({text}:DefaultProps) {
  return (
    <div className="defautl_container">
    <img src={require('@/assets/bigBee.png')} alt="" className="bee_img" />
    <div className="record_desc">{{ text }}</div>
  </div>
  )
}
