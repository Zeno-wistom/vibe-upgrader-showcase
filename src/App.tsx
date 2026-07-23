import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import './styles.css'

type Locale = 'zh' | 'en'
type Capability = 'hierarchy' | 'workflow' | 'feedback' | 'motion'
type Track = 'standard' | 'experimental'

const text = {
  zh: {
    nav: ['看见升级', '能改什么', '怎么完成'],
    hero: {
      eyebrow: 'VIBE-UPGRADER / 视觉与交互升级系统',
      title: ['把「能用」', '升级成', '好懂、好用、想继续用。'],
      body: '它不只改 UI。它会重新安排信息、缩短操作路径、补齐反馈，再用克制的动效把体验连成一个整体。',
      cta: '先看一次真正的升级',
      note: '向下滚动，界面会完成重组',
      labels: ['信息层级', '操作路径', '交互反馈', '动效语言'],
    },
    compare: {
      eyebrow: '01 / SAME PRODUCT, NEW EXPERIENCE',
      title: ['不是换配色。', '拖一下，看产品怎样重组。'],
      body: '两边处理的是同一个项目后台。拖动分界线，观察重点、操作路径、状态反馈和界面节奏怎样一起改变。',
      before: '升级前 / 信息平铺',
      after: '升级后 / 任务驱动',
      hint: '拖动这里',
      signals: [
        ['01', '重点更明确', '打开页面就知道下一步做什么'],
        ['02', '操作更短', '高频动作从三步缩短为一步'],
        ['03', '反馈更及时', '保存、完成、进度都有明确回应'],
        ['04', '体验有记忆', '视觉和动效服务于同一套产品语言'],
      ],
      action: '完成评审',
      done: '评审已完成',
      toast: '已完成：设计评审',
    },
    capabilities: {
      eyebrow: '02 / WHAT CAN IT UPGRADE?',
      title: ['到底能升级什么？', '四类问题，一次看懂。'],
      body: '选择一个问题，右侧会直接演示它如何从“能用”变成“顺手”。不是组件清单，而是用户能感受到的结果。',
      items: {
        hierarchy: ['看清重点', '重新组织标题、数据与主操作，让视线先到真正重要的位置。'],
        workflow: ['少走步骤', '把高频动作拉到眼前，合并重复步骤，减少来回寻找。'],
        feedback: ['每次操作有回应', '让进行中、成功和下一步清楚可见，不再靠猜。'],
        motion: ['形成记忆点', '用空间、节奏和转场解释变化，而不是装饰页面。'],
      },
    },
    scope: {
      eyebrow: '03 / HOW FAR SHOULD IT GO?',
      title: ['先决定这次改多大。', '不把每个项目都重做一遍。'],
      body: '真实产品优先走 Standard；只有明确需要强视觉方向时，才进入 Experimental，并先做隔离原型。',
      standard: ['Standard / 标准轨', '直接优化真实页面', '适合后台、工具、内容产品的局部升级', ['保留现有架构', '只改关键体验', '构建与交互一起验证']],
      experimental: ['Experimental / 实验轨', '先验证一个强机制', '适合品牌首屏、叙事页面或非标准交互', ['一次只试一个方向', '独立预览，不污染产品', '人工批准后才整合']],
      current: '本网站这次采用',
      selected: ['一个核心空间重组机制', '无新增运行依赖', '桌面、移动端、键盘与减少动态效果均有回退'],
    },
    process: {
      eyebrow: '04 / FROM REQUEST TO RESULT',
      title: ['不是“加点效果”。', '是一条可检查的升级流程。'],
      body: '每一步都回答一个实际问题，最后交付的是能运行、能理解、也能继续维护的产品体验。',
      steps: [
        ['01', '理解真实页面', '先看内容、用户任务和不能动的边界。'],
        ['02', '找到合适机制', '只检索当前问题需要的参考，拒绝无关炫技。'],
        ['03', '做成统一体验', '把视觉、交互与动效写进同一套界面语言。'],
        ['04', '验证真实使用', '构建、响应式、键盘、动效回退与人工视觉一起检查。'],
      ],
      proof: ['0 个新增依赖', '1 套核心机制', '4 类体验证据'],
    },
    final: {
      eyebrow: 'VIBE-UPGRADER / READY TO USE',
      title: ['让页面不只是更好看。', '让产品更容易被理解、被操作、被记住。'],
      github: '查看 GitHub',
      case: '查看真实 AIGC 案例',
      back: '回到顶部',
    },
  },
  en: {
    nav: ['See it', 'Capabilities', 'Process'],
    hero: {
      eyebrow: 'VIBE-UPGRADER / VISUAL & INTERACTION UPGRADE SYSTEM',
      title: ['Turn “usable”', 'into', 'clear, effortless, memorable.'],
      body: 'It goes beyond UI styling: reorganizing information, shortening workflows, adding feedback, and connecting it all with purposeful motion.',
      cta: 'See a real upgrade',
      note: 'Scroll — the interface will reorganize',
      labels: ['Hierarchy', 'Workflow', 'Feedback', 'Motion language'],
    },
    compare: {
      eyebrow: '01 / SAME PRODUCT, NEW EXPERIENCE',
      title: ['Not a new palette.', 'Drag to reorganize the product.'],
      body: 'Both sides are the same project workspace. Drag the divider and watch hierarchy, workflow, feedback and rhythm change together.',
      before: 'Before / Everything at once',
      after: 'After / Task-driven',
      hint: 'Drag here',
      signals: [
        ['01', 'Clear priority', 'Know the next step the moment the page opens'],
        ['02', 'Shorter workflow', 'Frequent actions move from three steps to one'],
        ['03', 'Visible feedback', 'Save, completion and progress always respond'],
        ['04', 'A product voice', 'Visuals and motion speak one language'],
      ],
      action: 'Complete review',
      done: 'Review complete',
      toast: 'Completed: design review',
    },
    capabilities: {
      eyebrow: '02 / WHAT CAN IT UPGRADE?',
      title: ['What actually changes?', 'Four problems, made tangible.'],
      body: 'Choose a problem and the stage demonstrates the result directly. Not a component list — a change users can feel.',
      items: {
        hierarchy: ['See what matters', 'Reorganize headings, data and primary actions so attention lands correctly.'],
        workflow: ['Take fewer steps', 'Surface frequent actions and remove repeated navigation.'],
        feedback: ['Make actions answer', 'Show progress, success and the next step instead of making users guess.'],
        motion: ['Build a memory', 'Use space, rhythm and transitions to explain change — never decoration alone.'],
      },
    },
    scope: {
      eyebrow: '03 / HOW FAR SHOULD IT GO?',
      title: ['Decide the size first.', 'Not every product needs a rebuild.'],
      body: 'Real products default to Standard. Experimental is reserved for a clear visual ambition and starts as an isolated prototype.',
      standard: ['Standard track', 'Upgrade the real page', 'For focused improvements to tools, dashboards and content products', ['Keep the architecture', 'Change the critical experience', 'Verify build and interaction']],
      experimental: ['Experimental track', 'Prove one bold mechanism', 'For brand moments, narratives or unusual interactions', ['One direction at a time', 'Isolated from the product', 'Integrate after human approval']],
      current: 'This showcase uses',
      selected: ['One spatial reorganization system', 'No new runtime dependency', 'Desktop, mobile, keyboard and reduced-motion fallbacks'],
    },
    process: {
      eyebrow: '04 / FROM REQUEST TO RESULT',
      title: ['Not “add some effects.”', 'A verifiable upgrade process.'],
      body: 'Every step answers a product question. The result runs, reads clearly and remains maintainable.',
      steps: [
        ['01', 'Understand the real page', 'Read the content, user task and boundaries first.'],
        ['02', 'Find the right mechanism', 'Retrieve only what this problem needs; reject unrelated spectacle.'],
        ['03', 'Build one experience', 'Unify visuals, interaction and motion into one interface language.'],
        ['04', 'Verify real use', 'Check build, responsive behavior, keyboard, motion fallback and human judgment.'],
      ],
      proof: ['0 new dependencies', '1 core mechanism', '4 evidence types'],
    },
    final: {
      eyebrow: 'VIBE-UPGRADER / READY TO USE',
      title: ['Do more than make it prettier.', 'Make the product easier to understand, use and remember.'],
      github: 'View GitHub',
      case: 'View real AIGC case',
      back: 'Back to top',
    },
  },
} as const

