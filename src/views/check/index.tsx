import { LogEle } from '@/types/resoponse'
import React, { ChangeEventHandler, FocusEventHandler, useState } from 'react'
import  './index.scss';
const {__api:API,__tool:{toast}} = React
let telList:{
  [k :string]:string
} = {}
export default function Check() {
  // 手机号 + 备注？
  const [iptValue, setIptValue] = useState('')
  const [checkList, setCheckList] = useState<LogEle[]>([])
 const hChange:ChangeEventHandler = (e)=> {
  const value = (e.target as HTMLInputElement).value.trim()
    setIptValue(value)
  }

  // 失去焦点 判断为通讯录手机号
  const hBlur:FocusEventHandler = (e) =>{
    const value = (e.target as HTMLInputElement).value.trim()
    if(telList[value]) setIptValue(iptValue+`(${telList[value]})`)
  }
  // 获取焦点 删除备注部分
const hFocus:FocusEventHandler = (e)=>{
  const value = (e.target as HTMLInputElement).value.trim()
  if(value.indexOf('(')!==-1) setIptValue(value.substring(0,value.indexOf('(')-1))
}
// 打开通讯录
const hClickAddress = ()=>{
  if (!window.plugTool.isApp()) return toast("通讯录功能需在客户端内使用")
  window.appObj.address(function (json) {
    //alert('success');
    json = $.parseJSON(json);
    if (json.address) {
      if (json.address.phone) {
        var phoneNumber = json.address.phone.replace(/[^0-9]/gi, "");
        //删除+86
        if (phoneNumber.indexOf("86") === 0) {
          phoneNumber = phoneNumber.substring(2, phoneNumber.length);
        }
        if (phoneNumber.indexOf("+86") === 0) {
          phoneNumber = phoneNumber.substring(3, phoneNumber.length);
        }
        let iptVal = phoneNumber
        // 如果有昵称
        if (json.address.name) {
          telList[json.address.name] = iptVal
          iptVal+=`(${json.address.name})`
        }
        // 获取并显示手机号+备注
        setIptValue(iptVal)
      } else {
        toast("未找到手机号");
      }
    }
  });
}
// 验证手机号
const hClickCheck =()=>{
      if (!iptValue) return toast("请输入手机号~")
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (iptValue.indexOf('(')===-1 && !myreg.test(iptValue)) return toast("请输入正确格式的手机号~")
      // 对手机号 联系人进行加密
      let params :{
        helpUser:string
        nickName?:string
      }= {
        helpUser: encryptByDES(iptValue)
      }
      if (telList[iptValue]) params.nickName = encryptByDES(telList[iptValue])
      // 上传数据
      check(params, "0")
}
const check =  (params = {}, isRecheck:string|null, index:null|number=null)=> {
  API.check(params).then(res => {
    if (res.code === 1000) {
      // 非重新校验按钮
      if (isRecheck === '0') {
        setIptValue('')
        init(true)
      } else {
        const statusCode:{
          [k:string]:string
        } = {
          3: "newUser",
          4: "oldUser",
          5: "other",
        }
        // 更新状态
        if (statusCode[res.data.status]&&index) {
          checkList[index].USER_TYPE = statusCode[res.data.status]
          setCheckList(checkList)
        }
        
      }
      const toastCode:{
        [k:string ]:string
      } = {
        3: "此用户为新用户",
        4: "此用户为老用户",
        5: "此用户非山东移动号",
        6006: "操作频繁，请1分钟后再试~"
      }
      if (toastCode[res.data.status]) {
        toast(toastCode[res.data.status])
      } else if (res.data.status === '1') {
        toast("验证失败，请明日再试~")
      } else if (res.data.status === '2') {
        toast("请输入正确格式的手机号~")
      } else {
        toast("验证失败，请稍后再试~")
      }
    } else {
      toast("验证失败，请稍后再试~")
    }
  })
}
const init = (hideLoad:boolean=false)=> {
  API.checkInit({}, hideLoad).then(res => {
    if (res.code === 1000) {
      const { searchInfoLog } = res.data
      setCheckList(searchInfoLog)
    }
  })
}
const cleanRecord =() =>{
  API.clean().then(res => {
    if (res.code === 1000) {
      setCheckList([])
    }
  })
}
const hClickInvite =() =>{
  API.invite().then(res => {
    if (res.code === 1000) {
      window.plugTool.shareH5Img(res.data.message.substr(22))
    }
  })
}
  return (
    <div className="container">
    <section>
      <div className="search_container">
        <div className="input_container">
          <input
            type="tel"
            min="11"
            placeholder="请输入好友手机号码验证"
            className="input"
            value={iptValue}
            onChange={hChange}
            onBlur={hBlur}
            onFocus={hFocus}
          />
          <img
            onClick={hClickAddress}
            src={require('@/assets/address.png')}
            alt=""
            className="address"
          />
        </div>
        <div
          className="check_btn"
          onClick={hClickCheck}
        >
          验证
        </div>
      </div>
      <div className="record_container">
        <div
          className={`record_head ${checkList && checkList.length?'record_head--default':''}`}
        >
          {
            checkList?.length? <div
            onClick={cleanRecord}
            className="remove_btn"
          ></div>:null
          }
         
        </div>
      {
         checkList?.length?
          <div className="record_body" >
         {
           checkList.map((e,i)=>{
            return    <div className="record_item" key={i}>
            <div className="record_left">
              <div className="record_tel">
                { e.HELPER_MOBILE
                }{ e.HELPER_NAME ? "（" + e.HELPER_NAME + "）" : "" }
              </div>
              <div className="record_time">{ e.SEARCH_TIME }</div>
            </div>
           
            {
              e.USER_TYPE === 'newUser'? <div className="record_mid red" >
              新用户
            </div>:null
            }
            {
              e.USER_TYPE === 'oldUser'?<div className="record_mid">
              老用户
            </div>:null
            }
            {
              e.USER_TYPE === 'other'?  <div className="record_mid">
              非山东移动
            </div>:null
            }
            <div
              className="record_right"
              onClick={()=>check({ id: e.ID }, null, i)}
            >
              重新验证
            </div>
          </div>
           })
         
         }
        </div>:<div className="record_body default_container">
          <img src={require('@/assets/bigBee.png')} alt="" className="default_img" />
        </div>
      }
        
      </div>
    </section>
    <div
      className="bot_btn"
      onClick={hClickInvite}
    >
      <img src={require('@/assets/invite_btn.png')} alt="" className="btn_img" />
    </div>
  </div>
  )
}
