const articleBaseUrl = 'https://github.com/l2en/l2en.github.io/blob/master/dataSource/';
const _config = {
	articles: [
		{
			id: '20193221704',
			name: "CommonJS/AMD/CMD",
			des: "关于CommonJS/AMD/CMD三个js模块化开发规范记录",
			lag: ['Javascript','Markdown'],
			see: 1,
			tags: ["js模块化开发规范"],
			path: articleBaseUrl+'CommonJS_AMD_CMD.md',
			isOverview: true
		},
		{
			id: '20194260929',
			name: "学习笔记1 - 原型链",
			des: "学习笔记1 - 原型、原型链、闭包",
			lag: ['Javascript','Markdown'],
			see: 10,
			tags: ["原型", "原型链"],
			path: articleBaseUrl+'学习笔记1-原型链.md',
			isOverview: true
		},
		{
			id: '201905072323',
			name: "React知识点",
			des: "React知识点 - 要点浅析",
			lag: ['React'],
			see: 23,
			tags: ["React", "知识点", "要点", "笔记"],
			path: articleBaseUrl+'React要点.md',
			isOverview: true
		}
	]
}

export default _config;