function Mark() {
  return <span className="mark" aria-hidden="true"><i /><i /><i /></span>
}

function Header({ locale, onLocale }: { locale: Locale; onLocale: () => void }) {
  const c = text[locale]
  return <header className="header">
    <a className="brand" href="#top"><Mark /><b>VIBE—UPGRADER</b></a>
    <nav><a href="#compare">{c.nav[0]}</a><a href="#capabilities">{c.nav[1]}</a><a href="#process">{c.nav[2]}</a></nav>
    <button type="button" className="language" onClick={onLocale}><b>{locale === 'zh' ? '中' : 'EN'}</b><i />{locale === 'zh' ? 'EN' : '中'}</button>
  </header>
}

function Hero({ locale }: { locale: Locale }) {
  const c = text[locale].hero
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)))
      el.style.setProperty('--hero-p', p.toFixed(3))
      raf = 0
    }
    const scroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', scroll, { passive: true })
    return () => { removeEventListener('scroll', scroll); cancelAnimationFrame(raf) }
  }, [])
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - .5).toFixed(3))
    event.currentTarget.style.setProperty('--my', ((event.clientY - Math.max(0, rect.top)) / innerHeight - .5).toFixed(3))
  }
  return <section className="hero" id="top" ref={root} onPointerMove={move}>
    <div className="hero-sticky">
      <div className="grid-bg" />
      <div className="hero-copy">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1>{c.title.map((line, i) => <span key={line} className={i === 2 ? 'hero-accent' : ''}>{line}</span>)}</h1>
        <div className="hero-bottom"><p>{c.body}</p><a href="#compare">{c.cta}<b>↓</b></a></div>
      </div>
      <div className="rebuild" aria-hidden="true">
        <div className="rebuild-shell">
          <div className="rebuild-nav"><Mark /><i /><i /><i /></div>
          <div className="rebuild-main"><span>ACTIVE WORKSPACE</span><strong>NORTHSTAR</strong><div><b>74%</b><i /></div></div>
          <div className="rebuild-action">NEXT ACTION <b>↗</b></div>
        </div>
        <span className="orbit orbit-a">{c.labels[0]}</span>
        <span className="orbit orbit-b">{c.labels[1]}</span>
        <span className="orbit orbit-c">{c.labels[2]}</span>
        <span className="orbit orbit-d">{c.labels[3]}</span>
      </div>
      <div className="hero-progress"><span>{c.note}</span><i><b /></i></div>
    </div>
  </section>
}

