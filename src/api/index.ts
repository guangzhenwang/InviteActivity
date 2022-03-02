import React from 'react'
import { Check, CheckInit, GetGoods, Init, Invite,SeeMore, SetRemind } from '@/types/resoponse'
import httpReq from '@/utils/http'
// 声明接口基准地址
let BASEURL = "http://localhost:3001/"

const homeInit = <T = Init>(params: { activityType?: string } = {}) => {
  return httpReq<T>({
    url: `${BASEURL}initPage.do`,
    params
  })
}

const invite = <T = Invite>(params: { activityType?: string } = {}) => {
  return httpReq<T>({
    url: `${BASEURL}invite.do`,
    params
  })
}

// 查看更多页面初始化接口
const seeMore = <T = SeeMore>(params = {}) => {
  return httpReq<T>({
    url: `${BASEURL}seeMore.do`,
    params
  })
}


// 设置提醒接口
const setRemind = (params = {}) => {
  return httpReq<SetRemind>({
    url: `${BASEURL}setSmsStatus.do`,
    params
  })
}

// 领取接口
const get = <T = GetGoods>(params = {}) => {
  return httpReq<T>({
    url: `${BASEURL}getGoods.do`,
    params
  })
}

// 验证页面初始化接口
const checkInit = (params = {}, hideLoading = false) => {
  return httpReq<CheckInit>({
    url: `${BASEURL}searchLog.do`,
    params,
    hideLoading
  })
}

// 验证接口
const check = (params = {}) => {
  return httpReq<Check>({
    url: `${BASEURL}search.do`,
    params,
    loadText: "验证中..."
  })
}

// 清除接口
const clean = (params = {}) => {
  return httpReq({
    url: `${BASEURL}cleanSearchLog.do`,
    params
  })
}
const api = { homeInit,invite,get,seeMore,check,checkInit,clean,setRemind }
React.__api = api
export default api