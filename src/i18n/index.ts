/**
 * i18n 入口：按 site.lang 选一份字典，导出 `t`。
 * 一个站点一种语言，不加 URL 前缀。
 */
import { site } from '../lib/site';
import en from './en';
import zh from './zh';
import type { Dictionary } from './types';

/*
  语言文件是纯数据，不带类型标注。
  在这里用 satisfies 校验：少键或多键都会编译失败，
  加语言时不会悄悄漏翻。
*/
const dictionaries = {
  en,
  zh,
} satisfies Record<string, Dictionary>;

/** 语言标签归一：zh-CN / zh_CN / zh 都取 zh */
const baseOf = (lang: string) => lang.toLowerCase().split(/[-_]/)[0];

/**
 * 已注册语言的元信息。
 * 与文件头的注释对应，方便做语言切换器时不用去翻文件。
 */
export const locales: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
];

export function getDictionary(lang: string): Dictionary {
  const key = baseOf(lang);
  const table = dictionaries as Record<string, Dictionary>;
  return table[key] ?? table[lang] ?? en;
}

export const t: Dictionary = getDictionary(site.lang);

export const availableLocales = Object.keys(dictionaries);

export type { Dictionary };
