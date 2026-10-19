/** Markdown text-direction control for mixed Persian/English chat content. */
window.__ModuleLoader__.load({
  id: '@local/md-direction',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'mdDirection';
    const STORAGE_KEY = 'dsh.mdDirection';
    const MODES = ['auto', 'rtl', 'ltr'];

    const en = {
      meta: { title: 'Markdown Text Direction', description: 'Controls how mixed Persian/English markdown is aligned in the conversation: auto per paragraph, forced right-to-left, or forced left-to-right.' },
      settings: { title: 'Markdown text direction', description: 'Align Persian/English markdown paragraphs.', auto: 'Auto', rtl: 'Right (RTL)', ltr: 'Left (LTR)', 'auto.hint': 'Each paragraph follows its own language', 'rtl.hint': 'All markdown paragraphs align right', 'ltr.hint': 'All markdown paragraphs align left (default)' },
      dock: { 'mode.auto': 'Auto', 'mode.rtl': 'RTL', 'mode.ltr': 'LTR', 'tooltip.auto': 'Markdown direction: Auto (per paragraph). Click to switch to RTL.', 'tooltip.rtl': 'Markdown direction: RTL. Click to switch to LTR.', 'tooltip.ltr': 'Markdown direction: LTR. Click to switch to Auto.' },
    };
    const fa = {
      meta: { title: 'جهت متن مارک‌داون', description: 'نحوه چینش مارک‌داون مختلط فارسی/انگلیسی را در گفتگو تعیین می‌کند: خودکار برای هر پاراگراف، راست‌چین اجباری، یا چپ‌چین اجباری.' },
      settings: { title: 'جهت متن مارک‌داون', description: 'چینش پاراگراف‌های فارسی/انگلیسی را تعیین می‌کند.', auto: 'خودکار', rtl: 'راست‌چین', ltr: 'چپ‌چین', 'auto.hint': 'هر پاراگراف از زبان خودش پیروی می‌کند', 'rtl.hint': 'همه پاراگراف‌های مارک‌داون راست‌چین می‌شوند', 'ltr.hint': 'همه پاراگراف‌های مارک‌داون چپ‌چین می‌شوند (پیش‌فرض)' },
      dock: { 'mode.auto': 'خودکار', 'mode.rtl': 'راست', 'mode.ltr': 'چپ', 'tooltip.auto': 'جهت مارک‌داون: خودکار. برای راست‌چین کلیک کنید.', 'tooltip.rtl': 'جهت مارک‌داون: راست‌چین. برای چپ‌چین کلیک کنید.', 'tooltip.ltr': 'جهت مارک‌داون: چپ‌چین. برای حالت خودکار کلیک کنید.' },
    };

    function makeTranslate() {
      let localeId = 'en';
      return {
        bind(nextId) { localeId = nextId === 'fa' ? 'fa' : 'en'; },
        t(key) {
          const dict = (localeId === 'fa' ? fa : en) || en;
          const dot = key.indexOf('.');
          if (dot < 0) return key;
          const section = key.slice(0, dot);
          const rest = key.slice(dot + 1);
          return (dict[section] && dict[section][rest]) || key;
        },
      };
    }

    function readMode() {
      try {
        const value = localStorage.getItem(STORAGE_KEY);
        return MODES.includes(value) ? value : 'auto';
      } catch { return 'auto'; }
    }

    let current = readMode();
    const listeners = new Set();
    function getMode() { return current; }
    function subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; }
    function applyAttribute() {
      const root = document.documentElement;
      if (!root || typeof root.setAttribute !== 'function') return;
      if (current === 'auto') root.removeAttribute('data-dsh-md-dir');
      else root.setAttribute('data-dsh-md-dir', current);
    }
    function setMode(next) {
      if (!MODES.includes(next) || next === current) return;
      current = next;
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      applyAttribute();
      for (const listener of [...listeners]) { try { listener(); } catch {} }
    }

    function useMode() {
      const [mode, setLocal] = React.useState(current);
      React.useEffect(() => { setLocal(getMode()); return subscribe(() => setLocal(getMode())); }, []);
      return mode;
    }

    const CSS_TAG_ID = '@local/md-direction/direction.css';
    const BLOCKS = 'p,h1,h2,h3,h4,h5,h6,ul,ol,li,blockquote,table,thead,tbody,tfoot,tr,td,th,summary,dt,dd,figcaption';
    const SCOPES = '[data-conversation-scroll]';
    const directionCss = [
      'html[data-dsh-md-dir="auto"] ' + SCOPES + ' :is(' + BLOCKS + ') { unicode-bidi: plaintext; text-align: start; }',
      'html[data-dsh-md-dir="auto"] ' + SCOPES + ' :is(code,kbd,samp) { unicode-bidi: isolate; }',
      'html[data-dsh-md-dir="rtl"] ' + SCOPES + ' :is(' + BLOCKS + ') { direction: rtl; text-align: right; }',
      'html[data-dsh-md-dir="rtl"] ' + SCOPES + ' :is(ul,ol) { padding-inline-start: 1.6em; padding-inline-end: 0; margin-inline-start: 0; margin-inline-end: 0; }',
      'html[data-dsh-md-dir="rtl"] ' + SCOPES + ' :is(code,kbd,samp) { unicode-bidi: isolate; }',
      'html[data-dsh-md-dir="ltr"] ' + SCOPES + ' :is(' + BLOCKS + ') { direction: ltr; text-align: left; }',
      'html[data-dsh-md-dir="ltr"] ' + SCOPES + ' :is(ul,ol) { padding-inline-start: 1.6em; padding-inline-end: 0; margin-inline-start: 0; margin-inline-end: 0; }',
    ].join('\n');

    function insertTaggedStyle(tagId, css) {
      if (typeof document === 'undefined' || !document.head) return () => {};
      const tag = document.createElement('style');
      tag.setAttribute('data-plugin', '@local/md-direction');
      tag.setAttribute('data-plugin-css', tagId);
      tag.textContent = css;
      document.head.appendChild(tag);
      return () => tag.remove();
    }

    function AlignIcon({ kind }) {
      const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', 'aria-hidden': 'true' };
      const lines = [];
      const ys = [3.5, 6.5, 9.5, 12.5];
      if (kind === 'auto') {
        ys.forEach((y, i) => { const x1 = i % 2 === 0 ? 2 : 5; const x2 = i % 2 === 0 ? 14 : 11; lines.push(h('line', { key: i, x1, y1: y, x2, y2: y })); });
      } else if (kind === 'rtl') {
        ys.forEach((y, i) => { lines.push(h('line', { key: i, x1: 14, y1: y, x2: [4, 9, 6, 12][i], y2: y })); });
      } else {
        ys.forEach((y, i) => { lines.push(h('line', { key: i, x1: 2, y1: y, x2: [12, 7, 10, 4][i], y2: y })); });
      }
      return h('svg', common, lines);
    }

    function DockControl({ translator }) {
      const t = translator.t;
      const mode = useMode();
      const cycle = () => setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
      return h('button', { type: 'button', className: 'md-dir-dock', title: t('dock.tooltip.' + mode), 'aria-label': t('dock.tooltip.' + mode), onClick: cycle, 'data-mode': mode },
        h(AlignIcon, { kind: mode }),
        h('span', { className: 'md-dir-dock-label' }, t('dock.mode.' + mode)));
    }

    function SettingsRow({ translator }) {
      const t = translator.t;
      const mode = useMode();
      return h('div', { className: 'md-dir-row' },
        h('div', { className: 'md-dir-rowText' },
          h('div', { className: 'md-dir-rowTitle' }, t('settings.title')),
          h('div', { className: 'md-dir-rowDesc' }, t('settings.description'))),
        h('div', { className: 'md-dir-seg', role: 'radiogroup', 'aria-label': t('settings.title') },
          MODES.map((value) => h('button', { key: value, type: 'button', role: 'radio', 'aria-checked': mode === value, className: 'md-dir-segItem', 'data-active': mode === value ? '' : undefined, title: t('settings.' + value + '.hint'), onClick: () => setMode(value) }, t('settings.' + value)))));
    }

    const controlCss = [
      '.md-dir-dock{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 8px;border-radius:var(--dsw-radius-sm);border:0.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;transition:background-color .1s,color .1s}',
      '.md-dir-dock:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.md-dir-dock-label{white-space:nowrap}',
      '.md-dir-row{display:flex;align-items:center;gap:24px;padding:10px 0;min-width:0}',
      '.md-dir-rowText{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}',
      '.md-dir-rowTitle{color:var(--dsw-alias-label-primary);font-size:var(--dsh-content-font-size,14px)}',
      '.md-dir-rowDesc{color:var(--dsw-alias-label-tertiary);font-size:var(--dsh-content-font-size-secondary,13px)}',
      '.md-dir-seg{flex:none;display:inline-flex;border:0.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);overflow:hidden;background:var(--dsw-alias-bg-layer-1)}',
      '.md-dir-segItem{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);padding:6px 12px;cursor:pointer;transition:background-color .1s,color .1s}',
      '.md-dir-segItem:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}',
      '.md-dir-segItem[data-active]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover-solid,var(--dsw-alias-interactive-bg-hover));font-weight:500}',
      '.md-dir-segItem + .md-dir-segItem{border-inline-start:0.5px solid var(--dsw-alias-border-l2)}',
    ].join('\n');

    return {
      inject: ['slots'],
      apply(ctx) {
        const translator = makeTranslate();
        try {
          const locale = ctx.locale;
          if (locale) {
            if (typeof locale.register === 'function' && typeof locale.bind === 'function') locale.register(NS, { en, fa });
            if (typeof locale.getLocale === 'function') translator.bind(locale.getLocale().id);
            if (typeof locale.subscribe === 'function') locale.subscribe(() => { try { translator.bind(locale.getLocale().id); } catch {} });
            else if (typeof locale.bind === 'function') translator.bind('fa');
          }
        } catch (error) { console.error('[md-direction] locale binding failed; using English fallback.', error); }

        const inject = () => ({ translator });

        ctx.effect(() => {
          const removeDirection = insertTaggedStyle(CSS_TAG_ID, directionCss);
          const removeControls = insertTaggedStyle('@local/md-direction/controls.css', controlCss);
          applyAttribute();
          return () => { removeDirection(); removeControls(); document.documentElement.removeAttribute('data-dsh-md-dir'); };
        }, 'md-direction: styles + html attribute');

        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({ name: 'conversation.composer.dock', id: 'md-direction', order: 5, locale: NS, inject }, DockControl));
        ctx.slots.inject('settings.general.item', () => ctx.slots.register({ name: 'settings.general.item', id: 'md-direction', order: 60, locale: NS, inject }, SettingsRow));
      },
    };
  },
});
