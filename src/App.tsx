import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import './styles.css'

type Locale = 'zh' | 'en'
type Capability = 'hierarchy' | 'workflow' | 'feedback' | 'motion'
type Track = 'standard' | 'experimental'
type ReviewState = 'idle' | 'processing' | 'done'

const INSTALL_COMMAND = 'git clone https://github.com/Zeno-wistom/vibe-upgrader.git ~/.codex/skills/vibe-upgrader'

const copy = {
  zh: {
    nav: ['升级前后', '能力范围', '双轨选择', '使用方法'],
    language: 'Switch to English',
    hero: {
      product: 'Vibe-Upgrader 1.0',
      title: '让真实前端项目，更清楚、更顺手、更有记忆点。',
      position: '面向真实前端项目的 UI/UX、视觉、交互与动效升级 Skill。',
      body: '用于升级视觉层级、操作路径、交互反馈与动效语言，并在真实项目约束内完成可验证交付。',
      primary: '拖动查看真实升级',
      secondary: '查看如何使用',
      standard: ['Standard', '受控修改真实页面'],
      experimental: ['Experimental', '隔离验证一个强机制'],
      start: ['开始使用', 'Clone Skill', '显式调用 $vibe-upgrader', '描述页面、范围与验收'],
      workspace: '当前工作区',
      project: 'NORTHSTAR',
      next: '下一项任务',
      working: '界面正在重组',
      complete: '升级完成',
      scroll: '继续滚动，查看界面完成重组',
      labels: ['信息层级', '操作路径', '状态反馈', '动效语言'],
    },
    compare: {
      index: '01 / 升级前后',
      title: '同一个产品，升级前后差在哪？',
      body: '拖动中间手柄，比较同一项目在信息层级、操作路径、状态反馈和界面节奏上的变化。',
      before: '升级前：信息平铺',
      after: '升级后：任务驱动',
      slider: '拖动比较升级前后',
      drag: '拖动',
      signals: [
        ['重点', '打开页面即可看到下一项关键任务'],
        ['路径', '高频评审从三步收敛为一步'],
        ['反馈', '处理中、完成和下一步都有明确状态'],
        ['动效', '变化过程帮助用户理解空间与结果'],
      ],
      review: {
        action: '完成评审',
        processing: '正在保存',
        done: '评审已完成',
        toast: '设计评审完成，下一里程碑已解锁',
        queue: {
          label: '评审决策队列',
          count: '3 项',
          ready: '已就绪',
          pending: '待确认',
          confirming: '确认中',
          confirmed: '已确认',
          items: [
            ['信息层级', '主任务已进入首要视线'],
            ['操作路径', '高频操作已缩短至一步'],
            ['动效反馈', '完成状态与下一步已连接'],
          ],
        },
      },
    },
    capabilities: {
      index: '02 / 能力范围',
      title: '它具体能升级哪些体验？',
      body: '四项能力分别对应一个真实问题。选择一项，查看问题、升级动作和用户结果如何连成完整体验。',
      problem: '用户原本遇到的问题',
      change: 'Vibe-Upgrader 做了什么',
      result: '用户最终得到什么',
      live: '实时解释器',
      replay: '重新演示',
      items: {
        hierarchy: {
          label: '信息层级',
          summary: '让用户先看到真正重要的内容。',
          problem: '标题、数据和按钮平均分布，进入页面后需要自己寻找重点。',
          change: '重排大小、位置和对比度，建立“主任务 → 关键数据 → 辅助信息”的视线顺序。',
          result: '用户进入页面即可知道先看哪里、先做什么。',
        },
        workflow: {
          label: '操作路径',
          summary: '把高频操作从三步缩短为一步。',
          problem: '完成一次设计评审需要打开菜单、寻找任务，再进入详情确认。',
          change: '识别高频任务，把入口和上下文一起移动到当前工作区。',
          result: '用户在一个位置完成评审，减少寻找和往返。',
        },
        feedback: {
          label: '状态反馈',
          summary: '让点击、处理中、成功和下一步连续可见。',
          problem: '提交后界面没有及时回应，用户不知道是否生效。',
          change: '把操作状态、进度变化、成功结果和下一步组织成一条反馈链。',
          result: '用户随时知道系统正在做什么，以及接下来能做什么。',
        },
        motion: {
          label: '动效语言',
          summary: '用运动解释状态变化和空间关系。',
          problem: '任务完成后内容突然替换，用户容易失去当前焦点。',
          change: '让当前任务完成、进度更新和下一任务接续发生在同一条运动路径上。',
          result: '动效帮助用户看懂刚才发生了什么，以及下一步去哪里。',
        },
      },
    },
    scope: {
      index: '03 / 升级规模',
      title: '这次应该改多大？',
      body: '根据真实页面的风险和视觉目标选择轨道。两种轨道共享质量标准，实施边界不同。',
      current: '本网站这次采用',
      standard: {
        name: 'Standard',
        label: '标准轨',
        short: '在真实产品中受控修改',
        scene: '后台、工具、内容产品与已有业务页面',
        method: '保留现有架构，集中解决关键体验问题。',
        boundary: '直接实施，验证受影响的任务流程。',
        bullets: ['保留产品架构', '聚焦关键界面', '低风险直接验证'],
      },
      experimental: {
        name: 'Experimental',
        label: '实验轨',
        short: '先在隔离环境验证一个强机制',
        scene: '品牌首屏、叙事页面与非标准交互',
        method: '一次验证一个高影响机制，保持正式产品稳定。',
        boundary: '人工批准后再整合，并完成完整回归。',
        bullets: ['单一核心机制', '隔离预览验证', '人工门禁批准'],
      },
      sceneLabel: '适用场景',
      methodLabel: '改造方式',
      boundaryLabel: '风险边界',
    },
    process: {
      index: '04 / 完成路径',
      title: '从需求到可验证交付，分四步完成。',
      body: '一个真实工作项沿同一条轨道前进，每一步都产生清楚的判断和可检查结果。',
      current: '当前阶段',
      steps: [
        {
          label: '理解页面',
          body: '读取内容、用户任务、现有架构和不能改变的边界。',
          result: '得到真实问题与修改范围。',
        },
        {
          label: '选择机制',
          body: '只评估与当前问题相关的参考、组件或定制方案。',
          result: '候选收敛为一个可实施方向。',
        },
        {
          label: '统一实现',
          body: '让视觉、交互和动效共用一套界面语言与状态逻辑。',
          result: '形成可以实际操作的完整体验。',
        },
        {
          label: '验证交付',
          body: '检查真实流程、响应式、键盘、动效回退与视觉结果。',
          result: '交付可运行、可理解、可维护的升级。',
        },
      ],
    },
    final: {
      product: 'Vibe-Upgrader 1.0',
      title: '把你的真实页面交给 Vibe-Upgrader。',
      body: '显式调用 Skill，说明页面、范围、必须保留的内容和验收标准，即可开始一次受控升级。',
      steps: [
        ['01', 'Clone Skill', '将仓库克隆到 Codex Skills 目录。'],
        ['02', '显式调用', '在任务中输入 $vibe-upgrader。'],
        ['03', '描述升级', '说明页面、范围、保留内容和验收标准。'],
      ],
      install: '安装命令',
      invoke: '调用示例',
      prompt: '升级这个仪表盘的搜索、筛选和批量操作区域。保留其余页面，并以真实任务流程作为验收标准。',
      copy: '复制命令',
      copied: '已复制',
      github: '在 GitHub 开始使用',
      case: '查看真实 AIGC 案例',
      back: '回到顶部',
    },
  },
  en: {
    nav: ['Before & after', 'Capabilities', 'Tracks', 'How to use'],
    language: '切换为中文',
    hero: {
      product: 'Vibe-Upgrader 1.0',
      title: 'Make real interfaces clear, smooth, and memorable.',
      position: 'A Skill for upgrading UI/UX, visuals, interaction, and motion in real frontend projects.',
      body: 'It improves hierarchy, workflows, feedback, and motion language within real project constraints—and delivers verifiable results.',
      primary: 'Drag through a real upgrade',
      secondary: 'See how to use it',
      standard: ['Standard', 'Controlled changes in the real product'],
      experimental: ['Experimental', 'One bold mechanism, isolated first'],
      start: ['Get started', 'Clone the Skill', 'Invoke $vibe-upgrader', 'Describe scope and acceptance'],
      workspace: 'ACTIVE WORKSPACE',
      project: 'NORTHSTAR',
      next: 'NEXT ACTION',
      working: 'INTERFACE REORGANIZING',
      complete: 'UPGRADE COMPLETE',
      scroll: 'Keep scrolling to complete the reorganization',
      labels: ['Hierarchy', 'Workflow', 'Feedback', 'Motion language'],
    },
    compare: {
      index: '01 / BEFORE & AFTER',
      title: 'What improves in the same product?',
      body: 'Drag the center handle to compare hierarchy, workflow, feedback, and motion in the same project.',
      before: 'Before: everything at once',
      after: 'After: task-driven',
      slider: 'Compare the interface before and after upgrade',
      drag: 'Drag',
      signals: [
        ['Priority', 'The next important task is visible immediately'],
        ['Workflow', 'A frequent three-step review becomes one step'],
        ['Feedback', 'Processing, success, and next steps are explicit'],
        ['Motion', 'Movement explains spatial and state changes'],
      ],
      review: {
        action: 'Complete review',
        processing: 'Saving',
        done: 'Review complete',
        toast: 'Design review complete. The next milestone is unlocked.',
        queue: {
          label: 'REVIEW QUEUE',
          count: '3 ITEMS',
          ready: 'Ready',
          pending: 'To confirm',
          confirming: 'Confirming',
          confirmed: 'Confirmed',
          items: [
            ['Information hierarchy', 'Primary task leads the visual order'],
            ['Action workflow', 'Frequent action reduced to one step'],
            ['Motion feedback', 'Completion now connects to what comes next'],
          ],
        },
      },
    },
    capabilities: {
      index: '02 / CAPABILITIES',
      title: 'What experiences can it upgrade?',
      body: 'Each capability solves a concrete problem. Select one to see the problem, intervention, and user result as one experience.',
      problem: 'The original problem',
      change: 'What Vibe-Upgrader changes',
      result: 'What the user gets',
      live: 'LIVE EXPLAINER',
      replay: 'Replay',
      items: {
        hierarchy: {
          label: 'Information hierarchy',
          summary: 'Guide attention to what matters first.',
          problem: 'Headings, data, and actions carry equal weight, so users must search for the priority.',
          change: 'Recompose size, position, and contrast into a primary task, key data, and supporting information.',
          result: 'Users know where to look and what to do the moment the page opens.',
        },
        workflow: {
          label: 'Action workflow',
          summary: 'Turn a frequent three-step task into one.',
          problem: 'A design review requires opening a menu, finding the task, and entering its detail page.',
          change: 'Move the frequent action and its context into the active workspace.',
          result: 'Users complete the review in one place with less searching and backtracking.',
        },
        feedback: {
          label: 'State feedback',
          summary: 'Connect click, processing, success, and the next step.',
          problem: 'After submitting, the interface stays silent and users cannot tell whether it worked.',
          change: 'Organize action state, progress, success, and the next step into one feedback chain.',
          result: 'Users always know what the system is doing and what they can do next.',
        },
        motion: {
          label: 'Motion language',
          summary: 'Use movement to explain state and spatial relationships.',
          problem: 'Content swaps abruptly after completion, causing users to lose their point of focus.',
          change: 'Move task completion, progress update, and the next task along one continuous path.',
          result: 'Motion explains what just happened and where to go next.',
        },
      },
    },
    scope: {
      index: '03 / SCOPE',
      title: 'How much should change?',
      body: 'Choose a track from the real page risk and visual goal. Both tracks share a quality bar and differ in integration boundaries.',
      current: 'THIS SHOWCASE CURRENTLY USES',
      standard: {
        name: 'Standard',
        label: 'STANDARD TRACK',
        short: 'Controlled changes inside the real product',
        scene: 'Dashboards, tools, content products, and existing business pages',
        method: 'Preserve the architecture and solve the critical experience problem.',
        boundary: 'Implement directly and verify the affected task flow.',
        bullets: ['Keep the product architecture', 'Focus the critical surface', 'Verify with low integration risk'],
      },
      experimental: {
        name: 'Experimental',
        label: 'EXPERIMENTAL TRACK',
        short: 'Prove one bold mechanism in isolation',
        scene: 'Brand heroes, narrative pages, and non-standard interaction',
        method: 'Test one high-impact mechanism while the formal product stays stable.',
        boundary: 'Integrate after human approval, then run targeted regression checks.',
        bullets: ['One core mechanism', 'Isolated preview', 'Human approval gate'],
      },
      sceneLabel: 'Best for',
      methodLabel: 'How it changes',
      boundaryLabel: 'Risk boundary',
    },
    process: {
      index: '04 / DELIVERY PATH',
      title: 'Four steps from request to verified delivery.',
      body: 'A real work item moves along one track. Every stage creates a clear decision and a checkable result.',
      current: 'CURRENT STAGE',
      steps: [
        {
          label: 'Understand the page',
          body: 'Read the content, user task, current architecture, and preserved boundaries.',
          result: 'A verified problem and change boundary.',
        },
        {
          label: 'Choose the mechanism',
          body: 'Evaluate only references, components, or custom work that fit the current problem.',
          result: 'Candidates converge on one implementable direction.',
        },
        {
          label: 'Build one system',
          body: 'Give visuals, interaction, and motion one interface language and state model.',
          result: 'A complete experience users can operate.',
        },
        {
          label: 'Verify and deliver',
          body: 'Check the real flow, responsive states, keyboard, motion fallback, and visual result.',
          result: 'A runnable, understandable, maintainable upgrade.',
        },
      ],
    },
    final: {
      product: 'Vibe-Upgrader 1.0',
      title: 'Bring your real page to Vibe-Upgrader.',
      body: 'Invoke the Skill explicitly, then describe the page, scope, preserved content, and acceptance criteria.',
      steps: [
        ['01', 'Clone the Skill', 'Clone the repository into your Codex Skills directory.'],
        ['02', 'Invoke explicitly', 'Type $vibe-upgrader in your task.'],
        ['03', 'Describe the upgrade', 'Name the page, scope, preserved content, and acceptance criteria.'],
      ],
      install: 'INSTALL',
      invoke: 'INVOCATION EXAMPLE',
      prompt: 'Upgrade the search, filters, and bulk actions in this dashboard. Preserve the rest of the product and verify the real task flow.',
      copy: 'Copy command',
      copied: 'Copied',
      github: 'Start on GitHub',
      case: 'View the real AIGC case',
      back: 'Back to top',
    },
  },
} as const

