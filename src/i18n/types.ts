/**
 * 字典类型。
 *
 * 从英文文案推导形状，把字符串展宽成 string，
 * 否则字面量类型会让其它语言无法赋值。
 *
 * 单独放这里，让 en.ts / zh.ts 保持纯数据文件。
 */
import en from './en';

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;

/**
 * 校验某个字典的键与英文一致。
 *
 * 数据文件本身不写类型标注，靠这里在入口处校验：
 *   const _check: Dictionary = zh;   // 缺键或多键都会报错
 */
export type ExactDictionary<T> = T extends Dictionary
  ? Dictionary extends T
    ? T
    : never
  : never;
