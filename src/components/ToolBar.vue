<template>
    <Row class-name="footer toolBar menu">
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/feed">
            <HomeIcon height="24" width="24" color="#999" />
            <i>首页</i>
        </router-link>
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/discover">
            <DiscoverIcon height="24" width="24" color="#999" />
            <i>发现</i>
        </router-link>
        </Col>
        <Col :span="4" class-name="menu-item plus-parent">
        <PlusIcon @click.native="showPrePost" height="28" width="28" color="#555" /> 
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/users/message">
            <Badge dot v-if="hasNewMessage">
                <MessageIcon height="24" width="24" color="#999" />
                <i>消息</i>
            </Badge>
            <template v-else>
                <MessageIcon height="24" width="24" color="#999" />
                <i>消息</i>
            </template>
        </router-link>
        </Col>
        <Col :span="5" class-name="menu-item">
        <router-link class="router-link" to="/users/profile">
            <Badge dot v-if="messageCount.fans">
                <MeIcon height="24" width="24" color="#999" />
                <i>我</i>
            </Badge>
            <template v-else>
                <MeIcon height="24" width="24" color="#999" />
                <i>我</i>
            </template>
        </router-link>
        </Col>
    </Row>
</template>
<script>
import { SHOWPREPOST, TOTALMESSAGELISTS, MESSAGENOTICE } from '../stores/types';
import HomeIcon from '../icons/Home';
import DiscoverIcon from '../icons/Discover';
import MessageIcon from '../icons/Message';
import MeIcon from '../icons/Me';
import PlusIcon from '../icons/Plus';
import { mapState } from 'vuex';

export default {
    name: 'tool-bar',
    components: {
        HomeIcon,
        DiscoverIcon,
        MessageIcon,
        MeIcon,
        PlusIcon
    },
    methods: {
        showPrePost() {
            this.$store.dispatch(SHOWPREPOST, cb => {
                cb(true)
            });
        }
    },
    computed: {
        ...mapState({
            messageCount: state => state.messageCount.messageCount
        }),
        hasNewMessage() {
            let messageList = this.$store.getters[TOTALMESSAGELISTS];
            let count = 0;
            for(let index in messageList) {
                count += messageList[index].count;
            }
            return(count + this.messageCount.comments.count + this.messageCount.diggs.count) > 0;
        }
    }
}
</script>
<style lang="scss">
.toolBar {
    position: absolute!important;
    bottom: 0;
    padding: 0;
    width: 100%;
    background-color: #ffffff;
    z-index: 4;
    .menu-item {
        height: 54px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #707c81;
        flex-wrap: wrap;
        padding: 0;
        &.plus-parent {
            background-color: #fff;
            padding: 0;
        }
        i {
            font-style: normal;
            font-size: 11px;
            margin-top: 3px;
        }
        .router-link {
            display: flex;
            line-height: 1;
            color: #999;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            svg {
                margin: 0 auto;
            }
        }

        .router-link-active {
            border-bottom: none;
            color: #e20000;
            svg {
                fill: #e20000;
                &:before {
                    color: #e20000;
                }
            }
        }
    }
}
</style>