function Mark() {
  return <span className="mark" aria-hidden="true"><i /><i /><i /></span>
}

function Header({ locale, onLocale }: { locale: Locale; onLocale: () => void }) {
  const c = copy[locale]
  return <header className="header">
    <a className="brand" href="#top"><Mark /><b>VIBE—UPGRADER</b></a>
    <nav aria-label={locale === 'zh' ? '主导航' : 'Primary navigation'}>
      <a href="#compare">{c.nav[0]}</a>
      <a href="#capabilities">{c.nav[1]}</a>
      <a href="#scope">{c.nav[2]}</a>
      <a href="#start">{c.nav[3]}</a>
    </nav>
    <button type="button" className="language" onClick={onLocale} aria-label={c.language}>
      <b>{locale === 'zh' ? '中' : 'EN'}</b><i />{locale === 'zh' ? 'EN' : '中'}
    </button>
  </header>
}

function Hero({ locale }: { locale: Locale }) {
  const c = copy[locale].hero
  const root = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element) return
    if (reduced) {
      setProgress(1)
      return
    }
    let raf = 0
    const update = () => {
      const rect = element.getBoundingClientRect()
      const next = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)))
      setProgress(Number(next.toFixed(3)))
      raf = 0
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - .5).toFixed(3))
    event.currentTarget.style.setProperty('--my', ((event.clientY - Math.max(0, rect.top)) / innerHeight - .5).toFixed(3))
  }

  const value = reduced ? 100 : Math.round(74 + 26 * Math.pow(progress, 1.22))
  const complete = value === 100
  const style = {
    '--hero-p': progress,
    '--hero-fill': `${value}%`,
  } as CSSProperties

  return <section className={`hero${complete ? ' is-complete' : ''}${reduced ? ' is-reduced' : ''}`} id="top" ref={root} onPointerMove={move} style={style}>
    <div className="hero-sticky">
      <div className="grid-bg" />
      <div className="hero-copy">
        <p className="hero-product"><Mark />{c.product}</p>
        <h1>{locale === 'zh'
          ? <>让真实前端项目，<span>更清楚、更顺手、更有记忆点。</span></>
          : c.title}</h1>
        <p className="hero-position">{c.position}</p>
        <p className="hero-body">{c.body}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#compare">{c.primary}<b>↓</b></a>
          <a className="secondary-action" href="#start">{c.secondary}<b>↗</b></a>
        </div>
        <div className="hero-tracks" aria-label={locale === 'zh' ? '两种升级轨道' : 'Two upgrade tracks'}>
          <div><strong>{c.standard[0]}</strong><span>{c.standard[1]}</span></div>
          <div><strong>{c.experimental[0]}</strong><span>{c.experimental[1]}</span></div>
        </div>
      </div>

      <div className="rebuild" aria-label={`${c.working} ${value}%`}>
        <div className="rebuild-shell">
          <aside><Mark /><i className="active" /><i /><i /></aside>
          <main>
            <span>{c.workspace}</span>
            <strong>{c.project}</strong>
            <div className="rebuild-score" aria-live="polite"><b>{value}</b><small>%</small></div>
            <div className="rebuild-bar"><i /></div>
            <em>{complete ? c.complete : c.working}</em>
          </main>
          <div className="rebuild-action">{c.next}<b>↗</b></div>
          <div className="completion-scan" />
        </div>
        {c.labels.map((label, index) => <span className={`orbit orbit-${index + 1}`} key={label}>{label}</span>)}
      </div>

      <div className="hero-start">
        <strong>{c.start[0]}</strong>
        {c.start.slice(1).map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}
      </div>
      <div className="hero-progress"><span>{complete ? c.complete : c.scroll}</span><i><b /></i><strong>{value}%</strong></div>
    </div>
  </section>
}

