import Loading from './loading'
import ReactDOM from "react-dom"
import { useState } from "react"
import { AxiosRequestConfig } from '@/types/resetAxios'
import { Res } from '@/types/resoponse'
type dispathConfig = { showLoading: boolean } & AxiosRequestConfig

let unpdateLoadingShow: React.Dispatch<React.SetStateAction<boolean>>
const LoadingWrap = (props: { text?: string }) => {
  const [stateLoadingShow, setStateLoadingShow] = useState(true)
  unpdateLoadingShow = setStateLoadingShow
  return stateLoadingShow ? <Loading {...props} /> : null
}

// 发送请求
const dispatch =  <T,> ({ method, url, params, data, showLoading }: dispathConfig) => {
  return window.axios<Promise<Res<T>>>({
    url,
    method,
    data,
    params
  }) 
  .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err))
    .finally(() => {
      // 隐藏loading组件
      if (showLoading) unpdateLoadingShow(false)
    })
}

export default function httpReq<T>({ showLoading = true,text='加载中...', ...resOpt }) {
  // 拉起loading
  if (showLoading) {
    const vn = document.createElement('div')
    vn.id = 'loading_wrap'
    ReactDOM.render(<LoadingWrap text={text}/>, vn)
    document.body.insertBefore(vn, document.getElementById('app'))
  }
  return dispatch<T>({ showLoading, ...resOpt })
}