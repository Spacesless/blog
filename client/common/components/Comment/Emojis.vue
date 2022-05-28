<template>
  <el-popover
    v-model="visible"
    placement="top-start"
    width="360"
    trigger="click"
  >
    <div class="emojis">
      <ul class="emojis-list">
        <li v-for="item in currentEmoji.items" :key="item" class="emojis-list-item" @click="handleSelectEmojis(item)">
          <el-image
            class="emojis-list-item__icon"
            :src="`${currentEmoji.url}/${currentEmoji.prefix + item}.${currentEmoji.type}`"
            :alt="item"
            lazy
          />
        </li>
      </ul>
      <div class="emojis-tabs">
        <span
          v-for="(tab, index) in emojis"
          :key="index"
          class="emojis-tabs-item"
          :class="{'emojis-tabs-item--active': activeKey === index}"
          @click="activeKey = index"
        >{{ tab.name }}</span>
      </div>
    </div>
    <svg slot="reference" class="reply-toolbar__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16172" width="22" height="22">
      <path d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512zM512 56.888889a455.111111 455.111111 0 1 0 455.111111 455.111111 455.111111 455.111111 0 0 0-455.111111-455.111111zM312.888889 512A85.333333 85.333333 0 1 1 398.222222 426.666667 85.333333 85.333333 0 0 1 312.888889 512z" p-id="16173" />
      <path d="M512 768A142.222222 142.222222 0 0 1 369.777778 625.777778a28.444444 28.444444 0 0 1 56.888889 0 85.333333 85.333333 0 0 0 170.666666 0 28.444444 28.444444 0 0 1 56.888889 0A142.222222 142.222222 0 0 1 512 768z" p-id="16174" />
      <path d="M782.222222 391.964444l-113.777778 59.733334a29.013333 29.013333 0 0 1-38.684444-10.808889 28.444444 28.444444 0 0 1 10.24-38.684445l113.777778-56.888888a28.444444 28.444444 0 0 1 38.684444 10.24 28.444444 28.444444 0 0 1-10.24 36.408888z" p-id="16175" />
      <path d="M640.568889 451.697778l113.777778 56.888889a27.875556 27.875556 0 0 0 38.684444-10.24 27.875556 27.875556 0 0 0-10.24-38.684445l-113.777778-56.888889a28.444444 28.444444 0 0 0-38.684444 10.808889 28.444444 28.444444 0 0 0 10.24 38.115556z" p-id="16176" />
    </svg>
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      activeKey: -1,
      emojis: [
        {
          'name': 'QQ',
          'url': 'https://cos.timelessq.com/static/emojis/qq',
          'prefix': 'qq_',
          'type': 'gif',
          'icon': 'grin',
          'items': [
            'smile', 'mouth_squirm', 'heart_eyes', 'flushed', 'sunglasses', 'sob', 'shy', 'silent', 'sleep', 'cry', 'awkward', 'rage', 'yum', 'grin', 'confounded', 'sad', 'cool', 'cold_sweat', 'crazy', 'vomit', 'chuckle', 'lovely', 'rolling_eyes', 'arrogant', 'yummy', 'sleepy', 'scared', 'sweat', 'laugh', 'solder', 'fighting', 'scold', 'shush', 'dizzy_face', 'mad', 'feeble', 'skull', 'knock', 'bye', 'pick_nose', 'clap', 'embarassed', 'snigger', 'annoyed_left', 'annoyed_right', 'yawn', 'look_down', 'grievance', 'pensive', 'smirk', 'kiss_right', 'kiss', 'fearful', 'poor', 'wink', 'joy', 'doge', 'cover_face_cry', 'whatever', 'lift_check', 'cute', 'antic', 'vomit_blood', 'surprised', 'pock_face', 'tangled', 'pretty', 'mask_fighting', 'mask_hug', 'mask', 'working', 'busy', 'headache', 'worry', 'cover_face', 'burning_eyes', 'wowyo', 'hair_loss', 'question_mask', 'peep', 'emm', 'waterlemon_face', 'rolling_face', 'hug', 'doubt', 'sweat1', 'white-yum', 'white1', 'white2', 'white_kiss', 'white_shit', 'white_slap', 'white_sunglasses', 'white_thumbsup', 'bear1', 'bear2', 'bear3', 'bear4', 'bear5', 'bird1', 'bird2', 'bird3', 'bird4', 'heart', 'rose', 'rose_dead', 'ghost', 'anger', 'lip', 'broken_heart', 'coffee', 'alpaca', 'hongbao', 'firecracker', 'lantern', 'xi', 'thumbsup', 'ok', 'hold_fist', 'hand_shake', 'come', 'v', 'fist', 'diss', 'thumbsdown', 'metal', 'no', 'lemon_face', 'moon', 'sun', 'pig', 'knife', 'hocho', 'gun', 'tea', 'shit', 'tada', 'candy', 'watermelon', 'rice', 'feeding_bottle', 'beer', 'karaoke', 'cake', 'egg', 'bomb', 'dollar', 'light', 'gift', 'flower', 'plane', 'candle', 'ladybug', 'pill', 'basketball', 'pingpong', 'soccer', 'panda', 'pinwheel', 'ramen', 'umbrella', 'banana', 'toilet_paper', 'bag', 'fa', 'handsome', 'mail', 'balloon', 'board', 'bow', 'boy1', 'boy2', 'bulb', 'car', 'clock', 'cloudy', 'crab', 'example', 'frog', 'rain', 'ring', 'sofa', 'train_body', 'train_tail', 'tran_head', '1', '10', '11', '2', '3', '4', '5', '6', '7', '8', '9', 'surrender', 'taiji_boy', 'taiji_girl'
          ]
        },
        {
          'name': 'BiliBili',
          'url': 'https://cos.timelessq.com/static/emojis/bilibili',
          'prefix': 'bb_',
          'type': 'png',
          'icon': 'cute',
          'items': [
            'doge', 'sob', 'heart_eyes', 'cry', 'sad', 'smirk', 'sweat', 'antic', 'miantian', 'spit_blodd', 'tiaokan', 'zhoumei', 'bye', 'clap', 'confused', 'crazy', 'cute', 'money', 'rage', 'scared', 'shy', 'think', 'vomit', 'sleepy', 'flushed', 'kiss', 'rolling_eyes', 'thumbsup', 'yum', 'yum1', 'lovely', 'sunglasses', 'pick_nose', 'annoyed', 'awkward', 'grievance', 'no_mouth', 'slap', 'slient', 'sleep', 'greddy', 'chuckle', 'nosebleed', 'not_care', 'trollface', 'face_cry', 'look_down', 'mask', 'dizzy_face', 'test', 'question_mask'
          ]
        },
        {
          'name': '微博',
          'url': 'https://cos.timelessq.com/static/emojis/weibo',
          'prefix': 'weibo_',
          'type': 'png',
          'icon': 'doge',
          'items': [
            'smile', 'lovely', 'blush', 'grin', 'laugh', 'joy', 'angry', 'bye', 'hammer', 'kiss', 'love', 'mask', 'money', 'quiet', 'rage', 'sad', 'shy', 'sick', 'slient', 'smirk', 'slap', 'antic', 'desire', 'longing', 'no_idea', 'look_down', 'clap', 'yum', 'sleep', 'dizzy_face', 'chuckle', 'disappointed', 'flushed', 'heart_eyes', 'no', 'shuai', 'suprised', 'think', 'vomit', 'scream', 'sleepy', 'sob', 'sunglasses', 'greddy', 'pick_nose', 'annoyed', 'awkward', 'confused', 'grievance', 'poor', 'wink', 'rolling_eyes', 'watermalon', 'annoyed_left', 'annoyed_right', 'yawn', 'hufen', 'doge', 'husky', 'dog_annoyed', 'dog_bye', 'dog_consider', 'dog_cry', 'dog_joy', 'dog_laugh', 'dog_sweat', 'dog_think', 'dog_yum', 'cat', 'cat_annoyed', 'cat_bye', 'cat_cry', 'cat_think', 'girl_annoyed', 'boy', 'girl', 'panda', 'pig', 'rabbit', 'ultraman', 'wool_group', 'yan', 'xi', 'soap', 'meng', 'jiong', 'geili', 'shenma', 'alpaca'
          ]
        },
        {
          'name': 'Alus',
          'url': 'https://cos.timelessq.com/static/emojis/alus',
          'prefix': 'alus_',
          'type': 'png',
          'icon': 'happy',
          'items': [
            'happy', 'satisfied', 'unhappy', 'rage', 'shy', 'blush', 'kiss', 'clap', 'embarrassed', 'expect', 'die', 'helpless', 'wise', 'observe', 'ponder', 'silent', 'stare', 'surrender', 'sweat', 'think', 'vomit', 'wait', 'shit', 'smoke', 'grass', 'rich', 'dark', 'bystand', 'expressionless', 'grin', 'hide', 'persevere', 'unamused', 'slap', 'gunshot', 'wound', 'injured', 'knockdown', 'candle', 'flower', 'cucumber', 'high_five', 'huge_sweat', 'observe_dark', 'small_eye', 'smirk', 'astonished', 'sunglasses', 'sweat_smile', 'sob', 'fu', 'thumbsup', 'yum', 'hocho', 'greddy', 'pick_nose', 'awkward', 'vomit_blood', 'vomit_water', 'whatever'
          ]
        }
      ]
    }
  },
  computed: {
    currentEmoji() {
      return this.emojis[this.activeKey] || []
    }
  },
  watch: {
    visible(isShow) {
      if (isShow && this.activeKey < 0) {
        this.activeKey = 0
      }
    }
  },
  methods: {
    /**
     * 选择表情
     * @param {String} emojis 表情名称
     */
    handleSelectEmojis(emojis) {
      this.visible = false
      const { prefix } = this.currentEmoji
      this.$emit('selectEmojis', prefix + emojis)
    }
  }
}
</script>

<style lang="scss" scoped>
.emojis{
  &-list{
    overflow-y: auto;
    height: 300px;
    &-item{
      float: left;
      width: 30px;
      height: 30px;
      padding: 2px;
      margin: 2px;
      cursor: pointer;
      border-radius: 4px;
      &:hover{
        background-color: #EBEEF5;
      }
      &__icon{
        width: 100%;
        height: 100%;
      }
    }
  }
  &-tabs{
    line-height: 40px;
    &-item{
      padding: 0 10px;
      cursor: pointer;
      &--active{
        background-color: #EBEEF5;
        color: var(--color-primary);
      }
    }
  }
}
</style>
