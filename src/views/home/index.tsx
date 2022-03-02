import React, {  useEffect, useRef, useState } from 'react'
import { NoticeBar, Tabs } from 'antd-mobile';
import { Init, UserInfo } from '@/types/resoponse'
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '@/store';
import sucIcon from '@/assets/sucIcon.png'
import failIcon from '@/assets/failIcon.png'
import HelpInfo from '@/components/helpInfo';
import Default from '@/components/default';
import ProgressBar from '@/components/ProgressBar';
import  './index.scss'
const {__api:API,__tool:{jumpLink,toast}} = React

const hClickInvite = () => {
  API.invite().then(res => {
    if (res.code === 1000) window.plugTool.shareH5Img(res.data.message.substr(22))
  })
}
const textCode: {
  [k: string]: string
} = {
  //  本月已经为此人助力
  1: "每月仅可为同一人助力1次",
  // 老用户助力送100m限额
  3: "感谢助力",
  // 该手机型号已助力
  6: "该手机已帮好友助力~",
  //  助力失败
  7: "助力失败",
  //  助力成功但是助力者卡券领取达到限额
  8: "感谢助力",
  //  不可以给自己助力
  9: "不能为自己助力哦",
  // 今日已助力
  11: "今日助力机会已用完"
}
export type TabListElement = {
  tabIcon: string
  tabText: string
  helpList: UserInfo[]
}
export default function Home(props: RouteComponentProps & { popupType: string, popupData: any }) {
  // store.state
  const { popupType } = props
  // 页面数据
  const [pageData, setPageData] = useState<Init | null>(null)
  // tab列表

  const [tabList, setTabList] = useState<TabListElement[]>([])
  // 提醒气泡显示定时器
  const [remindTime, setRemindTime] = useState<null | NodeJS.Timeout>(null)
  // tab激活下标
  const [activeIndex, setActiveIndex] = useState('助力成功')
  // 助力状态
  const [helpStatus, setHelpStatus] = useState<string>('-1')
  const dispatch = useDispatch()
  // 初始化
  const init = (isRefresh: boolean=false) => {
    API.homeInit().then(res => {
      if (res.code === 1000) {
        if (res.data.helpStatus && textCode[res.data.helpStatus]) {
          setHelpStatus(res.data.helpStatus)
          // 拉起助力结果弹窗
          dispatch(actions.setPopupType('helpResult'))
        } else if (res.data.helpStatus === "2") {
          // 老用户助力送100m
          dispatch(actions.setPopupType('flow'))
        } else if (res.data.helpStatus === "4") {
          // 未在掌厅登录 跳下载页
          return window.location.replace("https://www.baidu.com")
        } else if (res.data.helpStatus === "5") {
          // 掌厅版本低  跳下载页
          return window.location.replace("https://www.baidu.com")
        } else if (res.data.helpStatus === "12") {
          // 上次助力未成功   跳下载页
          return window.location.replace("https://www.baidu.com")
        } else if (res.data.helpStatus === "10") {
          // 助力成功
          dispatch(actions.setPopupType('telCharge'))
        } else if (res.data.helpStatus) {
          // 助力失败
          setHelpStatus('7')
          dispatch(actions.setPopupType('helpResult'))
        }
        setPageData(res.data)
        // 显示提醒气泡
        if (res.data.remindStatus === 'open' && !isRefresh) {
          setRemindTime(setTimeout(() => {
            if (remindTime) clearTimeout(remindTime)
            setRemindTime(null)
          }, 4000))
        }
        setTabList([
          {
            tabIcon: sucIcon,
            tabText: "助力成功",
            helpList: res.data.helpSuccess
          },
          {
            tabIcon: failIcon,
            tabText: "助力失败",
            helpList: res.data.helpFail
          }
        ])
      }
    })
  }
  // 关闭弹窗
  const closePopup = () => {
    // 重新初始化页面
    const URL = window.location.origin + window.location.pathname
    dispatch(actions.setPopupType(null))
    window.location.href = URL
  }
  // 邀请记录楼层
  const inviteRecordFloor = useRef<HTMLDivElement | null>(null)
  // 页面容器
  const sectionNode = useRef<HTMLElement | null>(null)
  const scrollToInviteRecord = () => {
    let initFloorOffsetTop = inviteRecordFloor.current?.getBoundingClientRect().top || 0;
    let pageScrollTop = sectionNode.current?.scrollTop || 0;
    if (initFloorOffsetTop + pageScrollTop) sectionNode.current?.scrollTo({
      top: initFloorOffsetTop + pageScrollTop,
      left: 0,
      behavior: 'smooth'

    })
  }

  const hClickShowMore = () => {
    props.history.push({
      pathname: ('/record?index=' + activeIndex ),
    })
  }
  // 设置提醒
  const hClickTip = ()=>{
    API.setRemind().then(res => {
      if (res.code === 1000) {
        if (pageData?.remindStatus === 'open') {
          setPageData({...pageData,remindStatus:'close'})
         toast("取消设置提醒成功~")
          // 移除提醒气泡
          if (remindTime) {
            clearTimeout(remindTime)
            setRemindTime(null)
          }
        } else {
          if(pageData)setPageData({...pageData,remindStatus:'open'})
          toast("设置提醒成功~")
          // 显示提醒气泡
          setRemindTime(setTimeout(() => {
            if(remindTime)clearTimeout(remindTime)
            setRemindTime(null)
          }, 4000))
        }
      } else {
        toast("当前网络繁忙，请稍后再试~")
      }
    })
  }
  useEffect(init, [])
  return (
    pageData ? (
      <div className="home_container">
        <section ref={sectionNode}>
          <header>
            <NoticeBar
              className="header_noticeBar"
              content={pageData.headInfo.GOODS_CODE}
            />
            <div className="header_banner">
              {<img src={pageData.headInfo.IMG_URL} alt="" className="header_img" />}

              <div
                className="header_nav header_nav--rule"
                onClick={
                  () => jumpLink(pageData.headInfo.HREF)
                }
              >
                <img src={require('@/assets/rule.png')} alt="" className="nav_img" />
              </div>
              <div
                className="header_nav header_nav--serve"
                onClick={() => jumpLink('https://www.baidu.com/')}
              >
                <img src={require('@/assets/server.png')} alt="" className="nav_img" />
              </div>

              <div className="header_nav header_nav--tip">
                <img
                  src={require('@/assets/tip.png')}
                  alt=""
                  className="nav_img"
                  onClick={hClickTip}
                />
                {
                  pageData.remindStatus === 'open' ?
                    <img
                      src={require('@/assets/tipCancel.png')}
                      alt=""
                      className="tip_cancel"
                    /> : null
                }
                {
                  remindTime ? <div className="tip_bubble">
                    <div className="tip_text">
                      您当前已开启短信提醒， <br />助力成功后会及时短信通知
                    </div>
                    <img src={require('@/assets/tipBubble.png')} alt="" className="bubble_img" />
                  </div> : null
                }
              </div>
            </div>
          </header>
          <main>
            {/* 进度条楼层 */}
            <div className="progressBar_container">
              <ProgressBar
                limit={pageData.limitChange}
                onClick={scrollToInviteRecord}
                currentCount={pageData.helpSuccessSum}
              />
            </div>
            {/** 邀请按钮 */}
            <div
              className="tele_charge--btn btn_jump"
              onClick={hClickInvite}
            >
              <img src={require('@/assets/inviteBTN.png')} alt="" className="invite_btn" />
            </div>
            {/** 邀请记录 */}
            <div className="invite_record--floor">
              <div className="floor_head"></div>
              <div className="floor_body">
                <div className="price_contianer">
                  <div className="price_count">{pageData.getSum}.00</div>
                  <div className="price_text">累计领取（元）</div>
                </div>
                <div className="invite_container">
                  <div className="invite_count">{pageData.initiatorCount}</div>
                  <div className="invite_text">邀请人数</div>
                </div>
              </div>
            </div>
            {/** 搜索楼层 */}
            <div className="search_user">
              不知道邀请谁？查找一下吧
              <img
                src={require('@/assets/searchBTN.png')}
                alt=""
                className="search_img"
                onClick={() => props.history.push('/check')}
              />
            </div>
            {/** 邀请列表楼层 */}
            <div className="invite_list--floor" ref={inviteRecordFloor}>
              <div className="floor_head">
                <div
                  className="record_head-btn"
                  onClick={hClickShowMore}
                >
                  查看历史记录{'>>'}
                </div>
              </div>
              <div className="floor_body">
                <Tabs
                  activeKey={activeIndex}
                  activeLineMode="full"
                  onChange={k => setActiveIndex(k)}
                  stretch={true}
                  className="tab_header"
                >
                  {
                    tabList.map((ele,index )=> {
                      return (
                        <Tabs.Tab  title={<div className="tab_container" key={ele.tabText} >
                          <img src={ele.tabIcon} alt="" className="tab_icon" />{
                            ele.tabText
                          }
                        </div>} key={ele.tabText}>
                          {
                            ele && ele.helpList && ele.helpList.length ?
                              <div
                                className="tab_content"
                              >
                                <div className="help_list">
                                  {
                                    ele.helpList.map((e, i) => {
                                      return (
                                        <HelpInfo
                                          coupon={e}
                                          onAddGetSum={(goodsChange: string) => setPageData({ ...pageData, getSum: Number(pageData.getSum) + Number(goodsChange) })}
                                          index={i}
                                          key={i}
                                        />

                                      )
                                    })
                                  }

                                </div>
                              </div> :
                              <Default text="当月暂无记录~去参加活动吧！" />
                          }
                        </Tabs.Tab>
                      )
                    })
                  }
                </Tabs>
              </div>
            </div >
            {
              pageData.bottomInfo && pageData.bottomInfo.IMG_URL ?
                <div
                  className="welfare_floor"
                >
                  <div className="floor_head"></div>
                  <div className="floor_body">
                    <img
                      src={pageData.bottomInfo.IMG_URL}
                      alt=""
                      className="welfare_img"
                    />
                  </div>
                </div> : null
            }
          </main >
        </section >
        {
          popupType ? <div className="mask"></div> : null
        }

        {/* 话费券弹窗 */}
        {
          popupType === 'telCharge' ?
            <div className="popup telCharge">
              <img src={pageData.heapStatusPop} alt="" className="topImg" />
              <img
                src={require('@/assets/happyGet.png')}
                alt=""
                className="btnImg"
                onClick={closePopup}
              />
              <div className="popup_desc">奖品已发送至“我的卡券”中</div>
              <div className="btn_close" onClick={closePopup}>
                <img src={require('@/assets/close.png')} alt="" className="close_img" />
              </div>
            </div> : null
        }

        {/* 流量券弹窗 */}
        {
          popupType === 'flow' ? <div className="popup flow">
            <img src={pageData.heapStatusPop} alt="" className="topImg_small" />
            <img
              src={require('@/assets/meToo.png')}
              className="btnImg"
              onClick={closePopup}
              alt=""
            />
            <div className="popup_desc">奖品已发送至“我的卡券”中</div>
            <div className="btn_close" onClick={closePopup}>
              <img src={require('@/assets/close.png')} alt="" className="close_img" />
            </div>
          </div> : null
        }

        {/* 感谢助力弹窗 */}
        {
          popupType === 'helpResult' ?
            <div className="popup small">
              <img src={pageData.heapStatusPop} alt="" className="popup_img" />
              <div
                className="popup_desc"
                style={{
                  fontSize:
                    textCode[helpStatus] && textCode[helpStatus].length > 14
                      ? '0.4rem'
                      : '0.5rem'
                }}
              >
                {textCode[helpStatus]}
              </div>
              <img
                src={require('@/assets/meToo.png')}
                alt=""
                className="pop_btn"
                onClick={closePopup}
              />
              <div className="btn_close" onClick={closePopup}>
                <img src={require('@/assets/close.png')} alt="" className="close_img" />
              </div>
            </div > : null
        }

      </div >
    ) : null

  )
}
