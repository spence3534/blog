module.exports = {
  title:'xiaoLi的博客',
  description: 'Hello, welcome to xiaoLi blog',
  base:'/',
  dest: './dist',
  head: [
    ['link',{rel: 'icon', href: '/image/login.jpg'}]
  ],
  themeConfig:{
    nav:[
      {
        text: '主页',
        link:'/'
      },
      {
        text: 'JavaScript',
        link: '/javascript/'
      }
    ],
    sidebar:{
      '/javascript/': [
        {
          title: 'javascript基础',
          collapsable: false,
          children: [
            'Chapter3',
            'Chapter4',
            'Chapter5',
            'Chapter6'
          ]
        }
      ],
      sidebarDepth: 0,
    }
  }
}