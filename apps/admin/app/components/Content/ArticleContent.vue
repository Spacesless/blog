<template>
  <div class="app-container">
    <el-form
      ref="formRef"
      v-loading="fetchLoading"
      :model="formData"
      :rules="rules"
      :label-position="appStore.device === 'desktop' ? 'left' : 'top'"
      label-width="100px"
      class="form-container is-stick"
    >
      <el-form-item label="所属栏目" prop="category_id">
        <el-cascader
          v-model="formData.category_id"
          :options="categoryOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          placeholder="请选择栏目"
          clearable
        />
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="URL别名" prop="pathname">
        <el-input
          v-model="formData.pathname"
          placeholder="建议手动输入英文别名（小写字母、数字、短横线）；中文标题无法自动生成"
        />
        <el-button type="primary" plain @click="handleGenerateSlug">
          按标题生成
        </el-button>
      </el-form-item>
      <el-form-item label="封面图片">
        <Upload v-model="coverUrl" :module="currentType" />
      </el-form-item>

      <ContentBangumiParam
        v-if="currentType === 'bangumi'"
        :params="formData"
      />

      <div class="form-item">
        <EditorTinymce
          ref="editorRef"
          v-model="formData.content"
          :height="600"
        />
      </div>
      <el-form-item class="form-title"> 其它设置 </el-form-item>
      <el-form-item label="前台显示">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="1"> 显示 </el-radio>
          <el-radio :label="0"> 隐藏 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发布时间" prop="addtime">
        <el-date-picker
          v-model="formData.addtime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择发布时间"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updatetime">
        <el-date-picker
          v-model="formData.updatetime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择更新时间"
        />
      </el-form-item>
      <el-form-item v-if="isEdit" label="访问量">
        <el-input
          v-model="formData.hits"
          readonly
          class="form-container-input"
        />
      </el-form-item>
      <el-form-item class="form-title"> SEO信息 </el-form-item>
      <el-form-item label="文章关键词">
        <el-input v-model="formData.keywords" />
        <span style="margin-left: 15px">多个关键词请用"|"或","隔开。</span>
      </el-form-item>
      <el-form-item label="描述文字">
        <el-input v-model="formData.description" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="Tag标签">
        <el-tag
          v-for="tag in tags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleDeleteTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputTag"
          class="input-new-tag"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" @click="showTagInput">
          + 新标签
        </el-button>
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="warning" plain @click="handleCancel">
          <el-icon><Close /></el-icon>
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="handleSubmit"
        >
          <el-icon><Check /></el-icon>
          确定
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { Close, Check } from "@element-plus/icons-vue";
import { getCategoryByType, parseTime, slugify } from "~/utils";

const props = withDefaults(
  defineProps<{
    isEdit?: boolean;
  }>(),
  {
    isEdit: false,
  },
);

const route = useRoute();
const router = useRouter();
const api = useApi();
const appStore = useAppStore();
const userStore = useUserStore();
const listStore = useListStore();
const tagsViewStore = useTagsViewStore();

const formRef = ref<FormInstance | null>(null);
const editorRef = ref<any>(null);
const saveTagInput = ref<{ focus: () => void } | null>(null);

const formData = reactive<Record<string, any>>({});
const coverUrl = ref("");
const tags = ref<string[]>([]);
const inputVisible = ref(false);
const inputTag = ref("");
const fetchLoading = ref(false);
const confirmLoading = ref(false);

const rules: FormRules = {
  category_id: [{ required: true, message: "请选择栏目", trigger: "change" }],
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  addtime: [{ required: true, message: "请选择发布时间", trigger: "change" }],
  updatetime: [
    { required: true, message: "请选择更新时间", trigger: "change" },
  ],
  pathname: [
    {
      pattern: /^[a-z0-9-]{1,80}$/,
      message: "URL别名仅支持小写字母、数字和短横线，长度1-80",
      trigger: "blur",
    },
  ],
};

const currentType = computed(() => (route.query.type as string) || "article");
const categoryOptions = computed(() =>
  getCategoryByType(listStore.category as any, currentType.value),
);

async function fetchData(id: number | string) {
  fetchLoading.value = true;
  try {
    const res: any = await api.GetContent(currentType.value, id);
    Object.assign(formData, res.data);
    if (formData.imgurl) coverUrl.value = formData.imgurl;
    tags.value = formData.tag ? formData.tag.split("|") : [];
  } catch {}
  fetchLoading.value = false;
}

function handleDeleteTag(tag: string) {
  tags.value.splice(tags.value.indexOf(tag), 1);
}

function handleGenerateSlug() {
  if (!formData.title) {
    ElMessage.warning("请先填写标题");
    return;
  }
  const slug = slugify(formData.title);
  if (!slug) {
    ElMessage.warning("标题不包含可转换字符（如中文），请手动输入英文别名");
    return;
  }
  formData.pathname = slug;
}

function showTagInput() {
  inputVisible.value = true;
  nextTick(() => saveTagInput.value?.focus?.());
}

function handleInputConfirm() {
  if (inputTag.value) tags.value.push(inputTag.value);
  inputVisible.value = false;
  inputTag.value = "";
}

function handleSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    confirmLoading.value = true;
    const postData = {
      ...formData,
      addtime: parseTime(formData.addtime),
      updatetime: parseTime(formData.updatetime),
      imgurl: coverUrl.value,
      tag: tags.value.join("|"),
      word_count: editorRef.value?.getWordCount?.() || 0,
    };
    const submitHandler = props.isEdit ? api.UpdateContent : api.CreateContent;
    try {
      await submitHandler(currentType.value, postData);
      ElMessage.success(props.isEdit ? "更新成功" : "添加成功");
      listStore.setUpdateRoute(currentType.value);
      handleCancel();
    } catch {
      ElMessage.error(props.isEdit ? "更新失败" : "添加失败");
    }
    confirmLoading.value = false;
  });
}

async function handleCancel() {
  await tagsViewStore.delView(route);
  router.push({
    path: `/content/${currentType.value === "bangumi" ? "bangumi" : "article"}`,
  });
}

onMounted(() => {
  if (props.isEdit) {
    fetchData(route.params.id as string);
  } else {
    const initCategory = route.query.category;
    Object.assign(formData, {
      category_id: initCategory ? Number(initCategory) : 0,
      addtime: new Date(),
      updatetime: new Date(),
      is_show: 1,
      author: userStore.userinfo.nickname,
      status: 1,
      ratings: 8,
      content: "",
    });
  }
});
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  height: 32px;
  margin-left: 10px;
  line-height: 30px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
