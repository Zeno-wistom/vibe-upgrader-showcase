import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import './styles.css'

type Locale = 'zh' | 'en'
type Track = 'standard' | 'experimental'
type Mechanism = 'hierarchy' | 'feedback' | 'motion'

const copy = {
  zh: {
    nav: ['看升级', '怎么选', '现场试'],
    switchLanguage: 'Switch to English',
    hero: {
      eyebrow: 'VIBE-UPGRADER 1.0 / 创意前端升级系统',
      title: '把一个普通网页，\n升级成值得记住的产品。',
      body: '它会帮你找参考、选机制、控制特效范围，再把真正有用的部分做进网站。',
      action: '先看一次升级',
      aside: '不是换个配色。\n不是堆一层特效。\n是重新组织重点、空间和反馈。',
      scroll: '向下滚动，亲手试试',
    },
    compare: {
      index: '01 / 这东西到底干嘛',
      title: '先别听解释。\n拖一下。',
      intro: '左边是 Vibe-Upgrader 处理后的版本，右边是原来的“能用”页面。内容没变，体验变了。',
      before: '升级前',
      after: '升级后',
      drag: '拖动对比',
      ordinary: '一个普通的项目后台',
      upgraded: '重点更清楚，操作更有反馈，品牌也有了记忆点。',
    },
    tracks: {
      index: '02 / 不是每次都要大改',
      title: '先决定，\n这次改多大。',
      intro: 'Standard 保留原来的产品，只把关键位置做精；Experimental 单独试一个大胆机制，通过人工确认后才会进入正式页面。',
      standard: 'Standard / 标准轨',
      standardDesc: '适合真实产品：范围小、风险低、提升清楚。',
      experimental: 'Experimental / 实验轨',
      experimentalDesc: '适合探索：只试一个强机制，先隔离，再决定。',
      current: '你现在看到',
      standardResult: '布局不推翻，只把信息层级、主按钮和反馈做清楚。',
      experimentalResult: '同一个界面被拆成空间层，形成一次更大胆的滚动叙事。',
    },
    flow: {
      index: '03 / 特效不是想用就用',
      title: '每个想法，\n都要过关。',
      intro: '拖动下面的判断轴，看一个效果怎样从“找到”走到“采用、拒绝或自己重做”。',
      hint: '拖动判断轴推进',
      result: '当前结论',
    },
    lab: {
      index: '04 / 现在你来升级',
      title: '三个开关，\n只服务一个界面。',
      intro: '三个开关默认关闭。逐个加入后，你看到的不是三套独立特效，而是同一个界面逐步完成升级。',
      hierarchy: '信息层级',
      hierarchyDesc: '拉开标题、内容与操作的主次',
      feedback: '操作反馈',
      feedbackDesc: '让按钮、进度和当前任务及时回应操作',
      motion: '响应节奏',
      motionDesc: '让界面对你的动作有克制的回应',
      on: '已加入',
      off: '点击加入',
      score: '完成度',
      decisions: '真实候选判断',
      adopted: '采用并改造',
      rejected: '拒绝',
      custom: '定制实现',
    },
    final: {
      index: '05 / 一句话总结',
      title: 'Vibe-Upgrader 不负责把网站变花。\n它负责把网站变得更像一个成品。',
      body: '找到值得借鉴的机制，拒绝不合适的效果，再把剩下的做成统一、可用、可维护的体验。',
      github: '查看 GitHub 仓库',
      case: '查看 AIGC 真实案例',
      back: '回到顶部',
    },
  },
  en: {
    nav: ['See it', 'Decide', 'Try it'],
    switchLanguage: '切换为中文',
    hero: {
      eyebrow: 'VIBE-UPGRADER 1.0 / CREATIVE FRONTEND UPGRADE SYSTEM',
      title: 'Turn an ordinary website\ninto a product worth remembering.',
      body: 'It finds references, selects mechanisms, controls scope, and builds only what genuinely improves the product.',
      action: 'See the upgrade',
      aside: 'Not a new color palette.\nNot a pile of effects.\nA clearer hierarchy, space and response.',
      scroll: 'Scroll down and try it',
    },
    compare: {
      index: '01 / WHAT IT ACTUALLY DOES',
      title: 'Skip the explanation.\nDrag this.',
      intro: 'The left side is the Vibe-Upgrader result. The right side is the original usable page. Same product, different experience.',
      before: 'Before', after: 'After', drag: 'Drag to compare', ordinary: 'A generic project dashboard',
      upgraded: 'Clearer priorities, responsive actions and a memorable product voice.',
    },
    tracks: {
      index: '02 / NOT EVERY JOB NEEDS A REBUILD', title: 'First decide\nhow far to go.',
      intro: 'Standard sharpens a real product in place. Experimental isolates one bold mechanism and waits for human approval.',
      standard: 'Standard track', standardDesc: 'For real products: narrow scope, low risk, visible gain.',
      experimental: 'Experimental track', experimentalDesc: 'For exploration: one strong idea, isolated before approval.',
      current: 'What you are seeing',
      standardResult: 'The layout stays. Hierarchy, primary action and feedback become clearer.',
      experimentalResult: 'The same interface separates into spatial layers for a bolder scroll story.',
    },
    flow: {
      index: '03 / EFFECTS HAVE TO EARN THEIR PLACE', title: 'Every idea\npasses a gate.',
      intro: 'Drag the decision rail to see how an effect moves from discovery to adoption, rejection or a custom build.', hint: 'Drag the decision rail', result: 'Decision',
    },
    lab: {
      index: '04 / UPGRADE IT YOURSELF', title: 'Three controls.\nOne interface.',
      intro: 'All three controls start off. Add them one by one to upgrade the same interface into one coherent system.',
      hierarchy: 'Hierarchy', hierarchyDesc: 'Separate title, content and action', feedback: 'Action feedback', feedbackDesc: 'Let actions, progress and current state respond clearly',
      motion: 'Response rhythm', motionDesc: 'Let the surface answer your movement', on: 'Added', off: 'Add it', score: 'Finish',
      decisions: 'Real candidate decisions', adopted: 'Adapted', rejected: 'Rejected', custom: 'Custom-built',
    },
    final: {
      index: '05 / IN ONE SENTENCE', title: 'Vibe-Upgrader does not make websites louder.\nIt makes them feel finished.',
      body: 'Find a useful mechanism, reject what does not fit, and turn the rest into one usable, maintainable experience.',
      github: 'View on GitHub', case: 'View real-world AIGC case', back: 'Back to top',
    },
  },
} as const

