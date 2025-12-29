
var routes = [
	{
		path: '/',
		componentUrl: './pages/welcome.f7',
		options:{
			animate:false
		}
	},{
		path: '/welcome/',
		componentUrl: './pages/welcome.f7',
		options:{
			animate:false
		}
	},{
		path: '/blog/',
		componentUrl: './pages/blog.f7',
		options:{
			animate:false
		}
	},{
		path: '/shop/',
		componentUrl: './pages/shop.f7',
		options:{
			animate:false
		}
	},{
		path: '/bookmarks/',
		componentUrl: './pages/bookmarks.f7',
		options:{
			animate:false
		}
	},
	{
		path: '(.*)',
		url: './pages/404.html',
	},
];
