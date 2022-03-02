import React,{MouseEventHandler} from 'react'
import  './index.scss'
type ProogressBarProps = {
    currentCount:number
    limit:number
    onClick:MouseEventHandler<HTMLDivElement>
}
export default function ProogressBar({currentCount,limit,onClick}:ProogressBarProps) {
  return (
    <div className="progress_wrap" onClick={onClick}>
    <div className="progressBar_container">
      <div
        className="progressBar_content"
        style={{
                width:currentCount ? (currentCount / limit) * 100 + '%' : 0
            }}
      >
        <div className="progressBar"></div>
        <div className="bee_container">
          <div
            className={`bubble ${(currentCount / limit) * 100 >= 50?'bubble_right':''}`}
          >
            <div className="bubble_text">
              已赚：{ currentCount > limit ? limit : currentCount }/{
                limit
              }元
            </div>
            <img src={require('@/assets/bubble.png')} alt="" className="bubble_img" />
          </div>
          <img src={require('@/assets/bee.png')} alt="" className="bee_img" />
        </div>
      </div>
    </div>
  </div>
  )
}
