/** 每个受控页面占一个二进制位。顶栏数字包含该位才显示菜单并打开页面。 */
export type GuardedRoute = {
  path: string;
  bit: number;
};

export const routes: GuardedRoute[] = [
  { path: '/reports', bit: 1 },
  { path: '/admin', bit: 2 },
];
