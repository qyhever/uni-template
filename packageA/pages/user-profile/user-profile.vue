<template>
    <view>
        <view class="py-30 flex justify-center avatar-wrapper">
            <button
                class="avatar-btn"
                open-type="chooseAvatar"
                @chooseavatar="onChooseAvatar"
            >
              <image class="avatar-image" :src="avatarUrl"></image>
            </button>
        </view>
        <u--form
            ref="uForm"
            labelPosition="left"
            :model="formModel"
            :rules="rules"
        >
            <u-form-item
                label="昵称"
                prop="nickname"
                borderBottom
            >
                <u--input
                    v-model="formModel.nickname"
                    type="nickname"
                    border="none"
                />
            </u-form-item>
        </u--form>
    </view>
</template>

<script>
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

export default {
    data () {
        return {
            avatarUrl: defaultAvatarUrl,
            formModel: {
                nickname: ''
            },
            rules: {
                nickname: [
                    { required: true, message: '请填写昵称' }
                ]
            }
        }
    },
    onReady() {
        this.$refs.uForm.setRules(this.rules)
    },
    methods: {
        onChooseAvatar (event) {
            console.log('event.detail.avatarUrl', event.detail.avatarUrl)
            this.avatarUrl = event.detail.avatarUrl
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar-btn {
    display: flex;
    padding-left: 0;
    padding-right: 0;
    background-color: #fff;
    &:after {
        border: 0;
    }
}
.avatar-image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}
</style>