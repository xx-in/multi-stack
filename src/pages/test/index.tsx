import '@/components/AppHeader.ts';
import Counter from '@/components/Counter.tsx';
import Card from './Card.svelte';
import Frame from './Frame';
import ListenerReact from './Listener';
import ListenerSvelte from './Listener.svelte';
import ListenerVue from './Listener.vue';
import ListenerVue2 from './ListenerVue2.vue';
import Panel from './Panel.vue';
import PanelVue2 from './PanelVue2.vue';
import VisiblePingReact from './VisiblePing';
import VisiblePingSvelte from './VisiblePing.svelte';
import VisiblePingVue from './VisiblePing.vue';
import VisiblePingVue2 from './VisiblePingVue2.vue';

export const title = '首页';

export default function HomePage() {
  return (
    <x-header>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">首页</h1>
          <p id="static-copy" className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            这段是静态 HTML，不属于任何框架。计数只有一个，点它会通知下面四个框架的监听。
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">计数</h2>
          <x-island component={Counter} renderer="react" props='{"start":0}' />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">总线</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <x-island component={ListenerReact} renderer="react">
              <em>React 默认插槽</em>
            </x-island>
            <x-island component={ListenerVue} renderer="vue">
              <em>Vue 3 默认插槽</em>
            </x-island>
            <x-island component={ListenerVue2} renderer="vue2">
              <em>Vue 2 默认插槽</em>
            </x-island>
            <x-island component={ListenerSvelte} renderer="svelte">
              <em>Svelte 默认插槽</em>
            </x-island>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">插槽</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <x-island component={Frame} renderer="react">
              <span slot="header">React 标题插槽</span>
              <p>React 默认插槽</p>
            </x-island>
            <x-island component={Panel} renderer="vue">
              <span slot="header">Vue 3 标题插槽</span>
              <p>Vue 3 默认插槽</p>
            </x-island>
            <x-island component={PanelVue2} renderer="vue2">
              <span slot="header">Vue 2 标题插槽</span>
              <p>Vue 2 默认插槽</p>
            </x-island>
            <x-island component={Card} renderer="svelte">
              <span slot="header">Svelte 标题插槽</span>
              <p>Svelte 默认插槽</p>
            </x-island>
          </div>
        </section>

        <div className="spacer" />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">视口</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <x-island component={VisiblePingReact} renderer="react" when="visible" />
            <x-island component={VisiblePingVue} renderer="vue" when="visible" />
            <x-island component={VisiblePingVue2} renderer="vue2" when="visible" />
            <x-island component={VisiblePingSvelte} renderer="svelte" when="visible" />
          </div>
        </section>
      </div>
    </x-header>
  );
}
