import React, {  useState } from 'react'
import './index.scss';
const {__api:API,__tool:{toast, jumpLink }} = React
type HelpInfoProps = {
    coupon: any
    onAddGetSum?: Function
    index: number
}
const reasonText: {
    [k: string]: string
} = {
    2: "当天未登录山东移动APP",
    3: "不是新用户",
    4: "重复邀请",
    5: "山东移动APP版本过低"
}
export default function HelpInfo({ coupon: data, index, onAddGetSum }: HelpInfoProps) {
    const [coupon, setCoupon] = useState(data)
    const hClickGet = () => {
        API.get({ orderId: coupon.orderId }).then(res => {
            if (res.code === 1000) {
                const { status, goodsChange } = res.data
                if (status === "4") {
                    // 领取成功
                    toast("领取成功！奖品已发送至“<a class=\"myCoupon\" href=\"https://www.baidu.com\">我的卡券</a>”")
                    setCoupon({ ...coupon, buttonStatus: '1' })
                    // 页面领取总数增加
                    if (goodsChange&&onAddGetSum) onAddGetSum(goodsChange)
                } else if (status === "1") {
                    // 达到限额
                    toast("获取话费红包已达100元，感谢您的参与~")
                } else if (status === "2") {
                    // 卡券已过期
                    toast("卡券已过期，仅能领取当月卡券哦~")
                    setCoupon({ ...coupon, buttonStatus: '5' })
                } else if (status === "5") {
                    // 已领取
                    toast("已领过当前红包了，去邀请好友得新红包把~")
                    setCoupon({ ...coupon, buttonStatus: '1' })
                } else {
                    // 领取失败
                    toast("咦~红包走丢了，请稍后再试！")
                }
            } else {
                toast("咦~红包走丢了，请稍后再试！")
            }
        })
    }
    return (
        <div className="coupon_item">
            <div className="coupon_index">
                <img className="index_img" src={require('@/assets/countBG.png')} alt="" />
                <div className="index_count">{index + 1}</div>
            </div>
            <div className="coupon_desc">
                <div className="coupon_tel">
                    {data.mobile}
                    {
                        data.type === '1' ?
                            <img
                                src={require('@/assets/inviteFriend.png')}
                                alt=""
                                className="coupon_icon"
                            /> : null
                    }
                    {
                        data.type === '2' ?
                            <img
                                src={require('@/assets/helpFriend.png')}
                                alt=""
                                className="coupon_icon"
                            /> : null
                    }

                </div>
                <div className="coupon_time">{data.time}</div>
            </div>
            {/* 右侧按钮 */}
            {
                data.buttonStatus === '2' || data.buttonStatus === '4' ? <img
                    src={require('@/assets/couponGet.png')}
                    alt=""
                    className="coupon_btn"
                    onClick={hClickGet}
                /> : null
            }
            {
                data.buttonStatus === '1' ?
                    <img
                        src={require('@/assets/toget.png')}
                        alt=""
                        className="coupon_btn"
                        onClick={() => jumpLink('https://www.baidu.com/')}
                    /> : null
            }
            {
                data.buttonStatus === '5' ? <div className="coupon_btn">已过期</div> : null
            }

            {/* 右侧详情 */}
            {
                data.helpStatus ? <div className="fail_container">
                    {reasonText[data.helpStatus]}
                </div> : null
            }

        </div>
    )
}