function Heading({ eyebrow, title, body, light = false }: { eyebrow: string; title: readonly string[]; body: string; light?: boolean }) {
  return <div className={`heading${light ? ' light' : ''}`}><p>{eyebrow}</p><h2>{title.map(line => <span key={line}>{line}</span>)}</h2><p>{body}</p></div>
}

function BeforeWorkspace() {
  return <div className="workspace before-workspace" aria-hidden="true">
    <aside><Mark /><span className="active" /><span /><span /><span /><span /></aside>
    <main>
      <header><div><small>PROJECT MANAGEMENT</small><strong>Northstar Dashboard</strong></div><button tabIndex={-1}>+ Create</button></header>
      <div className="old-filters"><span>Overview</span><span>Tasks</span><span>Reports</span><span>Team</span><button tabIndex={-1}>Filter</button></div>
      <div className="old-stats">{['74%', '12', '08', '03'].map((v, i) => <div key={v}><small>{['Completion', 'Open tasks', 'Members', 'Blocked'][i]}</small><strong>{v}</strong><i /></div>)}</div>
      <div className="old-table">
        <div><b>Task</b><b>Owner</b><b>Status</b></div>
        <div><span>Research system</span><span>JR</span><em>Done</em></div>
        <div><span>Interface direction</span><span>MS</span><em>Working</em></div>
        <div><span>Motion language</span><span>AL</span><em>Todo</em></div>
        <div><span>Design review</span><span>YOU</span><em>Today</em></div>
      </div>
    </main>
  </div>
}

