import React from 'react';
import { AxiosInstance, AxiosStatic ,Axios,AxiosRequestConfig} from './resetAxios'
import api from '@/api'
import tool from '@/utils'
interface JSONString extends string {
  address?:{
    phone?:string
    name?:string
  }
}
type AddressCallback = (json:JSONString&string)=>void
declare global {
  interface Window {
    // CDN引入 
    axios: AxiosStatic
    // 公共JS能力
    sdDefaults: {
      VServerAPI: string
    },
    plugTool:{
      shareH5Img:(string)=>viod 
      Jtoast:(text:string,postions:string='middle')=>viod
      isApp:()=>boolean
    }
    appObj:{
      address:(cb:AddressCallback)=>viod
    }
  }
  // React静态属性
  namespace React {
    // 接口模块
    let __api:  typeof api
    // 工具函数模块
    let __tool:  typeof tool
  }


}
