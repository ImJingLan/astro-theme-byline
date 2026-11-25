/**
 * 时间轴分页：点「加载更多」取下一页 JSON，用模板克隆节点插进列表。
 *
 * 用 <template> 而不是 createElement，是因为 scoped CSS 编译成了
 * 带 data-astro-cid 的选择器，脚本新建的节点拿不到那个属性，样式会丢。
 */

interface PayloadItem {
  kind: 'self' | 'friend';
  title: string;
  link: string;
  dateISO: string;
  dateLabel: string;
  thumb: string;
  siteTitle?: string;
  siteLink?: string;
}

interface PayloadGroup {
  key: string;
  heading: string;
  items: PayloadItem[];
}

/** 已加载到第几页；首屏是第 1 页 */
let loaded = 1;

function buildItem(
  item: PayloadItem,
  tpl: HTMLTemplateElement,
  selfLabel: string
): HTMLElement | null {
  const li = tpl.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  if (!li) return null;

  li.classList.add(`tl-item--${item.kind}`);

  const thumbLink = li.querySelector<HTMLAnchorElement>('a.tl-thumb');
  const img = li.querySelector('img');
  const badge = li.querySelector<HTMLElement>('.tl-badge');
  const time = li.querySelector('time');
  const title = li.querySelector<HTMLAnchorElement>('.tl-title');

  if (!thumbLink || !img || !badge || !time || !title) return null;

  if (item.thumb) {
    thumbLink.href = item.link;
    img.src = item.thumb;
  } else {
    // 没有图就退成占位块
    const empty = document.createElement('span');
    empty.className = 'tl-thumb tl-thumb--empty';
    empty.setAttribute('aria-hidden', 'true');
    thumbLink.replaceWith(empty);
  }

  if (item.kind === 'friend' && item.siteTitle) {
    badge.className = 'tl-badge tl-badge--friend';
    const siteLink = document.createElement('a');
    siteLink.className = 'tl-badge tl-badge--friend';
    siteLink.href = item.siteLink ?? '';
    siteLink.target = '_blank';
    siteLink.rel = 'noopener';
    siteLink.textContent = item.siteTitle;
    badge.replaceWith(siteLink);
  } else {
    badge.className = 'tl-badge tl-badge--self';
    badge.textContent = selfLabel;
  }

  time.dateTime = item.dateISO;
  time.textContent = item.dateLabel;

  title.href = item.link;
  title.textContent = item.title;
  if (item.kind === 'friend') {
    title.target = '_blank';
    title.rel = 'noopener';
    thumbLink.target = '_blank';
    thumbLink.rel = 'noopener';
  }

  return li;
}

function appendGroup(
  group: PayloadGroup,
  containers: HTMLElement,
  groupTpl: HTMLTemplateElement,
  itemTpl: HTMLTemplateElement,
  selfLabel: string
): void {
  // 同一月份跨页时接到已有分组后面，不再写一次标题
  let section = containers.querySelector<HTMLElement>(`[data-month-key="${group.key}"]`);
  let list: HTMLElement | null = null;

  if (section) {
    list = section.querySelector('.tl-list');
  } else {
    const node = groupTpl.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    if (!node) return;

    node.dataset.monthKey = group.key;
    const heading = node.querySelector('.tl-heading');
    if (heading) heading.textContent = group.heading;

    containers.append(node);
    section = node;
    list = node.querySelector('.tl-list');
  }

  if (!list) return;

  for (const item of group.items) {
    const li = buildItem(item, itemTpl, selfLabel);
    if (li) {
      li.dataset.timelineMonth = group.key;
      list.append(li);
    }
  }
}

async function loadMore(): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  if (!root) return;

  const button = root.querySelector<HTMLButtonElement>('[data-timeline-more]');
  const note = root.querySelector<HTMLElement>('[data-timeline-note]');
  const containers = root.querySelector<HTMLElement>('[data-timeline-groups]');
  const groupTpl = root.querySelector<HTMLTemplateElement>('[data-timeline-group-tpl]');
  const itemTpl = root.querySelector<HTMLTemplateElement>('[data-timeline-item-tpl]');

  if (!button || !containers || !groupTpl || !itemTpl) return;

  const total = Number(root.dataset.totalPages ?? '1');
  if (loaded >= total) return;

  const next = loaded + 1;
  const label = button.textContent;
  button.disabled = true;
  button.textContent = button.dataset.loadingLabel ?? label;

  try {
    const res = await fetch(`/timeline-data/${next}.json`);
    if (!res.ok) throw new Error(String(res.status));

    const groups = (await res.json()) as PayloadGroup[];
    if (!Array.isArray(groups) || groups.length === 0) throw new Error('empty');

    const selfLabel = root.dataset.selfLabel ?? '';
    for (const group of groups) appendGroup(group, containers, groupTpl, itemTpl, selfLabel);

    loaded = next;

    if (loaded >= total) {
      button.remove();
      // 没有结束语就不留空段落
      const end = button.dataset.endLabel ?? '';
      if (note && end) {
        note.hidden = false;
        note.textContent = end;
      }
    } else {
      button.disabled = false;
      button.textContent = label;
    }
  } catch {
    button.disabled = false;
    button.textContent = label;
    if (note) {
      note.hidden = false;
      note.textContent = button.dataset.failedLabel ?? '';
    }
  }
}

let bound = false;

function start(): void {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  if (!root) return;

  // swup 换页后同一个根节点会被替换，重新绑定
  if (bound) {
    loaded = 1;
  }
  bound = true;

  root.querySelector('[data-timeline-more]')?.addEventListener('click', () => {
    void loadMore();
  });
}

start();
document.addEventListener('astro:page-load', start);
