<template>
  <div class="comments">
    <div class="commonHeader" v-if="!isWeiXin">
      <Row :gutter="24">
        <Col span="5">
          <BackIcon @click.native="goTo(-1)" height="21" width="21" color="#999" />
        </Col>
        <Col span="14" class="title-col">
          评论
        </Col>
      </Row>
    </div>
    <div v-if="nothing" class="nothingDefault"> 
      <img :src="nothing" />
    </div>
    <div class="loadMoreContainer">
      <mt-loadmore
        v-if="!nothing"
        :bottom-method="loadBottom"
        :top-method="loadTop"
        :bottom-all-loaded="bottomAllLoaded"
        :top-all-loaded="topAllLoaded"
        @bottom-status-change="bottomStatusChange"
        ref="loadmoreComments"
        :bottomDistance="70"
      >
        <section class="commentContent">
          <ul :class="$style.comments">
            <li v-for="(comment, index) in formated" :key="index" :class="$style.comment">
              <div :class="$style.commentContent">
                <div class="avatar-parent-col" style="width: 16vw">
                  <user-avatar @click.native="changeUrl(`/users/feeds/${comment.user_id}`)" :src="comment.avatar" :sex="comment.sex" size="small" />
                </div>
                <div span="16" style="width: 68vw; padding: 0 12px;">
                  <!-- 评论者 -->
                  <h4 @click="changeUrl(`/users/feeds/${comment.user_id}`)">{{comment.name}}</h4>
                  <!-- 第三+评论者 -->
                  <div class="gray-color">
                    <span v-if="comment.replyUser">回复</span>
                    <span @click="changeUrl(`/users/feeds/${comment.replyUser.user_id}`)" class="primary-color" style="padding: 0 4px;" v-if="comment.replyUser">{{comment.replyUser.name}}: </span>
                    {{comment.body}}
                  </div>
                  <timeago style="font-size: 14px; color: #999;" :since="comment.time" locale="zh-CN" :auto-update="60"></timeago>
                </div>
                <div style="width: 16vw">
                  <div :class="$style.sourceContent">
                    <img v-if="comment.cover" @click="openCommentBox(index, comment.commentable, comment.commentable_id, comment.name)" :src="comment.cover" />
                    <div v-if="!comment.cover" @click="openCommentBox(index, comment.commentable, comment.commentable_id, comment.name)" :class="$style.source">
                      <div :class="$style.content">
                        {{comment.source_content}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 评论框 -->
              <section :class="$style.commentBox" v-if="openId === index" ref="commentInput" style="width: 100%;">
                <li>
                  <Input 
                    type="textarea" 
                    ref="commentInput"
                    class="commentInput"
                    :autosize="{ minRows: 1, maxRows: 4 }" 
                    :minlength='1' 
                    :maxlength='255'
                    :autofocus="true"
                    v-model="commentsContent"
                    :placeholder="placeholder"
                    v-childfocus
                  />
                </li>
                <li :class="$style.commentOperations">
                  <p :class="$style.commentOperation" v-show="commentCount > 100">
                    <span :class="{ inputFull: commentCount > 100 }">{{ commentCount }}</span>/255
                  </p>
                  <Button :class="$style.commentOperation" type="text" class="sendButton" size="small" @click.native="closeCommentBox()">取消</Button>
                  <Button 
                    :class="$style.commentOperation" 
                    type="primary" 
                    class="sendButton" 
                    :disabled="!commentCount" 
                    size="small" 
                    @click.native="sendComment()"
                  >
                    发送
                  </Button>
                </li>
              </section>
            </li>
          </ul>
        </section>
        <section slot="bottom" class="mint-loadmore-bottom">
          <span v-if="bottomAllLoaded">没有更多了</span>
          <section v-else>
            <span v-show="bottomStatus === 'pull' && !bottomAllLoaded" :class="{ 'rotate': topStatus === 'drop' }">上拉加载更多</span>
            <span v-show="bottomStatus === 'loading' && !bottomAllLoaded">加载中...</span>
            <span v-show="bottomStatus === 'drop' && !bottomAllLoaded">释放加载更多</span>
          </section>
        </section>
      </mt-loadmore>
    </div>
  </div>
</template>
<script>
  import { NOTICE, CLEANMESSAGE } from '../stores/types';
  import { createAPI, addAccessToken, createOldAPI } from '../utils/request';
  import localEvent from '../stores/localStorage';
  import { changeUrl, goTo } from '../utils/changeUrl';
  import timers from '../utils/timer';
  import BackIcon from '../icons/Back';
  import lodash from 'lodash';
  import { getUserInfo } from '../utils/user';
  import { resolveImage } from '../utils/resource';
  import buildURL from 'axios/lib/helpers/buildURL';
  const defaultNoBody = resolveImage(require('../statics/images/defaultNothingx2.png'));
  const defaultAvatar = resolveImage(require('../statics/images/defaultAvatarx2.png'));
  const Comments = {
    components: {
      BackIcon
    },
    data: () => ({
      max_id: 0,
      comments: [],
      ids: [],
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      isWeiXin: TS_WEB.isWeiXin,
      formated: [],
      openId: -1,
      commentsContent: '',
      placeholder: '',
      commentLoading: false,
      limit: 20
    }),
    methods: {
      sendComment() {
        if(!this.commentCount || this.loading) return;
        this.loading = true;
        let source = this.comments[this.openId];
        // 评论来源
        let api = `feeds/${source.commentable_id}/comments`;
        if(source.commentable_type === 'news') {
          api = `news/${source.commentable_id}/comment`;
        } else if (source.commentable_type === 'questions') {
          api = `questions/${source.commentable_id}/comments`
        } else if (source.commentable_type === 'question-answers') {
          api = `question-answers/${source.commentable_id}/comments`;
        }
        
        let comment_data = {
          body: this.commentsContent
        };

        if(source.user_id) {
          comment_data.reply_user = source.user_id
        }

        addAccessToken().post(createAPI(`${api}`),
          comment_data,
        {
          validateStatus: status => status === 201
        })
        .then( () => {
          this.commentsContent = '';
          this.loading = false;
          this.closeCommentBox();
          this.$Message.success('评论成功');
        })
        .catch(({ response: { data } = {} }) => {
          this.$Message.error(this.$MessageBundle(data).getMessage());
        });
      },
      openCommentBox (id, type, commentable_id, name) {
        this.openId = id;

        this.placeholder = `回复: ${name}`;
      },
      closeCommentBox () {
        this.openId = -1;
        this.commentsContent = '';
        this.placeholder = '';
      },
      changeUrl,
      goTo,
      loadTop () {
        const { limit } = this;
        addAccessToken().get(createAPI(`user/comments`),
        {
          params: {
            limit
          }
        },
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          let comments = data;
          let newcomments = [];

          let uids = data.map( comment => {
            return [comment.user_id, comment.target_user, comment.reply_user];
          });

          this.$store.dispatch('GET_USER_BY_ID', uids);

          comments.forEach( comment => {
            if( this.ids.findIndex(function(value, index, arr) {
              return value == comment.id;
            }) == -1) {
              newcomments.push(comment);
            }
          });
          this._loadTopFormatedComments(newcomments);
          setTimeout( () => {
            if(this.$refs.loadmoreComments)
              this.$refs.loadmoreComments.onTopLoaded();
          }, 500)
        })
      },
      bottomStatusChange(status) {
        this.bottomStatus = status;
      },

      loadBottom () {
        const { limit, bottomAllLoaded, max_id } = this;
        if(bottomAllLoaded) {
          this.$refs.loadmoreComments.onBottomLoaded();

          return;
        }
        if(!max_id) return;

        addAccessToken().get(createAPI(`user/comments`),
          {
            params: {
              limit,
              after: max_id
            }
          },
          {
            validateStatus: status => status === 200
          }
        )
        .then(({data = []}) => {
          let comments = data;
          let uids = data.map( comment => {
            return [comment.user_id, comment.target_user, comment.reply_user];
          });

          this.$store.dispatch('GET_USER_BY_ID', uids);

          let length = comments.length;
          if(length === limit) {
            this.bottomAllLoaded = false;
          } else {
            this.bottomAllLoaded = true;
          }
          this.max_id = comments[length -1].id;
          
          if(this.$refs.loadmoreComments)
            this.$refs.loadmoreComments.onBottomLoaded();
          this._loadTopFormatedComments(comments, false);
        })
      },

      getFile (str) {
        if(!str) return 0;
        let file = str.match(/@!\[.*?]\((\d+)\)/);
        return file ? buildURL(createAPI(`files/${file[1]}`), {w: 100, h: 100}) : 0;
      },

      _initFormatedComments () {
        let comments = this.comments, com = {};

        comments.forEach(comment => {
          if (!comment.commentable) return;
          let user= this.$store.getters.getUserById(comment.user_id)[0];

          const { commentable: { images = [], body = '', subject='', feed_content = '', content = ''  } = {} } = comment;

          if(comment.reply_user) {
            let replyUser = this.$store.getters.getUserById(comment.reply_user)[0];
            com.replyUser = { ...replyUser };
          }

          const { name = '' } = user;
          if (comment.commentable_type == 'questions' || comment.commentable_type == 'question-answers') {
            let img = this.getFile(body);
            console.log(img);
            if (img) {
              com.cover = img;
            } else {
              com.source_content = comment.commentable_type == 'questions' ? subject : '回答回答';
            }
          } else {
            if(images.length > 0) {
              com.cover = buildURL(createAPI(`files/${images[0].id}`), {w: 100, h: 100});
            } else if(content || feed_content){
              com.source_content = content || feed_content;
            }
          }
          com.user_id = comment.user_id;
          com.commentable_id = comment.commentable_id;
          com.body = comment.body
          com.id = comment.id;
          com.name = name;
          com.avatar = comment.avatar;
          com.commentable = comment.commentable_type;
          com.time = timers(comment.created_at, 8, false);
          this.formated = lodash.uniq([...this.formated, com], 'id');
          com = {};
        })
      },

      _loadTopFormatedComments (comments = [], top = true) {
        let com = {};
        comments.forEach(comment => {
          if (!comment.commentable) return;
          // 去重
          if(lodash.findIndex(this.formated, { id: comment.id }) !== -1) return;

          const { commentable: { images = [], body = '', subject='', feed_content = '', content = ''  } = {} } = comment;
          let user = this.$store.getters.getUserById(comment.user_id)[0];

          if(comment.reply_user) {
            let replyUser = this.$store.getters.getUserById(comment.reply_user)[0];
            com.replyUser = { ...replyUser };
          }

          const { name = '' } = user;

          if (comment.commentable_type == 'questions' || comment.commentable_type == 'question-answers') {
            let img = this.getFile(body);
            if (img) {
              com.cover = img;
            } else {
              com.source_content = comment.commentable_type == 'questions' ? subject : '回答回答';
            }
          } else {
            if(images.length > 0) {
              com.cover = buildURL(createAPI(`files/${images[0].id}`), {w: 100, h: 100});
            } else if(content || feed_content){
              com.source_content = content || feed_content;
            }
          }
          com.user_id = comment.user_id;
          com.commentable_id = comment.commentable_id;
          com.body = comment.body;
          com.name = name;
          com.commentable = comment.commentable_type;
          com.avatar = comment.avatar;
          com.time = timers(comment.created_at, 8, false);
          if( top ) {
            this.formated = [ com, ...this.formated ];
          } else {
            this.formated = [ ...this.formated, com ];
          }
          com = {};
        });
      }
    },
    computed: {
      nothing () {
        return this.comments.length > 0 ? 0 : defaultNoBody;
      },
      commentCount () {
        return this.commentsContent.length > 0;
      }
    },
    created () {
      const { limit } = this;

      // 清空未读评论消息数量
      this.$store.dispatch(CLEANMESSAGE, cb => {
        cb('comments');
      });

      addAccessToken().get(createAPI(`user/comments`),
      {
        params: {
          limit
        }
      },
        {
          validateStatus: status => status === 200
        }
      )
      .then(({data = []}) => {

        this.comments = data;
        const { length } = data;

        let uids = data.map( comment => {
          return lodash.compact([comment.user_id, comment.target_user, comment.reply_user]);
        });

        this.$store.dispatch('GET_USER_BY_ID', lodash.uniq(lodash.flatten(uids, true)));

        window.TS_WEB.dataBase.transaction('rw?',
          window.TS_WEB.dataBase.commentslist,
          () => {
            this.comments.forEach( comment => {
              this.ids.push(comment.id);
              window.TS_WEB.dataBase.commentslist.where('[user_id+uid]').equals([window.TS_WEB.currentUserId, comment.user_id]).delete().then( () => {
                window.TS_WEB.dataBase.commentslist.put({
                  user_id: window.TS_WEB.currentUserId,
                  uid: comment.user_id
                })
              })
              .catch( e => {
                console.log(e)
              });
            });
          }
        );

        if(length === limit) {
          this.bottomAllLoaded = false;
        } else  {
          this.bottomAllLoaded = true;
        }

        if(length)
          this.max_id = this.comments[length - 1].id;
          this._initFormatedComments();
      })
    }
  };
  export default Comments;
</script>
<style lang="less" module>
  .comments {
    .comment {
      border-bottom: 1px #ededed solid;
      padding: 8px;
      background-color: #fff;
      display: block;
      &:last-child {
        border-bottom: none;
      }
      .commentContent {
        display: flex;
        align-items: flex-start;
      }
      .commentBox {
        li {
          margin-top: 8px;
        }
        .commentOperations {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .commentOperation {
            margin: 0 8px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
  .sourceContent {
    background-color: #ededed;
    padding: 2px;
    position: relative;
    height: 100%;
    &:before {
      content: '';
      display: block;
      padding-top: 100%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      object-fit: cover;
      right: 0;
      bottom: 0;
      height: 100%;
    }
    .source {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 10px;
      .content {
        padding: 4px;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        word-break: break-all;
        display: -webkit-box;
      }
    }
  }
</style>
<style scoped>
  .gray-color {
    word-break: break-all;
  }
  .comments {
    position: relative;
    height: 100%;
  }
  .row-container {
    align-items: flex-start;
  }
  .mint-loadmore {
    padding-bottom: 50px;
    overflow: initial;
  }
</style>