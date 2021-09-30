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
          <img
            class="emojis-list-item__icon"
            :src="`${currentEmoji.url}/${currentEmoji.prefix + item}.${currentEmoji.type}`"
            :alt="item"
          >
        </li>
      </ul>
      <div class="emojis-tabs">
        <span
          v-for="(tab, index) in emoji"
          :key="index"
          class="emojis-tabs-item"
          :class="{'emojis-tabs-item--active': activeKey === index}"
          @click="activeKey = index"
        >{{ tab.name }}</span>
      </div>
    </div>
    <span slot="reference" class="el-icon-user" />
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      activeKey: 0,
      emoji: [
        {
          'name': 'QQ',
          'url': 'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/qq',
          'prefix': 'qq_',
          'type': 'gif',
          'icon': 'grin',
          'items': [
            'smile', 'mouth_squirm', 'heart_eyes', 'flushed', 'sunglasses', 'sob', 'shy', 'silent', 'sleep', 'cry', 'awkward', 'rage', 'yum',
            'grin', 'confounded', 'sad', 'cool', 'cold_sweat', 'crazy', 'vomit', 'chuckle', 'lovely', 'rolling_eyes', 'arrogant', 'yummy',
            'sleepy', 'scared', 'sweat', 'laugh', 'solder', 'fighting', 'scold', 'shush', 'dizzy_face', 'mad', 'feeble', 'skull', 'knock',
            'bye', 'pick_nose', 'clap', 'embarassed', 'snigger', 'annoyed_left', 'annoyed_right', 'yawn', 'look_down', 'grievance',
            'pensive', 'smirk', 'kiss_right', 'kiss', 'fearful', 'poor', 'wink', 'joy', 'doge', 'cover_face_cry', 'whatever', 'lift_check',
            'cute', 'antic', 'vomit_blood', 'surprised', 'pock_face', 'tangled', 'pretty', 'mask_fighting', 'mask_hug', 'mask', 'working',
            'busy', 'headache', 'worry', 'cover_face', 'burning_eyes', 'wowyo', 'hair_loss', 'question_mask', 'peep', 'emm', 'waterlemon_face',
            'rolling_face', 'hug', 'doubt', 'sweat1', 'white-yum', 'white1', 'white2', 'white_kiss', 'white_shit', 'white_slap',
            'white_sunglasses', 'white_thumbsup', 'bear1', 'bear2', 'bear3', 'bear4', 'bear5', 'bird1', 'bird2', 'bird3', 'bird4', 'heart',
            'rose', 'rose_dead', 'ghost', 'anger', 'lip', 'broken_heart', 'coffee', 'alpaca', 'hongbao', 'firecracker', 'lantern', 'xi',
            'thumbsup', 'ok', 'hold_fist', 'hand_shake', 'come', 'v', 'fist', 'diss', 'thumbsdown', 'metal', 'no', 'lemon_face', 'moon',
            'sun', 'pig', 'knife', 'hocho', 'gun', 'tea', 'shit', 'tada', 'candy', 'watermelon', 'rice', 'feeding_bottle', 'beer', 'karaoke',
            'cake', 'egg', 'bomb', 'dollar', 'light', 'gift', 'flower', 'plane', 'candle', 'ladybug', 'pill', 'basketball', 'pingpong', 'soccer',
            'panda', 'pinwheel', 'ramen', 'umbrella', 'banana', 'toilet_paper', 'bag', 'fa', 'handsome', 'mail', 'balloon', 'board', 'bow',
            'boy1', 'boy2', 'bulb', 'car', 'clock', 'cloudy', 'crab', 'example', 'frog', 'rain', 'ring', 'sofa', 'train_body', 'train_tail',
            'tran_head', '1', '10', '11', '2', '3', '4', '5', '6', '7', '8', '9', 'surrender', 'taiji_boy', 'taiji_girl'
          ]
        },
        {
          'name': 'BiliBili',
          'url': 'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/bilibili',
          'prefix': 'bb_',
          'type': 'png',
          'icon': 'cute',
          'items': [
            'doge', 'sob', 'heart_eyes', 'cry', 'sad', 'smirk', 'sweat', 'antic', 'miantian', 'spit_blodd', 'tiaokan', 'zhoumei', 'bye', 'clap',
            'confused', 'crazy', 'cute', 'money', 'rage', 'scared', 'shy', 'think', 'vomit', 'sleepy', 'flushed', 'kiss', 'rolling_eyes',
            'thumbsup', 'yum', 'yum1', 'lovely', 'sunglasses', 'pick_nose', 'annoyed', 'awkward', 'grievance', 'no_mouth', 'slap', 'slient',
            'sleep', 'greddy', 'chuckle', 'nosebleed', 'not_care', 'trollface', 'face_cry', 'look_down', 'mask', 'dizzy_face', 'test',
            'question_mask'
          ]
        },
        {
          'name': '微博',
          'url': 'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/weibo',
          'prefix': 'weibo_',
          'type': 'png',
          'icon': 'doge',
          'items': [
            'smile', 'lovely', 'blush', 'grin', 'laugh', 'joy', 'angry', 'bye', 'hammer', 'kiss', 'love', 'mask', 'money', 'quiet', 'rage',
            'sad', 'shy', 'sick', 'slient', 'smirk', 'slap', 'antic', 'desire', 'longing', 'no_idea', 'look_down', 'clap', 'yum', 'sleep',
            'dizzy_face', 'chuckle', 'disappointed', 'flushed', 'heart_eyes', 'no', 'shuai', 'suprised', 'think', 'vomit', 'scream',
            'sleepy', 'sob', 'sunglasses', 'greddy', 'pick_nose', 'annoyed', 'awkward', 'confused', 'grievance', 'poor', 'wink',
            'rolling_eyes', 'watermalon', 'annoyed_left', 'annoyed_right', 'yawn', 'hufen', 'doge', 'husky', 'dog_annoyed', 'dog_bye',
            'dog_consider', 'dog_cry', 'dog_joy', 'dog_laugh', 'dog_sweat', 'dog_think', 'dog_yum', 'cat', 'cat_annoyed', 'cat_bye',
            'cat_cry', 'cat_think', 'girl_annoyed', 'boy', 'girl', 'panda', 'pig', 'rabbit', 'ultraman', 'wool_group', 'yan', 'xi',
            'soap', 'meng', 'jiong', 'geili', 'shenma', 'alpaca'
          ]
        },
        {
          'name': 'Alus',
          'url': 'https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/alus',
          'prefix': 'alus_',
          'type': 'png',
          'icon': 'happy',
          'items': [
            'happy', 'satisfied', 'unhappy', 'rage', 'shy', 'blush', 'kiss', 'clap', 'embarrassed', 'expect', 'die', 'helpless', 'wise',
            'observe', 'ponder', 'silent', 'stare', 'surrender', 'sweat', 'think', 'vomit', 'wait', 'shit', 'smoke', 'grass', 'rich', 'dark',
            'bystand', 'expressionless', 'grin', 'hide', 'persevere', 'unamused', 'slap', 'gunshot', 'wound', 'injured', 'knockdown', 'candle',
            'flower', 'cucumber', 'high_five', 'huge_sweat', 'observe_dark', 'small_eye', 'smirk', 'astonished', 'sunglasses', 'sweat_smile',
            'sob', 'fu', 'thumbsup', 'yum', 'hocho', 'greddy', 'pick_nose', 'awkward', 'vomit_blood', 'vomit_water', 'whatever'
          ]
        }
      ]
    }
  },
  computed: {
    currentEmoji() {
      return this.emoji[this.activeKey] || []
    }
  },
  methods: {
    handleSelectEmojis(emojis) {
      this.visible = false
      const { url, prefix, type } = this.currentEmoji
      const emojiUrl = `${url}/${prefix + emojis}.${type}`
      this.$emit('selectEmoji', emojiUrl)
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