function SectionHeading({ index, title, body, light = false }: { index: string; title: string; body: string; light?: boolean }) {
  return <div className={`section-heading${light ? ' is-light' : ''}`}>
    <p>{index}</p>
    <h2>{title}</h2>
    <p>{body}</p>
  </div>
}

function BeforeWorkspace({ locale }: { locale: Locale }) {
  const zh = locale === 'zh'
  const labels = zh
    ? ['完成度', '待办任务', '团队成员', '受阻任务']
    : ['Completion', 'Open tasks', 'Members', 'Blocked']
  return <div className="workspace before-workspace" aria-hidden="true">
    <aside><Mark /><span className="active" /><span /><span /><span /></aside>
    <main>
      <header><div><small>{zh ? '项目管理' : 'PROJECT MANAGEMENT'}</small><strong>{zh ? '北极星项目总览' : 'Northstar Dashboard'}</strong></div><button tabIndex={-1}>{zh ? '+ 新建' : '+ Create'}</button></header>
      <div className="old-filters"><span>{zh ? '总览' : 'Overview'}</span><span>{zh ? '任务' : 'Tasks'}</span><span>{zh ? '报告' : 'Reports'}</span><span>{zh ? '团队' : 'Team'}</span><button tabIndex={-1}>{zh ? '筛选' : 'Filter'}</button></div>
      <div className="old-stats">{['74%', '12', '08', '03'].map((value, index) => <div key={value}><small>{labels[index]}</small><strong>{value}</strong><i /></div>)}</div>
      <div className="old-table">
        <div><b>{zh ? '任务' : 'Task'}</b><b>{zh ? '负责人' : 'Owner'}</b><b>{zh ? '状态' : 'Status'}</b></div>
        <div><span>{zh ? '研究系统' : 'Research system'}</span><span>JR</span><em>{zh ? '完成' : 'Done'}</em></div>
        <div><span>{zh ? '界面方向' : 'Interface direction'}</span><span>MS</span><em>{zh ? '进行中' : 'Working'}</em></div>
        <div><span>{zh ? '动效语言' : 'Motion language'}</span><span>AL</span><em>{zh ? '待处理' : 'Todo'}</em></div>
        <div><span>{zh ? '设计评审' : 'Design review'}</span><span>{zh ? '你' : 'YOU'}</span><em>{zh ? '今天' : 'Today'}</em></div>
      </div>
    </main>
  </div>
}

