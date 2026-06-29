import type {
  Article,
  Bangumi,
  Banner,
  FriendLink,
  Category,
  SiteConfig,
  Tool,
  PaginatedResponse,
  ApiResponse,
} from "~/types";

/**
 * 后端 API 封装
 * 适配原 /front 接口，响应结构 { errno, errmsg, data }
 */
export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase as string;

  // 统一请求：剥离 errno 包装
  async function request<T>(
    url: string,
    options: { params?: Record<string, any>; method?: any } = {},
  ): Promise<T> {
    const res = await $fetch<ApiResponse<T>>(url, {
      baseURL,
      method: options.method || "GET",
      params: options.params,
    });
    if (res && typeof res === "object" && "errno" in res) {
      if (res.errno === 0) {
        return res.data as T;
      }
      throw new Error(res.errmsg || "请求错误");
    }
    return res as unknown as T;
  }

  // 站点初始化（菜单 + 网站配置）
  async function fetchGeneral(): Promise<{
    categories: Category[];
    configs: SiteConfig;
  }> {
    return request<{ categories: Category[]; configs: SiteConfig }>("/general");
  }

  // 首页聚合数据
  async function fetchIndex(): Promise<{
    bannerList: Banner[];
    articleList: Article[];
    bangumiList: Bangumi[];
  }> {
    return request("/index");
  }

  // 文章列表
  async function fetchArticles(options?: {
    id?: number | string | null;
    page?: number;
    sortBy?: string;
    orderBy?: string;
    tags?: string;
  }): Promise<PaginatedResponse<Article>> {
    return request<PaginatedResponse<Article>>("/article/list", {
      params: options,
    });
  }

  // 文章详情
  async function fetchArticleDetail(id: number | string): Promise<Article> {
    return request<Article>("/article/detail", { params: { id } });
  }

  // 文章访问量记录
  async function recordArticleAccess(id: number | string): Promise<void> {
    await request("/article/access", { params: { id } }).catch(() => {});
  }

  // 文章相似推荐
  async function fetchArticleSimilar(options: {
    id?: number;
    categoryId: number;
    tags?: string;
  }): Promise<Article[]> {
    return request<Article[]>("/article/same", { params: options });
  }

  // 追番列表
  async function fetchBangumiList(options?: {
    id?: number | string | null;
    page?: number;
    sortBy?: string;
    orderBy?: string;
    status?: string | number;
    progress?: string | number;
    tags?: string;
  }): Promise<PaginatedResponse<Bangumi>> {
    return request<PaginatedResponse<Bangumi>>("/bangumi/list", {
      params: options,
    });
  }

  // 追番详情
  async function fetchBangumiDetail(id: number | string): Promise<Bangumi> {
    return request<Bangumi>("/bangumi/detail", { params: { id } });
  }

  // 追番相似推荐
  async function fetchBangumiSimilar(options: {
    id?: number;
    categoryId: number;
    tags?: string;
  }): Promise<Bangumi[]> {
    return request<Bangumi[]>("/bangumi/same", { params: options });
  }

  // 归档列表
  async function fetchArchives(): Promise<Article[]> {
    return request<Article[]>("/archives/list");
  }

  // 友情链接
  async function fetchFriendLinks(): Promise<FriendLink[]> {
    return request<FriendLink[]>("/link");
  }

  // 分类详情（用于 about 等单页内容）
  async function fetchCategory(id: number | string): Promise<Category> {
    return request<Category>("/category", { params: { id } });
  }

  // 工具/附属站列表
  async function fetchTools(id: number | string): Promise<Tool[]> {
    return request<Tool[]>("/tool/list", { params: { id } });
  }

  // 站内搜索
  async function searchContent(options: {
    keyword: string;
    classify?: string;
    page?: number;
  }): Promise<
    PaginatedResponse<Article | Bangumi> & {
      data: ((Article | Bangumi) & { type: string })[];
    }
  > {
    return request("/search", { params: options });
  }

  return {
    fetchGeneral,
    fetchIndex,
    fetchArticles,
    fetchArticleDetail,
    recordArticleAccess,
    fetchArticleSimilar,
    fetchBangumiList,
    fetchBangumiDetail,
    fetchBangumiSimilar,
    fetchArchives,
    fetchFriendLinks,
    fetchCategory,
    fetchTools,
    searchContent,
  };
}
