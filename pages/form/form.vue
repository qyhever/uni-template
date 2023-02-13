<template>
	<view class="page-wrapper">
        <view class="form-wrapper">
            <u--form :model="model">
                <u-form-item label="姓名" prop="username" :required="true" borderBottom>
                    <u--input
                        v-model="model.username"
                        placeholder="请输入"
                        input-align="right"
                        border="none"
                        clearable
                    />
                </u-form-item>

                <u-form-item label="证件类型" prop="certType" :required="true" borderBottom label-width="66px">
                    <u-radio-group v-model="model.certType">
                        <u-radio name="1">
                            居民身份证
                        </u-radio>
                        <u-radio name="2">
                            其它证件
                        </u-radio>
                    </u-radio-group>
                </u-form-item>

                <u-form-item label="证件号码" prop="certNumber" :required="true" borderBottom label-width="66px">
                    <u--input
                        v-model="model.certNumber"
                        placeholder="请输入"
                        input-align="right"
                        border="none"
                        clearable
                    />
                </u-form-item>
                
                <u-form-item label="手机号码" prop="mobile" :required="true" borderBottom label-width="66px">
                    <u--input
                        v-model="model.mobile"
                        placeholder="请输入"
                        input-align="right"
                        border="none"
                        clearable
                    />
                </u-form-item>
                
                <u-form-item label="来源地区" prop="sourceRegion" :required="true" borderBottom label-width="66px" @click="regionVisible = true">
                    <u--input
                        :value="getRegionLabel(model.sourceRegion)"
                        placeholder="省市区县、乡镇等"
                        disabled
                        disabledColor="#ffffff"
                        border="none"
                        input-align="right"
                    />
                    <u-icon
                        slot="right"
                        name="arrow-right"
                    >
                    </u-icon>
                </u-form-item>
                
                <u-form-item label="来源详细地址" prop="sourceAddress" :required="true" borderBottom label-width="92px">
                    <u--input
                        v-model="model.sourceAddress"
                        placeholder="请输入"
                        type="textarea"
                        input-align="right"
                        border="none"
                        clearable
                    />
                </u-form-item>
                
                <u-form-item label="交通方式" prop="traffic" :required="true" borderBottom label-width="66px" @click="trafficVisible = true">
                    <u--input
                        :value="getLabel(enumTraffic.arr, model.traffic)"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择"
                        border="none"
                        input-align="right"
                    >
                    </u--input>
                    <u-icon
                        slot="right"
                        name="arrow-right"
                    >
                    </u-icon>
                </u-form-item>
                
                <u-form-item label="来(返)鄂时间" prop="backDate" :required="true" borderBottom label-width="92px"  @click="dateVisible = true">
                    <u--input
                        :value="formatDateTime(model.backDate)"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择"
                        border="none"
                        input-align="right"
                    >
                    </u--input>
                    <u-icon
                        slot="right"
                        name="arrow-right"
                    >
                    </u-icon>
                </u-form-item>
                
                <u-form-item label="本地居住方式" prop="live" :required="true" borderBottom label-width="92px" @click="liveVisible = true">
                    <u--input
                        :value="getLabel(enumLive.arr, model.live)"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择"
                        border="none"
                        input-align="right"
                    >
                    </u--input>
                    <u-icon
                        slot="right"
                        name="arrow-right"
                    >
                    </u-icon>
                </u-form-item>
                
                <u-form-item label="目的地市(州)" prop="destCity" :required="true" borderBottom label-width="92px">
                    <u--input v-model="model.destCity" placeholder="请输入" input-align="right" border="none" />
                </u-form-item>
                
                <u-form-item label="目的地村(社区)" prop="destCommunity" :required="true" borderBottom label-width="102px">
                    <u--input v-model="model.destCommunity" placeholder="请输入" input-align="right" border="none" />
                </u-form-item>
                
                <u-form-item label="目的详细地址" prop="destAddress" :required="true" borderBottom label-width="92px">
                    <u--input
                        v-model="model.destAddress"
                        placeholder="请输入"
                        type="textarea"
                        input-align="right"
                        border="none"
                    />
                </u-form-item>
            </u--form>
        </view>
        <view class="form-footer">
            <view class="agreement">
                <view class="agree-icon">
                    <u-checkbox-group>
                        <u-checkbox v-model="agree" @change="onAgreeChange"></u-checkbox>
                    </u-checkbox-group>
                </view>
                <view class="agreement-text">
                    本人承诺：以上所填内容真实准确、完整,如隐瞒、谎报、漏报情况造成危及公共安全后果，本人将承担相应的法律责任。
                </view>
            </view>
            <u-button @click="onSubmit">提交</u-button>
        </view>
        <u-picker
            :show="trafficVisible"
            :columns="[enumTraffic.arr]"
            keyName="label"
            closeOnClickOverlay
            :default-index="getDefaultIndex(enumTraffic.arr, model.traffic)"
            @close="trafficVisible = false"
            @cancel="trafficVisible = false"
            @confirm="e => onSelectConfirm(e, 'traffic', 'trafficVisible')"
        >
        </u-picker>
        <u-picker
            :show="liveVisible"
            :columns="[enumLive.arr]"
            keyName="label"
            closeOnClickOverlay
            :default-index="getDefaultIndex(enumLive.arr, model.live)"
            @close="liveVisible = false"
            @cancel="liveVisible = false"
            @confirm="e => onSelectConfirm(e, 'live', 'liveVisible')"
        >
        </u-picker>
        <u-datetime-picker
            :show="dateVisible"
            v-model="model.backDate"
            mode="datetime"
            @close="dateVisible = false"
            @cancel="dateVisible = false"
            @confirm="dateVisible = false"
        >
        </u-datetime-picker>
        <a-region v-model="model.sourceRegion" :show.sync="regionVisible"></a-region>
        <!-- <u-action-sheet :list="enumTraffic.arr" v-model="trafficVisible" @click="onSelectConfirm"></u-action-sheet> -->
	</view>