function AfterWorkspace({
  locale,
  reviewState,
  reviewProgress,
  interactive,
  onReview,
}: {
  locale: Locale
  reviewState: ReviewState
  reviewProgress: number
  interactive: boolean
  onReview: () => void
}) {
  const zh = locale === 'zh'
  const c = copy[locale].compare.review
  const reviewStep = reviewState === 'done'
    ? 3
    : reviewState === 'processing'
      ? reviewProgress >= 96 ? 3 : reviewProgress >= 88 ? 2 : reviewProgress >= 80 ? 1 : 0
      : 0
  const statusText = reviewState === 'idle' ? c.action : reviewState === 'processing' ? c.processing : c.done
  const decisionState = (index: number) => {
    if (reviewState === 'done' || index < reviewStep) return 'confirmed'
    if (reviewState === 'processing' && index === reviewStep) return 'current'
    return index < 2 ? 'ready' : 'pending'
  }
  const decisionStatus = (index: number) => {
    const state = decisionState(index)
    if (state === 'confirmed') return c.queue.confirmed
    if (state === 'current') return c.queue.confirming
    return state === 'ready' ? c.queue.ready : c.queue.pending
  }
  return <div className={`workspace after-workspace review-${reviewState}`} style={{ '--review-progress': `${reviewProgress}%` } as CSSProperties}>
    <aside><Mark /><span className="nav-active">⌂</span><span>◇</span><span>↗</span><b>NS</b></aside>
    <main>
      <header><div><small>{zh ? '星期一 / 当前工作区' : 'MONDAY / ACTIVE WORKSPACE'}</small><strong>{zh ? '推进北极星计划' : 'Move Northstar forward'}</strong></div><div className="team"><i>JR</i><i>MS</i><i>+3</i></div></header>
      <section className="focus-card" data-review-step={reviewStep}>
        <div className="focus-copy">
          <small>{zh ? '下一项关键任务' : 'NEXT IMPORTANT TASK'}</small>
          <h3>{reviewState === 'done' ? c.done : (zh ? '设计评审' : 'Design review')}</h3>
          <p>{reviewState === 'done' ? (zh ? '三项决策已经确认，下一里程碑可以继续推进。' : 'All three decisions are confirmed. The next milestone is ready.') : (zh ? '确认三个关键体验决策，预计 8 分钟。' : 'Confirm three key experience decisions. Estimated time: 8 min.')}</p>
        </div>
        <div className="review-queue" aria-live="polite">
          <header><span>{c.queue.label}</span><strong>{c.queue.count}</strong></header>
          <ol>
            {c.queue.items.map((item, index) => {
              const state = decisionState(index)
              return <li className={`is-${state}`} key={item[0]}>
                <span>0{index + 1}</span>
                <div><strong>{item[0]}</strong><small>{item[1]}</small></div>
                <b><i />{decisionStatus(index)}</b>
              </li>
            })}
          </ol>
        </div>
        <div className="review-outcome">
          <div
            className="focus-progress"
            role="progressbar"
            aria-label={zh ? '评审完成进度' : 'Review completion progress'}
            aria-valuemin={74}
            aria-valuemax={100}
            aria-valuenow={reviewProgress}
          >
            <i />
            <div>
              <strong>{reviewProgress}<small>%</small></strong>
              <span>{zh ? '完成度' : 'COMPLETION'}</span>
            </div>
          </div>
          <button
            type="button"
            className={`review-button is-${reviewState}`}
            tabIndex={interactive ? 0 : -1}
            disabled={reviewState !== 'idle'}
            onClick={onReview}
          >
            {reviewState === 'processing' && <i />}
            <span>{statusText}</span>
            <b>{reviewState === 'done' ? '✓' : '→'}</b>
          </button>
        </div>
      </section>
      <section className="after-grid">
        <div className="momentum"><small>{zh ? '本周进展' : 'WEEKLY MOMENTUM'}</small><strong>+18%</strong><svg viewBox="0 0 240 70" preserveAspectRatio="none"><path d="M0 58 C30 55 34 48 60 50 S94 44 116 37 S150 46 173 25 S206 22 240 8" /></svg></div>
        <div className="quick"><small>{zh ? '快捷操作' : 'QUICK ACTIONS'}</small><button tabIndex={-1}>{zh ? '分享预览' : 'Share preview'} <b>↗</b></button><button tabIndex={-1}>{zh ? '查看决策' : 'Open decisions'} <b>3</b></button></div>
        <div className="activity"><small>{zh ? '实时动态' : 'LIVE ACTIVITY'}</small><p><i />{zh ? '导航问题已解决' : 'Navigation issue resolved'}</p><p><i />{reviewState === 'done' ? (zh ? '下一里程碑已解锁' : 'Next milestone unlocked') : (zh ? '动效规范已就绪' : 'Motion spec ready')}</p></div>
      </section>
      <div className="success-toast" role="status" aria-live="polite"><b>✓</b><span>{c.toast}</span></div>
    </main>
  </div>
}

