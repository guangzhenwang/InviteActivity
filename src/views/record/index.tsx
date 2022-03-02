import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd-mobile';
import sucIcon from '@/assets/sucIcon.png'
import failIcon from '@/assets/failIcon.png'
import { TabListElement } from '../home';
import HelpInfo from '@/components/helpInfo';
import Default from '@/components/default';
import './index.scss'
const {__api:API} = React
export default function Record() {
  const [tabList, setTabList] = useState<TabListElement[]>([])
    // tab激活下标
    const [activeIndex, setActiveIndex] = useState('助力成功')
    const init = ()=> {
      API.seeMore().then(res => {
        if (res.code === 1000) {
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
    useEffect(init, [])
  return (
    <div className="container">
    <section>
      <div className="record_container">
        <img className="record_bg" src={require('@/assets/inviteBg.png')} alt="" />
        <div className="record_list">
        <Tabs
                  activeKey={activeIndex}
                  activeLineMode="full"
                  onChange={k => setActiveIndex(k)}
                  stretch={true}
                  className="tab_header"
                >
                  {
                    tabList.map((ele )=> {
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
      </div>
    </section>
  </div>
  );
}