</template>

<script>
import { enumTraffic, enumLive } from '@/utils/enum'
import dayjs from '@/utils/dayjs.min'

function formatDateTime (val) {
    if (!val) {
        return ''
    }
    return dayjs(val).format('YYYY/MM/DD HH:mm')
}
export default {
    data() {
        this.formatDateTime = formatDateTime
        return {
            enumTraffic,
            enumLive,
            model: {
                username: '',
                certType: '1',
                certNumber: '',
                mobile: '',
                sourceRegion: [],
                sourceAddress: '',
                traffic: '',
                backDate: '',
                live: '',
                destCity: '',
                destCommunity: '',
                destAddress: ''
            },
            agree: false,
            trafficVisible: false,
            liveVisible: false,
            dateVisible: false,
            regionVisible: true
        }
    },
    onLoad() {
        const channel = this.getOpenerEventChannel()
        console.log('channel', channel)
        try {
            channel.once('switch-form', e => {
                console.log('e', e)
            })
        } catch (e) {}
        // getProvinceList().then(res => {
        //     console.log('res', res)
        // }).catch(err => {
        //     console.log('err', err)
        // })
        
        // getCityList({code: 440000000000}).then(res => {
        //     console.log('res', res)
        // }).catch(err => {
        //     console.log('err', err)
        // })
        
        // getCountyList({code: 440300000000}).then(res => {
        //     console.log('res', res)
        // }).catch(err => {
        //     console.log('err', err)
        // })
        
        // getTownList({code: 440306000000}).then(res => {
        //     console.log('res', res)
        // }).catch(err => {
        //     console.log('err', err)
        // })
    },
    methods: {
        getLabel (list, value) {
            const current = list.find(item => item.value === value) || {}
            return current.label || ''
        },
        getRegionLabel (list) {
            return list.map(item => item.label).join('')
        },
        getDefaultIndex (list, value) {
            const currentIndex = list.findIndex(item => item.value === value)
            return currentIndex ? [currentIndex] : [0]
        },
        onAgreeChange (val) {
            console.log(val)
        },
        onSelectConfirm (e, key, vKey) {
            if (e.indexs[0] === -1) { //没有默认值
                this.model[key] = e.values[0][0].value
            } else {
                this.model[key] = e.value[0].value
            }
            this[vKey] = false
        },
        onDateConfirm (e) {
            console.log('e', e)
            // const { year, month, day, hour, minute, second } = e
            // this.model.backDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`
        },
        onSubmit () {
            console.log('onSubmit')
        }
    }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
    padding-bottom: 20px;
}
.form-wrapper  {
    padding-left: 18px;
    padding-right: 10px;
    ::v-deep .u-form-item__body {
        padding: 15px 0;
    }
    ::v-deep .u-form-item__body__left__content__label {
        font-size: 14px;
    }
    ::v-deep .u-line {
        margin-left: -10px;
    }
    ::v-deep .u-radio-group {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .u-radio {
            margin-left: 10px;
        }
    }
}
.form-footer {
    padding: 0 20px;
}
.agreement {
	position: relative;
	margin: 20px 0;
    .agree-icon {
        position: absolute;
        top: -1px;
        left: 0;
    }
	.agreement-text {
		text-indent: 2em;
	}
}
</style>
