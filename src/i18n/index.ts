/**
 * i18n 入口。
 *
 * 只做一件事：根据 site.lang 选一份字典，导出 `t`。
 * 不改 URL、不加语言前缀 —— 一个站点一种语言，切换靠改 site.ts。
 *
 * 用法：
 *   import { t } from '../i18n';
 *   <h1>{t.archive.heading}</h1>
 */
import { site } from '../lib/site';
import { en, type Dictionary } from './en';
import { zh } from './zh';

/** 已注册的字典。加语言时在这里补一行。 */
export const dictionaries: Record<string, Dictionary> = {
  en,
  zh,
};

/** 取站点语言的字典，找不到就用英文 */
export function getDictionary(lang: string): Dictionary {
  // 'zh-CN' / 'zh_CN' / 'zh' 都归到 zh
  const base = lang.toLowerCase().split(/[-_]/)[0];
  return dictionaries[base] ?? dictionaries[lang] ?? en;
}

/** 当前站点的文案 */
export const t: Dictionary = getDictionary(site.lang);

/** 当前语言的基础标签，用于 <html lang> */
export const lang = site.lang;

/** 该语言下可用的所有语言代码，供语言切换器（若将来要做）使用 */
export const availableLocales = Object.keys(dictionaries);

export type { Dictionary };