function Compare({ locale }: { locale: Locale }) {
  const c = copy[locale].compare
  const frameRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const interactedRef = useRef(false)
  const reviewFrame = useRef<number | null>(null)
  const [position, setPosition] = useState(12)
  const [dragging, setDragging] = useState(false)
  const [hinting, setHinting] = useState(false)
  const [handleY, setHandleY] = useState(0)
  const [reviewState, setReviewState] = useState<ReviewState>('idle')
  const [reviewProgress, setReviewProgress] = useState(74)

  useEffect(() => {
    const element = controlRef.current
    if (!element) return
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting || interactedRef.current) return
      setHinting(true)
      observer.disconnect()
    }, { threshold: .55 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => {
    if (reviewFrame.current !== null) cancelAnimationFrame(reviewFrame.current)
  }, [])

  const setFromClientX = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    const next = Math.round(Math.min(.95, Math.max(.05, (clientX - rect.left) / rect.width)) * 100)
    setPosition(next)
  }

  const stopHint = () => {
    interactedRef.current = true
    setHinting(false)
  }

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    draggingRef.current = true
    setDragging(true)
    stopHint()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const magnetic = Math.max(-8, Math.min(8, event.clientY - (rect.top + rect.height / 2)))
    setHandleY(magnetic)
    if (draggingRef.current) setFromClientX(event.clientX)
  }

  const pointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) setFromClientX(event.clientX)
    draggingRef.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const keyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = position
    if (event.key === 'ArrowLeft') next = Math.max(5, position - 1)
    else if (event.key === 'ArrowRight') next = Math.min(95, position + 1)
    else if (event.key === 'Home') next = 5
    else if (event.key === 'End') next = 95
    else return
    event.preventDefault()
    stopHint()
    setPosition(next)
  }

  const runReview = () => {
    if (reviewState !== 'idle') return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReviewProgress(100)
      setReviewState('done')
      return
    }

    setReviewState('processing')
    setReviewProgress(74)
    const startedAt = performance.now()
    const duration = 3600
    const advance = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration)
      const eased = elapsed * elapsed * (3 - 2 * elapsed)
      setReviewProgress(Math.round(74 + 26 * eased))
      if (elapsed < 1) {
        reviewFrame.current = requestAnimationFrame(advance)
        return
      }
      reviewFrame.current = null
      setReviewProgress(100)
      setReviewState('done')
    }
    reviewFrame.current = requestAnimationFrame(advance)
  }

  const p = position / 100
  const frameStyle = {
    '--split': `${position}%`,
    '--p': p,
    '--handle-y': `${handleY}px`,
  } as CSSProperties

  return <section className="compare section-pad" id="compare">
    <SectionHeading index={c.index} title={c.title} body={c.body} />
    <div className="compare-frame" ref={frameRef} style={frameStyle}>
      <div className="compare-top"><span>{c.after}</span><span>{c.before}</span></div>
      <div className="compare-canvas">
        <div className="before-layer"><BeforeWorkspace locale={locale} /></div>
        <div className="after-layer"><AfterWorkspace locale={locale} reviewState={reviewState} reviewProgress={reviewProgress} interactive={position > 62} onReview={runReview} /></div>
      </div>
      <div className={`compare-control${dragging ? ' is-dragging' : ''}${hinting ? ' is-hinting' : ''}`}
        ref={controlRef}
        role="slider"
        tabIndex={0}
        aria-label={c.slider}
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={position}
        aria-valuetext={`${position}%`}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerLeave={() => { if (!dragging) setHandleY(0) }}
        onFocus={stopHint}
        onKeyDown={keyboard}
      >
        <i className="compare-divider" />
        <span className="compare-handle"><b>‹</b><i /><b>›</b></span>
        <small>{dragging ? `${position}%` : position < 22 ? c.drag : `${position}%`}</small>
      </div>
    </div>
    <div className="signal-row">{c.signals.map((item, index) => <article key={item[0]} className={position > 18 + index * 18 ? 'is-active' : ''}><span>0{index + 1}</span><div><strong>{item[0]}</strong><p>{item[1]}</p></div></article>)}</div>
  </section>
}