function AfterWorkspace({ locale, completed, interactive, onComplete }: { locale: Locale; completed: boolean; interactive: boolean; onComplete: () => void }) {
  const c = text[locale].compare
  return <div className={`workspace after-workspace${completed ? ' completed' : ''}`}>
    <aside><Mark /><button tabIndex={-1} aria-hidden="true">⌂</button><button tabIndex={-1} aria-hidden="true">◇</button><button tabIndex={-1} aria-hidden="true">↗</button><span>NS</span></aside>
    <main>
      <header><div><small>MONDAY / ACTIVE WORKSPACE</small><strong>Good morning.<br />Move Northstar forward.</strong></div><div className="team"><i>JR</i><i>MS</i><i>+3</i></div></header>
      <section className="focus-card">
        <div><small>NEXT BEST ACTION</small><h3>{completed ? c.done : 'Design review'}</h3><p>{completed ? 'Everything is ready for the next milestone.' : '3 decisions are ready. Estimated time: 8 min.'}</p></div>
        <button type="button" tabIndex={interactive ? 0 : -1} onClick={onComplete}>{completed ? '✓' : c.action}<b>→</b></button>
        <div className="focus-progress"><span style={{ '--value': completed ? '100%' : '74%' } as CSSProperties} /><strong>{completed ? '100' : '74'}<small>%</small></strong></div>
      </section>
      <section className="after-grid">
        <div className="momentum"><small>WEEKLY MOMENTUM</small><strong>+18%</strong><svg viewBox="0 0 240 70" preserveAspectRatio="none"><path d="M0 58 C30 55 34 48 60 50 S94 44 116 37 S150 46 173 25 S206 22 240 8" /></svg></div>
        <div className="quick"><small>QUICK ACTIONS</small><button>Share preview <b>↗</b></button><button>Open decisions <b>3</b></button></div>
        <div className="activity"><small>LIVE ACTIVITY</small><p><i />Mia resolved navigation</p><p><i />Motion spec ready</p></div>
      </section>
      <div className="success-toast" role="status">{c.toast}<b>✓</b></div>
    </main>
  </div>
}

function Compare({ locale }: { locale: Locale }) {
  const c = text[locale].compare
  const [position, setPosition] = useState(10)
  const [completed, setCompleted] = useState(false)
  const p = position / 100
  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    if (event.type === 'pointermove' && event.buttons !== 1) return
    const rect = event.currentTarget.getBoundingClientRect()
    const next = Math.round(Math.min(.95, Math.max(.05, (event.clientX - rect.left) / rect.width)) * 100)
    setPosition(next)
    if (event.type === 'pointerdown') event.currentTarget.setPointerCapture(event.pointerId)
  }
  return <section className="compare section-pad" id="compare">
    <Heading eyebrow={c.eyebrow} title={c.title} body={c.body} />
    <div className="compare-frame" style={{ '--split': `${position}%`, '--p': p } as CSSProperties} onPointerDown={updateFromPointer} onPointerMove={updateFromPointer}>
      <div className="compare-top"><span>{c.after}</span><span>{c.before}</span></div>
      <div className="compare-canvas">
        <div className="before-layer"><BeforeWorkspace /></div>
        <div className="after-layer"><AfterWorkspace locale={locale} completed={completed} interactive={position > 60} onComplete={() => setCompleted(v => !v)} /></div>
      </div>
      <div className="compare-line" aria-hidden="true"><span><b>‹</b><i /><b>›</b></span><small>{position < 22 ? c.hint : `${position}%`}</small></div>
      <input aria-label={c.hint} type="range" min="5" max="95" value={position} onChange={e => setPosition(Number(e.target.value))} />
    </div>
    <div className="signal-row">{c.signals.map((item, i) => <article key={item[0]} className={position > 18 + i * 18 ? 'active' : ''}><span>{item[0]}</span><div><strong>{item[1]}</strong><p>{item[2]}</p></div></article>)}</div>
  </section>
}

const capabilityIcons: Record<Capability, string> = { hierarchy: 'A', workflow: '↗', feedback: '✓', motion: '◎' }

function CapabilityDemo({ active }: { active: Capability }) {
  return <div className={`cap-demo mode-${active}`}>
    <div className="cap-top"><span>PROJECT / NORTHSTAR</span><i /><i /></div>
    <div className="cap-title"><small>ACTIVE WORKSPACE</small><strong>Launch ready.</strong><button>Publish <b>↗</b></button></div>
    <div className="cap-body">
      <div className="cap-primary"><small>NEXT ACTION</small><h3>Approve final experience</h3><p>Everything needed for the decision is in one place.</p><button>Review now <b>→</b></button></div>
      <div className="cap-side"><small>PROGRESS</small><strong>92%</strong><i><b /></i><p><span>✓</span>Structure</p><p><span>✓</span>Interaction</p><p><span>•</span>Final review</p></div>
    </div>
    <div className="cap-feedback"><b>✓</b><span>Changes saved<br /><small>Ready for review</small></span></div>
    <div className="motion-rings"><i /><i /><i /></div>
  </div>
}