const flow = {
  zh: [
    ['01', '找到参考', '从 MotionSites 和组件库里，只找和当前问题有关的案例。', '候选进入'],
    ['02', '判断适配', '这个效果是否真的让重点更清楚？是否破坏原产品？', '继续评估'],
    ['03', '采用 Blur', '保留“柔焦后显现”的感觉，但重写成符合本页的原生动画。', '采用并改造'],
    ['04', '拒绝 Threads', '它很抢眼，但会把产品变成一张粒子海报，和任务无关。', '明确拒绝'],
    ['05', '定制主机制', '参考空间分层的思路，自己做出前后对比和轨道切换。', '定制实现'],
    ['06', '人工批准', '构建通过只能证明能运行；好不好看，最后仍然由人决定。', '等待你的判断'],
  ],
  en: [
    ['01', 'Retrieve', 'Search only MotionSites and registry examples related to the current problem.', 'Candidate in'],
    ['02', 'Evaluate', 'Does it clarify the product? Does it break the existing experience?', 'Under review'],
    ['03', 'Adapt Blur', 'Keep the soft reveal, then rebuild it as a native motion that fits this page.', 'Adapted'],
    ['04', 'Reject Threads', 'It looks impressive but turns the product into an unrelated particle poster.', 'Rejected'],
    ['05', 'Build custom', 'Use the idea of spatial layers to create a purpose-built comparison and track switch.', 'Custom-built'],
    ['06', 'Human gate', 'A passing build proves it runs. A person still decides whether it feels right.', 'Waiting for you'],
  ],
} as const

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
}