function HierarchyScene({ locale }: { locale: Locale }) {
  const zh = locale === 'zh'
  return <div className="cap-scene hierarchy-scene">
    <div className="hierarchy-before"><small>{zh ? '原来：全部同权重' : 'BEFORE: EQUAL WEIGHT'}</small><i /><i /><i /></div>
    <b className="scene-arrow">→</b>
    <div className="hierarchy-after">
      <div className="gaze-order"><span>1</span><i /><span>2</span><i /><span>3</span></div>
      <article><small>{zh ? '下一项关键任务' : 'NEXT IMPORTANT TASK'}</small><strong>{zh ? '批准最终体验' : 'Approve final experience'}</strong><button>{zh ? '现在评审' : 'Review now'} →</button></article>
      <aside><div><small>{zh ? '完成度' : 'PROGRESS'}</small><strong>92%</strong></div><p>{zh ? '辅助信息降低层级' : 'Supporting information recedes'}</p></aside>
    </div>
  </div>
}

function WorkflowScene({ locale }: { locale: Locale }) {
  const zh = locale === 'zh'
  const before = zh ? ['打开项目菜单', '找到设计评审', '进入详情确认'] : ['Open project menu', 'Find design review', 'Open details and confirm']
  return <div className="cap-scene workflow-scene">
    <div className="workflow-path old-path"><small>{zh ? '原来：3 步' : 'BEFORE: 3 STEPS'}</small>{before.map((item, index) => <div key={item}><span>0{index + 1}</span><b>{item}</b></div>)}</div>
    <div className="path-collapse"><i /><i /><i /><b>→</b></div>
    <div className="workflow-path new-path"><small>{zh ? '升级后：1 步' : 'AFTER: 1 STEP'}</small><button><span>01</span><b>{zh ? '在当前工作区完成评审' : 'Complete review in this workspace'}</b><strong>→</strong></button><p>{zh ? '任务与上下文在同一个位置。' : 'The task and its context stay together.'}</p></div>
  </div>
}

function FeedbackScene({ locale, phase, onReplay }: { locale: Locale; phase: number; onReplay: () => void }) {
  const zh = locale === 'zh'
  const labels = zh ? ['点击提交', '处理中', '成功', '下一步'] : ['Submit', 'Processing', 'Success', 'Next step']
  return <div className="cap-scene feedback-scene" data-phase={phase}>
    <div className="feedback-chain">{labels.map((label, index) => <div key={label} className={phase >= index ? 'is-reached' : ''}><span>{index + 1}</span><b>{label}</b>{index < 3 && <i />}</div>)}</div>
    <div className="feedback-product">
      <button type="button" onClick={onReplay} className={`phase-${phase}`}>
        {phase === 1 && <i />}
        <span>{phase === 0 ? labels[0] : phase === 1 ? labels[1] : phase === 2 ? labels[2] : labels[3]}</span>
        <b>{phase >= 2 ? '✓' : '→'}</b>
      </button>
      <div className="feedback-progress"><span><i /></span><strong>{phase < 2 ? '74%' : '100%'}</strong></div>
      <p className="feedback-message">{phase < 2 ? (zh ? '系统正在保存这次操作。' : 'The system is saving this action.') : phase === 2 ? (zh ? '保存成功，状态与进度同步更新。' : 'Saved. State and progress update together.') : (zh ? '下一里程碑已经出现，可以继续推进。' : 'The next milestone is visible and ready.')}</p>
    </div>
  </div>
}