function Capabilities({ locale }: { locale: Locale }) {
  const c = text[locale].capabilities
  const [active, setActive] = useState<Capability>('hierarchy')
  const keys = Object.keys(c.items) as Capability[]
  return <section className="capabilities" id="capabilities"><div className="section-pad">
    <Heading eyebrow={c.eyebrow} title={c.title} body={c.body} light />
    <div className="cap-layout">
      <div className="cap-tabs" role="tablist">{keys.map((key, i) => {
        const item = c.items[key]
        return <button key={key} role="tab" aria-selected={active === key} onClick={() => setActive(key)}><span>0{i + 1}</span><i>{capabilityIcons[key]}</i><div><strong>{item[0]}</strong><small>{item[1]}</small></div><b>→</b></button>
      })}</div>
      <div className="cap-stage"><div className="stage-label"><span>LIVE DEMO</span><b>{c.items[active][0]}</b></div><CapabilityDemo active={active} /></div>
    </div>
  </div></section>
}

function Scope({ locale }: { locale: Locale }) {
  const c = text[locale].scope
  const [track, setTrack] = useState<Track>('standard')
  const selected = track === 'standard' ? c.standard : c.experimental
  return <section className="scope section-pad" id="scope">
    <Heading eyebrow={c.eyebrow} title={c.title} body={c.body} />
    <div className={`scope-console track-${track}`}>
      <div className="scope-switch" role="tablist">
        {(['standard', 'experimental'] as Track[]).map((key, i) => {
          const item = key === 'standard' ? c.standard : c.experimental
          return <button key={key} role="tab" aria-selected={track === key} onClick={() => setTrack(key)}><span>0{i + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small><i /></button>
        })}
      </div>
      <div className="scope-result">
        <div className="scope-orbit"><span>{track === 'standard' ? 'S' : 'E'}</span><i /><i /><i /></div>
        <div><p>{selected[2]}</p><h3>{selected[1]}</h3><ul>{selected[3].map(item => <li key={item}><b>✓</b>{item}</li>)}</ul></div>
        <div className="scope-current"><small>{c.current}</small><strong>EXPERIMENTAL</strong>{c.selected.map(item => <p key={item}><b>—</b>{item}</p>)}</div>
      </div>
    </div>
  </section>
}

function Process({ locale }: { locale: Locale }) {
  const c = text[locale].process
  return <section className="process" id="process"><div className="section-pad">
    <Heading eyebrow={c.eyebrow} title={c.title} body={c.body} light />
    <div className="process-line">{c.steps.map((step, i) => <article key={step[0]}><span>{step[0]}</span><i><b /></i><strong>{step[1]}</strong><p>{step[2]}</p><small>{i === c.steps.length - 1 ? 'DELIVER' : 'CONTINUE'} →</small></article>)}</div>
    <div className="proof-row">{c.proof.map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong></div>)}</div>
  </div></section>
}

function Final({ locale }: { locale: Locale }) {
  const c = text[locale].final
  return <section className="final">
    <div className="grid-bg" />
    <p>{c.eyebrow}</p>
    <h2>{c.title.map(line => <span key={line}>{line}</span>)}</h2>
    <div className="final-links"><a href="https://github.com/Zeno-wistom/vibe-upgrader" target="_blank" rel="noreferrer noopener">{c.github}<b>↗</b></a><a href="https://vibe-upgrader-aigc-case.vercel.app/" target="_blank" rel="noreferrer noopener">{c.case}<b>↗</b></a><a href="#top">{c.back}<b>↑</b></a></div>
    <footer><span>VIBE—UPGRADER</span><Mark /><span>VISUAL / INTERACTION / MOTION</span></footer>
  </section>
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('zh')
  useEffect(() => { document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en' }, [locale])
  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])
  return <><Header locale={locale} onLocale={() => setLocale(v => v === 'zh' ? 'en' : 'zh')} /><main><Hero locale={locale} /><Compare locale={locale} /><Capabilities locale={locale} /><Scope locale={locale} /><Process locale={locale} /><Final locale={locale} /></main></>
}