function ProductSurface({ upgraded = false, experimental = false, mechanisms = [] }: { upgraded?: boolean; experimental?: boolean; mechanisms?: Mechanism[] }) {
  const has = (key: Mechanism) => mechanisms.includes(key)
  return (
    <div className={`product-surface ${upgraded ? 'is-upgraded' : ''} ${experimental ? 'is-experimental' : ''} ${has('hierarchy') ? 'has-hierarchy' : ''} ${has('feedback') ? 'has-feedback' : ''} ${has('motion') ? 'has-motion' : ''}`}>
      <aside className="product-nav"><BrandMark /><span className="nav-line active" /><span className="nav-line" /><span className="nav-line" /><span className="nav-line short" /></aside>
      <div className="product-main">
        <div className="product-top"><span>PROJECT / 08</span><i /><i /></div>
        <div className="product-heading"><div><small>ACTIVE WORKSPACE</small><strong>Northstar</strong></div><button type="button">New project <b>↗</b></button></div>
        <div className="product-metric"><span>Completion</span><strong>74<small>%</small></strong><i><b /></i></div>
        <div className="product-list">
          <div><span>01</span><strong>Research system</strong><small>Complete</small></div>
          <div><span>02</span><strong>Interface direction</strong><small>In progress</small></div>
          <div><span>03</span><strong>Motion language</strong><small>Next</small></div>
        </div>
      </div>
      <div className="surface-feedback" aria-hidden="true"><span>Saved</span><i /></div>
    </div>
  )
}

function Header({ locale, onLocale }: { locale: Locale; onLocale: () => void }) {
  const c = copy[locale]
  return <header className="site-header">
    <a href="#top" className="brand"><BrandMark /><span>VIBE—UPGRADER</span></a>
    <nav aria-label={locale === 'zh' ? '主导航' : 'Primary navigation'}><a href="#compare">{c.nav[0]}</a><a href="#flow">{c.nav[1]}</a><a href="#lab">{c.nav[2]}</a></nav>
    <button className="language-switch" type="button" onClick={onLocale} aria-label={c.switchLanguage}><b>{locale === 'zh' ? '中' : 'EN'}</b><i />{locale === 'zh' ? 'EN' : '中文'}</button>
  </header>
}

function Hero({ locale }: { locale: Locale }) {
  const c = copy[locale].hero
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let raf = 0
    const update = () => {
      const rect = element.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)))
      element.style.setProperty('--hero-progress', progress.toFixed(3))
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
  const moveHero = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--hero-x', (((event.clientX - rect.left) / rect.width) - .5).toFixed(3))
    event.currentTarget.style.setProperty('--hero-y', (((event.clientY - Math.max(0, rect.top)) / innerHeight) - .5).toFixed(3))
  }
  return <section className="hero" id="top" ref={ref} onPointerMove={moveHero}>
    <div className="hero-sticky">
      <div className="hero-grid" />
      <div className="hero-copy">
        <p className="eyebrow">{c.eyebrow}</p>
        <div className="hero-name" aria-label="Vibe-Upgrader"><span>VIBE</span><span>UPGRADER</span></div>
        <h1>{c.title.split('\n').map((line, index) => <span key={line} className={index ? 'accent-line' : ''}>{line}</span>)}</h1>
        <div className="hero-support"><p>{c.body}</p><a href="#compare">{c.action}<b>↓</b></a></div>
      </div>
      <div className="hero-core" aria-hidden="true"><BrandMark /><span>UPGRADE / ACTIVE</span><b>{locale === 'zh' ? '界面正在重组' : 'INTERFACE REORGANIZING'}</b><i /></div>
      <p className="hero-aside">{c.aside.split('\n').map(line => <span key={line}>{line}</span>)}</p>
      <a className="scroll-prompt" href="#compare"><span>{c.scroll}</span><i><b /><b /></i></a>
      <div className="hero-stamp" aria-hidden="true"><BrandMark /><span>ORDINARY</span><b>→</b><span>MEMORABLE</span></div>
      <div className="hero-route" aria-hidden="true">
        <span><b>01</b>{locale === 'zh' ? '找到合适参考' : 'Find the right reference'}</span>
        <span><b>02</b>{locale === 'zh' ? '判断是否适配' : 'Test the fit'}</span>
        <span><b>03</b>{locale === 'zh' ? '做成统一体验' : 'Build one experience'}</span>
      </div>
    </div>
  </section>
}

function SectionHeading({ index, title, intro, light = false }: { index: string; title: string; intro: string; light?: boolean }) {
  return <div className={`section-heading ${light ? 'is-light' : ''}`}><p>{index}</p><h2>{title.split('\n').map(line => <span key={line}>{line}</span>)}</h2><p>{intro}</p></div>
}