function MotionScene({ locale, phase }: { locale: Locale; phase: number }) {
  const zh = locale === 'zh'
  return <div className="cap-scene motion-scene" data-phase={phase}>
    <p>{zh ? '动效帮助用户看懂刚才发生了什么，以及下一步去哪里。' : 'Motion explains what just happened and where the user should go next.'}</p>
    <div className="motion-timeline"><i /><span className="motion-marker" /></div>
    <div className="motion-task task-current"><small>{zh ? '当前任务' : 'CURRENT TASK'}</small><strong>{zh ? '完成设计评审' : 'Complete design review'}</strong><b>{phase >= 1 ? '✓' : '01'}</b></div>
    <div className="motion-progress-card"><small>{zh ? '项目进度' : 'PROJECT PROGRESS'}</small><strong>{phase < 2 ? '74%' : '100%'}</strong><i><b /></i></div>
    <div className="motion-task task-next"><small>{zh ? '下一任务' : 'NEXT TASK'}</small><strong>{zh ? '发布候选版本' : 'Publish release candidate'}</strong><b>02</b></div>
  </div>
}

function Capabilities({ locale }: { locale: Locale }) {
  const c = copy[locale].capabilities
  const keys: Capability[] = ['hierarchy', 'workflow', 'feedback', 'motion']
  const [active, setActive] = useState<Capability>('hierarchy')
  const [feedbackPhase, setFeedbackPhase] = useState(0)
  const [motionPhase, setMotionPhase] = useState(0)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runFeedback = () => {
    setFeedbackPhase(0)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFeedbackPhase(3)
      return () => undefined
    }
    const timers = [
      setTimeout(() => setFeedbackPhase(1), 420),
      setTimeout(() => setFeedbackPhase(2), 1120),
      setTimeout(() => setFeedbackPhase(3), 1840),
    ]
    return () => timers.forEach(clearTimeout)
  }

  useEffect(() => {
    if (active === 'feedback') return runFeedback()
    if (active !== 'motion') return
    setMotionPhase(0)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotionPhase(3)
      return
    }
    const timers = [
      setTimeout(() => setMotionPhase(1), 480),
      setTimeout(() => setMotionPhase(2), 1080),
      setTimeout(() => setMotionPhase(3), 1720),
    ]
    return () => timers.forEach(clearTimeout)
  }, [active])

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }, [])

  const activate = (key: Capability) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setActive(key)
  }
  const preview = (key: Capability) => {
    if (!matchMedia('(hover:hover)').matches) return
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setActive(key), 110)
  }

  const item = c.items[active]
  return <section className="capabilities" id="capabilities"><div className="section-pad">
    <SectionHeading index={c.index} title={c.title} body={c.body} light />
    <div className="capability-layout">
      <div className="capability-tabs" role="tablist" aria-label={c.title}>
        {keys.map((key, index) => {
          const data = c.items[key]
          return <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            aria-controls="capability-panel"
            onMouseEnter={() => preview(key)}
            onFocus={() => activate(key)}
            onClick={() => activate(key)}
          >
            <span>0{index + 1}</span>
            <div><strong>{data.label}</strong><small>{data.summary}</small></div>
            <b>→</b>
          </button>
        })}
      </div>
      <div className={`capability-panel is-${active}`} id="capability-panel" role="tabpanel">
        <div className="capability-panel-head"><span>{c.live}</span><strong>{item.label}</strong></div>
        <div className="capability-explanation" key={`copy-${active}`}>
          <article><span>01</span><small>{c.problem}</small><p>{item.problem}</p></article>
          <article><span>02</span><small>{c.change}</small><p>{item.change}</p></article>
          <article><span>03</span><small>{c.result}</small><p>{item.result}</p></article>
        </div>
        <div className="capability-visual">
          <div className={`scene-layer${active === 'hierarchy' ? ' is-active' : ''}`}><HierarchyScene locale={locale} /></div>
          <div className={`scene-layer${active === 'workflow' ? ' is-active' : ''}`}><WorkflowScene locale={locale} /></div>
          <div className={`scene-layer${active === 'feedback' ? ' is-active' : ''}`}><FeedbackScene locale={locale} phase={feedbackPhase} onReplay={() => { const cleanup = runFeedback(); setTimeout(cleanup, 2400) }} /></div>
          <div className={`scene-layer${active === 'motion' ? ' is-active' : ''}`}><MotionScene locale={locale} phase={motionPhase} /></div>
        </div>
      </div>
    </div>
  </div></section>
}

