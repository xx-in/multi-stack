import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatTitle } from '../src/core/title.ts';

test('页面标题原样使用', () => {
  assert.equal(formatTitle('首页'), '首页');
  assert.equal(formatTitle(' 报表 '), '报表');
});

test('没有标题时显示加载中', () => {
  assert.equal(formatTitle(), '加载中');
  assert.equal(formatTitle('   '), '加载中');
});