function Compare({ locale }: { locale: Locale }) {
  const [position, setPosition] = useState(9)
  const c = copy[locale].compare
  return <section className="compare-section section-shell" id="compare">
    <SectionHeading index={c.index} title={c.title} intro={c.intro} />
    <div className="compare-wrap" style={{ '--split': `${position}%` } as CSSProperties}>
      <div className="compare-label after-label"><span>{c.after}</span><b>{c.upgraded}</b></div>
      <div className="compare-label before-label"><span>{c.before}</span><b>{c.ordinary}</b></div>
      <div className="compare-stage before-surface"><ProductSurface /></div>
      <div className="compare-stage after-surface"><ProductSurface upgraded mechanisms={['hierarchy', 'feedback', 'motion']} /></div>
      <div className="compare-divider" aria-hidden="true"><i /><span><b>›</b><b>›</b><b>›</b></span><small>{position < 22 ? c.drag : `${position}%`}</small></div>
      <input aria-label={c.drag} type="range" min="5" max="95" value={position} onChange={event => setPosition(Number(event.target.value))} />
      <p className="drag-hint">{locale === 'zh' ? '向右拖动，逐步完成升级' : 'Drag right to reveal the upgrade'} →</p>
    </div>
  </section>
}

function Tracks({ locale }: { locale: Locale }) {
  const [track, setTrack] = useState<Track>('standard')
  const c = copy[locale].tracks
  return <section className={`tracks-section ${track}`} id="tracks">
    <div className="section-shell">
      <SectionHeading index={c.index} title={c.title} intro={c.intro} light />
      <div className="track-console">
        <div className="track-controls" role="tablist" aria-label={locale === 'zh' ? '选择升级轨道' : 'Choose an upgrade track'}>
          <button role="tab" aria-selected={track === 'standard'} onClick={() => setTrack('standard')}><span>01</span><strong>{c.standard}</strong><small>{c.standardDesc}</small></button>
          <button role="tab" aria-selected={track === 'experimental'} onClick={() => setTrack('experimental')}><span>02</span><strong>{c.experimental}</strong><small>{c.experimentalDesc}</small></button>
        </div>
        <div className="track-demo">
          <div className="track-status"><span>{c.current}</span><strong>{track === 'standard' ? c.standard : c.experimental}</strong><p>{track === 'standard' ? c.standardResult : c.experimentalResult}</p></div>
          <div className="track-product"><ProductSurface upgraded experimental={track === 'experimental'} mechanisms={track === 'standard' ? ['hierarchy'] : ['hierarchy', 'motion']} /></div>
          <div className="track-axis"><span>{track === 'standard' ? 'CONTROLLED' : 'ISOLATED'}</span><i /><b>{track === 'standard' ? 'LOCAL UPGRADE' : 'HUMAN GATE'}</b></div>
        </div>
      </div>
    </div>
  </section>
}

function DecisionFlow({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const c = copy[locale].flow
  const steps = flow[locale]
  const current = steps[active]
  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.type === 'pointermove' && event.buttons !== 1) return
    const rect = event.currentTarget.getBoundingClientRect()
    const next = Math.round(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)) * 5)
    setActive(next)
    if (event.type === 'pointerdown') {
      setHasInteracted(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }
  return <section className="flow-section section-shell" id="flow">
    <SectionHeading index={c.index} title={c.title} intro={c.intro} />
    <div className="decision-machine" style={{ '--decision': active } as CSSProperties}>
      <div className="decision-dragger" onPointerDown={updateFromPointer} onPointerMove={updateFromPointer}>
        <div className="decision-nodes" aria-hidden="true">{steps.map((step, index) => <div key={step[0]} className={active === index ? 'is-active' : ''}><span>{step[0]}</span><strong>{step[1]}</strong></div>)}</div>
        <i className={`decision-cursor${hasInteracted ? ' is-used' : ''}`}><b>↔</b></i>
        <input type="range" min="0" max="5" step="1" value={active} onChange={event => { setHasInteracted(true); setActive(Number(event.target.value)) }} aria-label={locale === 'zh' ? '拖动查看决策步骤' : 'Drag through decision steps'} />
      </div>
      <div className={`decision-readout decision-${active}`} role="tabpanel" aria-live="polite">
        <div className="decision-count"><span>{current[0]}</span><small>/ 06</small></div>
        <div><p>{current[1]}</p><h3>{current[2]}</h3></div>
        <div className="decision-result"><span>{c.result}</span><strong>{current[3]}</strong></div>
        <i className="decision-sweep" />
      </div>
    </div>
  </section>
}

