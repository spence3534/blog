module.exports = {
  title:'会前端的图图',
  description: 'Hello, welcome to 会前端的图图 blog',
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
      },
      {
        text: 'ECMAScript6',
        link: '/es6/'
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
            'Chapter13',
            'Chapter14',
            'Chapter15',
            'Chapter16',
            'Chapter20',
            'Chapter21',
            'Chapter22'
          ]
        }
      ],
      '/es6/': [{
        title: 'ECMAScript6',
        collapsable: false,
        children: [
          'chapter2',
          'chapter3'
        ]
      }],
      sidebarDepth: 0,
    }
  }
}