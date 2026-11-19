# Island

没有服务端渲染的岛屿 SPA。入口 `index.html` 只有全局占位节点 `#app` 和启动脚本。顶栏是 `src/components/AppHeader.ts`，由需要它的页面自行导入。页面按框架使用对应文件：React 是 `.tsx`，Vue 3 和 Vue 2 都是 `.vue`，Svelte 是 `.svelte`。Vue 2 文件以 `<!-- vue2 -->` 开头，其余 `.vue` 按 Vue 3 编译。交互块是 `<x-island>`。样式使用 Tailwind CSS 4，`html.dark` 切换昼夜。

```bash
npm run dev      # 开发
npm run build    # 产出静态 dist/
npm run preview  # 预览构建结果
npm test         # 运行测试
```

## 路由

路由使用 History API。开发服务器和 `vite preview` 会把未知路径回退到 `index.html`。部署 `dist/` 时，静态服务器也要做同样的回退。

只有 `index.tsx`、`index.vue`、`index.svelte` 会成为路由。首页是 `src/pages/index/index.svelte`，地址是 `/`，页面上只有一个到 `/test` 的链接。原来的首页是 `src/pages/test/index.tsx`，地址是 `/test`。待办是 `src/pages/todos/index.vue`，关于是 `src/pages/about/index.svelte`，`src/pages/guide/index.vue` 是 `/guide`，报表 `src/pages/reports/index.vue` 是 Vue 2 页面，地址是 `/reports`，管理是 `src/pages/admin/index.svelte`。同一目录里的其他文件是该页面自己的组件，不会变成路由。`/test` 的计数只有一个，总线、插槽和视口是四个框架各一份。报表和管理上的说明块也是。

`src/routes.ts` 只列出需要权限的页面，每条占一个二进制位。没有写在这里的路由默认可访问。没有对应位时不会加载该页面，里面的组件也不会挂载，顶栏菜单也会藏起来。当前 `/reports` 是 `1`，`/admin` 是 `2`。

顶栏壳子是 `src/components/AppHeader.ts`。页面要显示顶栏时导入这个文件，把正文写进 `<x-header>`。壳子固定在页面上方，只有这段插槽可以垂直滚动。导航是子组件 `src/components/AppNav.ts`，以后可以换成别的子组件。右上角的权限数字按位控制这些菜单，选择会记在 `sessionStorage`。昼夜按钮写在 `localStorage` 的 `island-theme`。

## 新增组件

1. 只给当前页面用的组件，放在该页面的目录里，例如 `src/pages/todos/TodoList.tsx`。多个页面共用的组件放在 `src/components/`。
2. 同一目录用相对路径，例如 `import TodoList from './TodoList.tsx'`。跨目录才用 `@`，例如 `import Counter from '@/components/Counter.tsx'`。再写 `<x-island component={TodoList} renderer="react|vue|vue2|svelte">`。`vue` 是 Vue 3。Vue 模板用 `:component="TodoList"`。
3. 组件之间用 `@island/bus` 通信。`bus.on` 返回的取消函数要在组件卸载时调用。

`@` 指向 `src`。`component` 是 import 进来的组件，不是文件路径。

路由器、渲染器和权限在 `src/core`，一般不用改。

`/todos` 上有四份功能相同的待办列表，分别用 React、Vue 3、Vue 2、Svelte 实现，用来对照添加、勾选、筛选、删除和清除已完成。

## 视口加载

`when="visible"` 表示进入视口后才加载一次。

`<x-island>` 必须保持 `display: block`。设成 `display: contents` 后元素没有盒子，`IntersectionObserver` 看不到它。插槽容器 `<x-slot>` 才使用 `display: contents`。
