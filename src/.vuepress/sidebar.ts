import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    // {
    //   text: "文章",
    //   icon: "book",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    // "intro",
    // "slides",
  ],
  '/life/': [
    {
      text: "生活",
      icon: "book",
      // prefix: "life/",
      children: "structure",
    },
  ],
  "/code/": 'structure'
});
