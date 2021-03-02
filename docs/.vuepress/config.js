module.exports = {
  title: "写前端的图图",
  description: "Hello, welcome to 写前端的图图 blog",
  base: "/",
  dest: "./dist",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/image/login.jpg",
      },
    ],
  ],
  themeConfig: {
    nav: [
      {
        text: "主页",
        link: "/",
      },
      {
        text: "JavaScript",
        link: "/javascript/",
      },
      {
        text: "ECMAScript6",
        link: "/es6/",
      },
      {
        text: "数据结构与算法",
        link: "/DataStructures-Algorithms/",
      },
    ],
    sidebarDepth: 4,
    sidebar: {
      "/javascript/": [
        {
          title: "JavaScript",
          collapsable: false,
          children: [
            "Chapter3",
            "Chapter4",
            "Chapter5",
            "Chapter6",
            "Chapter7",
            "Chapter8",
            "Chapter10",
            "Chapter11",
            "Chapter12",
            "Chapter13",
            "Chapter14",
            "Chapter15",
            "Chapter16",
            "Chapter20",
            "Chapter21",
            "Chapter22",
          ],
        },
      ],
      "/es6/": [
        {
          title: "ECMAScript6",
          collapsable: false,
          children: [
            "chapter2",
            "chapter3",
            "chapter4",
            "chapter6",
            "chapter7",
            "chapter8",
            "chapter9",
            "chapter10",
            "chapter11",
            "chapter12",
            "chapter13",
            "chapter14",
            "chapter15",
            "chapter16",
            "chapter17",
            "chapter18",
            "chapter19",
            "chapter20",
          ],
        },
      ],
      "/DataStructures-Algorithms/": [
        {
          title: "数据结构与算法",
          collapsable: false,
          children: [
            "chapter3",
            "chapter4",
            "chapter5",
            "chapter6",
            "chapter7",
            "chapter8",
          ],
        },
      ],
      sidebarDepth: 3,
    },
  },
};
