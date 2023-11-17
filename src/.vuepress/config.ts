import { defineUserConfig } from "vuepress";
import { getDirname, path } from "@vuepress/utils";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { pwaPlugin } from "vuepress-plugin-pwa2";
import { seoPlugin } from "vuepress-plugin-seo2";
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Redrum",
  description: "王凌岳的博客",

  theme,
  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
      __dirname,
      "./components/BlogHero.vue",
    ),
  },
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 自动搜索建议
      autoSuggestions: false,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page: any) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page: any) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
    pwaPlugin({
      manifest: {
        name: "Redrum",
        short_name: "Redrum",
        description: "王凌岳的博客",
        theme_color: '#7071E8',
      },
      favicon: 'https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/202311171451333.png',
      themeColor: '#7071E8',
    }),
      seoPlugin({
        // 你的选项
        hostname: 'https://comradewong.github.io'
    }),
  ],
  // Enable it with pwa
  shouldPrefetch: false,
});