function MechanismLab({ locale }: { locale: Locale }) {
  const c = copy[locale].lab
  const [active, setActive] = useState<Mechanism[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const mechanisms: { id: Mechanism; name: string; desc: string }[] = [
    { id: 'hierarchy', name: c.hierarchy, desc: c.hierarchyDesc },
    { id: 'feedback', name: c.feedback, desc: c.feedbackDesc },
    { id: 'motion', name: c.motion, desc: c.motionDesc },
  ]
  const toggle = (id: Mechanism) => setActive(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.style.setProperty('--px', `${x}px`)
    event.currentTarget.style.setProperty('--py', `${y}px`)
    event.currentTarget.style.setProperty('--rx', `${((x / rect.width) - .5) * 2}`)
    event.currentTarget.style.setProperty('--ry', `${((y / rect.height) - .5) * 2}`)
  }
  const score = 40 + active.length * 20
  return <section className="lab-section" id="lab"><div className="section-shell">
    <SectionHeading index={c.index} title={c.title} intro={c.intro} light />
    <div className="mechanism-lab">
      <div className="mechanism-controls">{mechanisms.map((item, index) => {
        const enabled = active.includes(item.id)
        return <button key={item.id} type="button" aria-pressed={enabled} onClick={() => toggle(item.id)}><span>0{index + 1}</span><div><strong>{item.name}</strong><small>{item.desc}</small></div><b>{enabled ? c.on : c.off}</b><i /></button>
      })}</div>
      <div className="lab-canvas" ref={canvasRef} onPointerMove={move}>
        <div className="lab-score"><span>{c.score}<em>{active.length}/3 {locale === 'zh' ? '已加入' : 'active'}</em></span><strong>{score}</strong><small>/100</small></div>
        <ProductSurface upgraded={active.length > 0} mechanisms={active} />
        <p>{active.includes('motion') ? 'MOVE / POINTER' : locale === 'zh' ? '开启“响应节奏”后移动指针' : 'Enable response rhythm, then move'}</p>
      </div>
    </div>
    <div className="candidate-ledger">
      <p>{c.decisions}</p>
      <div><span>BlurText</span><b className="yes">{c.adopted}</b><small>Soft reveal → native CSS</small></div>
      <div><span>SpotlightCard</span><b className="no">{c.rejected}</b><small>Pointer glow adds no task value</small></div>
      <div><span>ScrollStack</span><b className="no">{c.rejected}</b><small>Competes with main story</small></div>
      <div><span>TiltedCard</span><b className="no">{c.rejected}</b><small>Repeats old experiment</small></div>
      <div><span>Spatial system</span><b className="custom">{c.custom}</b><small>MotionSites → own mechanism</small></div>
    </div>
  </div></section>
}

function FinalCTA({ locale }: { locale: Locale }) {
  const c = copy[locale].final
  return <section className="final-section" id="github"><div className="final-grid" /><p>{c.index}</p><h2>{c.title.split('\n').map(line => <span key={line}>{line}</span>)}</h2><div className="final-bottom"><p>{c.body}</p><div className="final-actions"><a href="https://github.com/Zeno-wistom/vibe-upgrader" target="_blank" rel="noreferrer noopener">{c.github}<b>↗</b></a><a href="https://vibe-upgrader-aigc-case.vercel.app/" target="_blank" rel="noreferrer noopener">{c.case}<b>↗</b></a><a href="#top">{c.back}<b>↑</b></a></div></div><footer><span>VIBE-UPGRADER</span><BrandMark /><span>V1.0 / SHOWCASE</span></footer></section>
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('zh')
  useEffect(() => { document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en' }, [locale])
  return <><Header locale={locale} onLocale={() => setLocale(locale === 'zh' ? 'en' : 'zh')} /><main><Hero locale={locale} /><Compare locale={locale} /><Tracks locale={locale} /><DecisionFlow locale={locale} /><MechanismLab locale={locale} /><FinalCTA locale={locale} /></main></>
}