function Scope({ locale }: { locale: Locale }) {
  const c = copy[locale].scope
  const [track, setTrack] = useState<Track>('standard')
  const active = c[track]
  const choose = (next: Track) => setTrack(next)

  return <section className="scope section-pad" id="scope">
    <SectionHeading index={c.index} title={c.title} body={c.body} />
    <div className={`scope-console track-${track}`}>
      <div className="scope-switch" role="tablist" aria-label={c.title}>
        <i className="scope-active-bg" />
        {(['standard', 'experimental'] as Track[]).map((key, index) => {
          const item = c[key]
          return <button
            key={key}
            type="button"
            role="tab"
            aria-selected={track === key}
            aria-controls="scope-panel"
            onMouseEnter={() => choose(key)}
            onFocus={() => choose(key)}
            onClick={() => choose(key)}
          >
            <span>0{index + 1}</span>
            <div><strong>{item.name}</strong><small>{item.label}</small><p>{item.short}</p></div>
            <b>→</b>
          </button>
        })}
      </div>
      <div className="scope-panel" id="scope-panel" role="tabpanel">
        <div className="scope-diagrams" aria-hidden="true">
          <div className={`scope-diagram standard-diagram${track === 'standard' ? ' is-active' : ''}`}><span>REAL PRODUCT</span><div><i /><i className="focus" /><i /></div><b>CONTROLLED CHANGE</b></div>
          <div className={`scope-diagram experimental-diagram${track === 'experimental' ? ' is-active' : ''}`}><span>ISOLATED PROTOTYPE</span><div><i /><i /><i /></div><b>HUMAN GATE</b></div>
        </div>
        <div className="scope-copy" key={track}>
          <p>{active.short}</p>
          <h3>{active.name} <span>/ {active.label}</span></h3>
          <div className="scope-facts">
            <article><small>{c.sceneLabel}</small><p>{active.scene}</p></article>
            <article><small>{c.methodLabel}</small><p>{active.method}</p></article>
            <article><small>{c.boundaryLabel}</small><p>{active.boundary}</p></article>
          </div>
          <ul>{active.bullets.map(item => <li key={item}><b>✓</b>{item}</li>)}</ul>
        </div>
        <div className="scope-current"><span>{c.current}</span><strong>{active.name.toUpperCase()}</strong><i /></div>
      </div>
    </div>
  </section>
}

function ProcessMini({ index }: { index: number }) {
  if (index === 0) return <div className="mini scan-mini"><i /><span /><span /><span /></div>
  if (index === 1) return <div className="mini choose-mini"><span>A</span><span>B</span><span>C</span><i /><b>A</b></div>
  if (index === 2) return <div className="mini build-mini"><span /><span /><span /><div><i /><i /><i /></div></div>
  return <div className="mini verify-mini"><span>✓</span><span>✓</span><span>✓</span><b>READY</b></div>
}

function Process({ locale }: { locale: Locale }) {
  const c = copy[locale].process
  const [active, setActive] = useState(0)
  return <section className="process" id="process"><div className="section-pad">
    <SectionHeading index={c.index} title={c.title} body={c.body} light />
    <div className="process-system" style={{ '--process-step': active } as CSSProperties}>
      <div className="process-track" aria-hidden="true"><i /><span><Mark /></span></div>
      <div className="process-steps">
        {c.steps.map((step, index) => <article className={active === index ? 'is-active' : ''} key={step.label} onMouseEnter={() => setActive(index)}>
          <button
            type="button"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            aria-expanded={active === index}
          >
            <span>0{index + 1}</span><strong>{step.label}</strong><b>→</b>
          </button>
          <div className="process-detail">
            <ProcessMini index={index} />
            <p>{step.body}</p>
            <small><b>✓</b>{step.result}</small>
          </div>
        </article>)}
      </div>
      <div className="process-status"><span>{c.current}</span><strong>0{active + 1} / {c.steps[active].label}</strong><i><b /></i></div>
    </div>
  </div></section>
}

function Final({ locale }: { locale: Locale }) {
  const c = copy[locale].final
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return <section className="final" id="start">
    <div className="grid-bg" />
    <div className="final-intro">
      <p className="final-product"><Mark />{c.product}</p>
      <h2>{c.title}</h2>
      <p>{c.body}</p>
    </div>
    <div className="start-steps">{c.steps.map(step => <article key={step[0]}><span>{step[0]}</span><strong>{step[1]}</strong><p>{step[2]}</p></article>)}</div>
    <div className="command-panel">
      <div className="command-head"><span>{c.install}</span><button type="button" onClick={copyCommand}>{copied ? c.copied : c.copy}<b>{copied ? '✓' : '□'}</b></button></div>
      <code>{INSTALL_COMMAND}</code>
      <div className="invoke-example"><span>{c.invoke}</span><pre><b>$vibe-upgrader</b>{'\n\n'}{c.prompt}</pre></div>
    </div>
    <div className="final-actions">
      <a className="primary-action" href="https://github.com/Zeno-wistom/vibe-upgrader" target="_blank" rel="noreferrer noopener">{c.github}<b>↗</b></a>
      <a className="case-action" href="https://vibe-upgrader-aigc-case.vercel.app/" target="_blank" rel="noreferrer noopener">{c.case}<b>↗</b></a>
      <a className="back-action" href="#top">{c.back}<b>↑</b></a>
    </div>
    <footer><a href="#top"><Mark /><strong>VIBE—UPGRADER</strong></a></footer>
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
  return <>
    <Header locale={locale} onLocale={() => setLocale(value => value === 'zh' ? 'en' : 'zh')} />
    <main>
      <Hero locale={locale} />
      <Compare locale={locale} />
      <Capabilities locale={locale} />
      <Scope locale={locale} />
      <Process locale={locale} />
      <Final locale={locale} />
    </main>
  </>
}
