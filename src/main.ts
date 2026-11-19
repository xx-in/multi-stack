import { createApp } from 'vue';
import './styles.css';
import '@/core/island.ts';
import AppShell from '@/core/shell/AppShell.vue';
import { startPermissionControls } from '@/core/permissions.ts';
import { startRouter } from '@/core/router.ts';

createApp(AppShell).mount('#app');
startPermissionControls();
startRouter();
