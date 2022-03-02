type UserInfo = {
  mobile: string
  time: string
  buttonStatus?: string
  type?: string
  helpStatus?: string
}

// 响应类型模板
interface Res<D = Init> {
  code: number
  data: D
}
export declare interface Init {
  // 活动说明链接
  explainLink: string
  // 提醒开关
  remindStatus: string
  bottomInfo: {
    IMG_URL: string
  }
  headInfo: {
    IMG_URL: string
    HREF: string
    OTHER_INFO: string
    GOODS_CODE: string
  }
  getSum: number
  helpSuccessSum: number
  limitChange: number
  initiatorCount: string
  helpSuccess: UserInfo[]
  helpFail: UserInfo[]
  heapStatusPop: string
  buttonStatus: string
  helpStatus: string | null
}
export declare interface Invite {
  helpSuccess: any
  helpFail: any
  message: string
}

export declare interface GetGoods {
  status: string,
  goodsChange: string
}

export declare interface SeeMore {
  helpSuccess: UserInfo[]
  helpFail: UserInfo[]
}


export declare interface Check {
  status:string
}
type LogEle =  {
  HELPER_MOBILE:string
  USER_TYPE:string
  HELPER_NAME:string
  SEARCH_TIME:string
  ID:string
}
export declare interface CheckInit {
  searchInfoLog:LogEle[]
}

export declare interface Clean {
  searchInfoLog:array
}

export declare interface SetRemind {

}