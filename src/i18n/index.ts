/**
 * i18n 入口：按 site.lang 选一份字典，导出 `t`。
 * 一个站点一种语言，不加 URL 前缀。
 */
import { site } from '../lib/site';
import { en, type Dictionary } from './en';
import { zh } from './zh';

/** 已注册的字典；加语言在这里补一行 */
export const dictionaries: Record<string, Dictionary> = {
  en,
  zh,
};

/** 取站点语言的字典，找不到回退英文。zh-CN / zh_CN / zh 都归到 zh */
export function getDictionary(lang: string): Dictionary {
  const base = lang.toLowerCase().split(/[-_]/)[0];
  return dictionaries[base] ?? dictionaries[lang] ?? en;
}

export const t: Dictionary = getDictionary(site.lang);

export const availableLocales = Object.keys(dictionaries);

export type { Dictionary };
