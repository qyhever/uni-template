<template>
    <view class="privacy" v-if="visible" @touchmove="noop">
        <view class="content">
            <view class="title">隐私保护指引</view>
            <view class="des">
                在使用当前小程序服务之前，请仔细阅读
                <text class="link" @click="openPrivacyContract">{{privacyContractName}}</text>。如你同意{{privacyContractName}}，请点击“同意”开始使用。
            </view>
            <view class="btns">
                <button class="item reject" @click="onReject">拒绝</button>
                <button
                    id="agree-btn"
                    class="item agree"
                    open-type="agreePrivacyAuthorization"
                    @agreeprivacyauthorization="onAgreePrivacyAuthorization"
                >
                    同意
                </button>
            </view>
        </view>
    </view>
</template>

<script>
import { compareVersion } from '@/utils/index.js'
    
export default {
    data () {
        return {
            visible: false,
            privacyContractName: ''
        }
    },
    created () {
        const version = wx.getAppBaseInfo().SDKVersion
        if (compareVersion(version, '2.32.3') >= 0) {
            wx.getPrivacySetting({
                success: res => {
                    console.log('getPrivacySetting', res)
                    if (res.errMsg == 'getPrivacySetting:ok') {
                        this.privacyContractName = res.privacyContractName
                        this.visible = res.needAuthorization
                    }
                }
            })
        }
    },
    methods: {
        // 空事件禁止滑动事件穿透
        noop () {
            return false
        },
        openPrivacyContract () {
            wx.openPrivacyContract({
                complete: res => {
                    console.log('complete', res)
                },
                fail: () => {
                    wx.showToast({
                        title: '遇到错误',
                        icon: 'error'
                    })
                }
            })
        },
        onReject () {
            // wx.showToast({
            //     title: '必须同意后才可以继续使用当前小程序',
            //     icon: 'error'
            // })
        },
        onAgreePrivacyAuthorization () {
            this.visible = false
        }
    }
}
</script>

<style>
.privacy {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    width: 316px;
    padding: 24px;
    box-sizing: border-box;
    background: #fff;
    border-radius: 8px;
}

.content .title {
    text-align: center;
    color: #333;
    font-weight: bold;
    font-size: 16px;
}

.content .des {
    font-size: 13px;
    color: #666;
    margin-top: 20px;
    text-align: justify;
    line-height: 1.6;
}

.content .des .link {
    color: #07c160;
    text-decoration: underline;
}

.btns {
    margin-top: 24px;
    display: flex;
}

.btns .item {
    justify-content: space-between;
    width: 122px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    box-sizing: border-box;
    border: none;
}

.btns .reject {
    background: #f4f4f5;
    color: #909399;
}

.btns .agree {
    background: #07c160;
    color: #fff;
}
</style>
