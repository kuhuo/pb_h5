<template>
    <ul style="background-color: #fff">
        <li :class="$style.findItem" @click="changeUrl(`/users/feeds/${user.id}`)" v-for="user in formatDatas" :key="user.id">
            <user-avatar :sex='user.sex' :src='user.avatar || null' />
            <div :class="$style.iteminfo">
                <p :class="$style.itemName">{{user.name}}</p>
                <p :class="$style.itemBio">{{user.bio}}</p>
            </div>
            <div :class="$style.itemFollow">
                <div class="actionButton" @click.stop="handleFollowingStatus(user.followAction.status, user.id)">
                    <FollowingIcon v-if="user.followAction.text == '已关注'" height="24" width="24" color="#e20000" />
                    <UnFollowingIcon v-if="user.followAction.text == '关注'" height="24" width="24" color="#333" />
                    <EachFollowingIcon v-if="user.followAction.text == '相互关注'" height="24" width="24" color="#e20000" />
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import FollowingIcon from '../../icons/Following';
import UnFollowingIcon from '../../icons/UnFollowing';
import EachFollowingIcon from '../../icons/EachFollowing';

import { changeUrl } from '../../utils/changeUrl';
import { resolveImage } from '../../utils/resource';

import { followingUser, unFollowingUser } from '../../utils/user';

const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));

export default {
    name: "find-person-list",
    components: {
        FollowingIcon,
        UnFollowingIcon,
        EachFollowingIcon
    },
    props: {
        datas: {
            type: Array,
            required: true
        }
    },
    data() {
        return({

        });
    },
    computed: {
        formatDatas() {
            return this.datas.filter(person => person.id).map((person) => {
                let { id, bio, name, avatar, follower = false, following = false } = person || {},
                    followAction = {
                        status: false,
                        text: "关注"
                    };

                bio = bio || "这家伙很懒，什么也没有留下";

                if(this.following && this.follower) {
                    followAction = {
                        status: true,
                        text: '相互关注'
                    };
                }
                if(!this.follower) {
                    followAction = {
                        status: false,
                        text: '关注'
                    }
                }
                if(!this.following && this.follower) {
                    followAction = {
                        status: true,
                        text: '已关注'
                    }
                }

                return { id, bio, name, avatar, follower, following, followAction };
            });
        },
    },
    methods: {
        changeUrl,
        handleFollowingStatus(status, id) {
            // 关注操作
            if(status) {
                // 取关
                this.handleUnfollowing(id);
            } else {
                // 加关注
                this.handleFollowing(id);
            }
        },
        // 取关操作
        handleUnfollowing(id) {
            unFollowingUser(id)
                .then(status => {
                    if(status) {
                        this.follower = false;
                    } else {
                        this.$store.dispatch(NOTICE, cb => {
                            cb({
                                text: '取关失败,可能是还没关注',
                                time: 1500,
                                status: true
                            });
                        });
                    }
                });
        },
        // 关注操作
        handleFollowing(id) {
            followingUser(id)
                .then(status => {
                    if(status) {
                        this.follower = true;
                    } else {
                        this.$store.dispatch(NOTICE, cb => {
                            cb({
                                text: '关注失败,可能是已经关注了',
                                time: 1500,
                                status: true
                            });
                        });
                    }
                })
        },
    }
}
</script>
<style lang="less" module>
.findItem {
    display: flex;
    align-items: center;
    padding: 15px;
    height: 100px;
    border-bottom: 1px solid #ededed;
    > * {
        flex: 0 0 auto;
    }
}

.iteminfo {
    overflow: hidden;
    flex-grow: 1;
    padding: 0 15px;
    font-size: 16px;
    >p {
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemName {
        color: #333;
    }
    .itemBio {
        font-size: 14px;
        color: #999;
    }
}

.itemFollow {
    display: flex;
    justify-content: center;
}
</style>