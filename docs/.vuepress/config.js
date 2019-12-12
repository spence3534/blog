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
          title: 'JavaScript',
          collapsable: false,
          children: [
            'Chapter3',
            'Chapter4',
            'Chapter5',
            'Chapter6',
            'Chapter7',
            'Chapter8',
            'Chapter10',
            'Chapter11',
            'Chapter12',
            'Chapter13'
          ]
        }
      ],
      sidebarDepth: 0,
    }
  }
}