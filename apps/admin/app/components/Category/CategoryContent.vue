<template>
  <div class="app-container">
    <el-form
      ref="formRef"
      v-loading="fetchLoading"
      :model="formData"
      :rules="rules"
      label-position="left"
      label-width="100px"
      class="form-container is-stick"
    >
      <el-form-item class="form-title"> 基本信息 </el-form-item>
      <el-form-item label="栏目名称" prop="name">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.name" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择栏目类型">
          <el-option
            v-for="(value, key) in typeOptions"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="URL别名" prop="filename">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input
              v-model="formData.filename"
              placeholder="栏目 URL 别名（slug），如 web-dev；留空则用栏目 id"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <template v-if="!isEdit">
        <el-form-item label="所属栏目">
          <el-cascader
            v-model="formData.column"
            :options="categoryOptions"
            :props="{ checkStrictly: true }"
            placeholder="请选择栏目"
            clearable
          />
        </el-form-item>
      </template>
      <el-form-item label="栏目排序">
        <el-input-number
          v-model="formData.no_order"
          controls-position="right"
          :min="0"
        />
        <span class="form-container-tips">数值越小越靠前</span>
      </el-form-item>
      <el-form-item label="导航栏显示">
        <el-radio-group v-model="formData.is_nav">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="前台显示">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-title"> SEO信息 </el-form-item>
      <el-form-item label="栏目标题">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.title" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="关键词">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.keywords" type="textarea" :rows="3" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="简短描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="5"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <div class="form-item">
        <EditorTinymce
          ref="editorRef"
          v-model="formData.content"
          :height="600"
        />
      </div>
      <el-form-item class="form-title"> 其它设置 </el-form-item>
      <el-form-item label="栏目修饰名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.mark_name" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目图标">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.icon" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目版本">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.version" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目外链">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.link" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目参数">
        <JsonEditor v-model="formData.params" />
      </el-form-item>
      <div class="stick-bottom">
        <el-button type="primary" plain @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="handleSubmit"
          >保存</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { getCategoryByType } from "~/utils";
import { typeOptions } from "~/config/modules";

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
const listStore = useListStore();
const tagsViewStore = useTagsViewStore();

const formRef = ref<FormInstance | null>(null);
const formData = reactive<Record<string, any>>({
  params: {},
  is_show: 1,
  is_nav: 1,
  no_order: 1,
});
const fetchLoading = ref(false);
const confirmLoading = ref(false);

const rules: FormRules = {
  name: [{ required: true, message: "请输入栏目名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择栏目类型", trigger: "change" }],
  filename: [
    {
      pattern: /^[a-z0-9-]{1,80}$/,
      message: "URL别名仅支持小写字母、数字和短横线，长度1-80",
      trigger: "blur",
    },
  ],
};

const categoryOptions = computed(() =>
  getCategoryByType(
    listStore.category as any,
    (route.query.type as string) || "",
  ),
);

async function fetchData(id: string | number) {
  fetchLoading.value = true;
  try {
    const res: any = await api.GetContent("category", id);
    Object.assign(formData, res.data);
    try {
      formData.params = res.data.params ? JSON.parse(res.data.params) : {};
    } catch {}
  } catch {}
  fetchLoading.value = false;
}

function handleSubmit() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    confirmLoading.value = true;
    const submitHandler = props.isEdit ? api.UpdateContent : api.CreateContent;
    try {
      await submitHandler("category", formData);
      ElMessage.success(props.isEdit ? "更新栏目成功" : "添加栏目成功");
      listStore.setUpdateRoute("category");
      handleCancel();
    } catch {
      ElMessage.error(props.isEdit ? "更新栏目失败" : "添加栏目失败");
    }
    confirmLoading.value = false;
  });
}

async function handleCancel() {
  await tagsViewStore.delView({
    path: route.path,
    fullPath: route.fullPath,
    name: route.name as string,
  });
  router.push("/category");
}

onMounted(() => {
  if (props.isEdit) {
    const id = route.params.id as string;
    formData.id = Number(id);
    fetchData(id);
  } else {
    formData.column = route.query.parentId ? Number(route.query.parentId) : 0;
    if (route.query.type) formData.type = route.query.type;
  }
});
</script>

<style lang="scss" scoped>
.form-container-tips {
  margin-left: 15px;
}
</style>
