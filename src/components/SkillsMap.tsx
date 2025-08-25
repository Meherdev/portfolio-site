import { useEffect, useRef, useState } from 'react'

type NodeGroup = 'frontend' | 'backend' | 'cloud' | 'ai' | 'mobile'
type NodeSpec = {
	id: string
	label: string
	group: NodeGroup
	angleRad: number
	radius: number
	phase?: number
	tooltip?: string
	details?: string[]
}

export default function SkillsMap() {
	 const containerRef = useRef<HTMLDivElement | null>(null)
	 const canvasRef = useRef<HTMLCanvasElement | null>(null)
	 const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null)
	 const [selected, setSelected] = useState<{ id: string; x: number; y: number } | null>(null)
	 const [popoverEnter, setPopoverEnter] = useState(false)
	 const mouseRef = useRef<{ x: number; y: number } | null>(null)
	 const animRef = useRef<number | null>(null)
	 const angleOffsetRef = useRef(0)

	 const nodesRef = useRef<NodeSpec[]>([
		 { id: 'react', label: 'React', group: 'frontend', angleRad: (340 * Math.PI) / 180, radius: 110, phase: 0.1, tooltip: 'SPAs, hooks, perf', details: ['Built 10+ SPAs', 'SSR/Code-split', 'Testing Library'] },
		 { id: 'ts', label: 'TypeScript', group: 'frontend', angleRad: (15 * Math.PI) / 180, radius: 140, phase: 0.6, tooltip: 'Types, DX', details: ['Strict mode', 'Generics', 'TS ESLint rules'] },
		 { id: 'node', label: 'Node.js', group: 'backend', angleRad: (60 * Math.PI) / 180, radius: 120, phase: 1.8, tooltip: 'APIs, tooling', details: ['Express/Fastify', 'WS/Queues', 'Perf profiling'] },
		 { id: 'py', label: 'Python', group: 'ai', angleRad: (95 * Math.PI) / 180, radius: 150, phase: 2.3, tooltip: 'Data/AI', details: ['Pandas/NumPy', 'LLM tooling', 'Async IO'] },
		 { id: 'aws', label: 'AWS', group: 'cloud', angleRad: (130 * Math.PI) / 180, radius: 140, phase: 3.1, tooltip: 'Cloud infra', details: ['Lambda/S3/API GW', 'IaC', 'Monitoring'] },
		 { id: 'mongo', label: 'MongoDB', group: 'backend', angleRad: (180 * Math.PI) / 180, radius: 110, phase: 4.0, tooltip: 'Doc store', details: ['Indexes', 'Agg pipelines'] },
		 { id: 'docker', label: 'Docker', group: 'cloud', angleRad: (210 * Math.PI) / 180, radius: 130, phase: 4.7, tooltip: 'Containers', details: ['CI/CD', 'Multi-stage builds'] },
		 { id: 'rn', label: 'React Native', group: 'mobile', angleRad: (250 * Math.PI) / 180, radius: 140, phase: 5.4, tooltip: 'Mobile apps', details: ['Bridging', 'Release tooling'] },
	 ])

	 const colorFor = (group: NodeGroup) => {
		 switch (group) {
			 case 'frontend': return '#7C5CFF'
			 case 'backend': return '#22c55e'
			 case 'cloud': return '#06b6d4'
			 case 'ai': return '#eab308'
			 case 'mobile': return '#ec4899'
		 }
	 }

	 useEffect(() => {
		 const canvas = canvasRef.current
		 const container = containerRef.current
		 if (!canvas || !container) return
		 const ctx = canvas.getContext('2d')
		 if (!ctx) return

		 const resize = () => {
			 const dpr = window.devicePixelRatio || 1
			 const width = container.clientWidth
			 const height = 360
			 canvas.width = width * dpr
			 canvas.height = height * dpr
			 canvas.style.width = `${width}px`
			 canvas.style.height = `${height}px`
			 ctx.setTransform(1, 0, 0, 1, 0, 0)
			 ctx.scale(dpr, dpr)
		 }
		 resize()
		 window.addEventListener('resize', resize)

		 const center = () => ({ x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 })
		 const nodeRadius = 16
		 let last = performance.now()
		 const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
		 const baseSpeed = prefersReduced ? 0 : (Math.PI / 180000) // ~1 deg/sec
		 const wobbleAmp = prefersReduced ? 0 : 6
		 const wobbleFreq = 1 / 2400 // slower wobble

		 const draw = () => {
			 const now = performance.now()
			 const dt = Math.min(now - last, 50)
			 last = now
			 angleOffsetRef.current += dt * baseSpeed

			 const c = center()
			 ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

			 // nucleus
			 ctx.fillStyle = '#38bdf8'
			 ctx.beginPath(); ctx.arc(c.x, c.y, 24, 0, Math.PI * 2); ctx.fill()
			 ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#0b1220' : '#0b1220'
			 ctx.font = 'bold 12px ui-sans-serif, system-ui'
			 ctx.textAlign = 'center'
			 ctx.fillText('Meher', c.x, c.y + 4)

			 const mouse = mouseRef.current
			 let hoveredLocal: { id: string; x: number; y: number } | null = null

			 for (const node of nodesRef.current) {
				 const a = node.angleRad + angleOffsetRef.current
				 const wobble = wobbleAmp * Math.sin((now + (node.phase || 0) * 1000) * wobbleFreq)
				 const r = node.radius + wobble
				 const x = c.x + Math.cos(a) * r
				 const y = c.y + Math.sin(a) * r
				 // orbit line
				 ctx.strokeStyle = 'rgba(203,213,225,0.5)'
				 ctx.lineCap = 'round'
				 ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(x, y); ctx.stroke()
				 // node
				 const isHover = mouse && Math.hypot(mouse.x - x, mouse.y - y) <= nodeRadius + 4
				 // halo glow
				 const glowAlpha = prefersReduced ? 0.08 : 0.08 + 0.04 * Math.sin((now + (node.phase || 0) * 800) / 500)
				 ctx.fillStyle = colorFor(node.group)
				 ctx.globalAlpha = glowAlpha
				 ctx.beginPath(); ctx.arc(x, y, nodeRadius + 8, 0, Math.PI * 2); ctx.fill()
				 ctx.globalAlpha = 1
				 // core
				 ctx.beginPath(); ctx.arc(x, y, isHover ? nodeRadius + 2 : nodeRadius, 0, Math.PI * 2); ctx.fill()
				 // label
				 ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#0b1220'
				 ctx.font = 'bold 11px ui-sans-serif, system-ui'
				 ctx.textAlign = 'center'
				 ctx.fillText(node.label, x, y + 4)
				 if (isHover) hoveredLocal = { id: node.id, x, y }
			 }

			 if (hoveredLocal) {
				 setHovered((prev) => (prev && prev.id === hoveredLocal.id && Math.hypot(prev.x - hoveredLocal.x, prev.y - hoveredLocal.y) < 0.5 ? prev : hoveredLocal))
			 } else if (hovered) {
				 setHovered(null)
			 }

			 animRef.current = requestAnimationFrame(draw)
		 }
		 animRef.current = requestAnimationFrame(draw)

		 const handleMove = (e: MouseEvent) => {
			 const rect = canvas.getBoundingClientRect()
			 mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
		 }
		 const handleLeave = () => {
			 mouseRef.current = null
		 }
		 const handleClick = () => {
			 if (!hovered) return
			 setSelected(hovered)
			 setPopoverEnter(false)
			 requestAnimationFrame(() => setPopoverEnter(true))
		 }

		 canvas.addEventListener('mousemove', handleMove)
		 canvas.addEventListener('mouseleave', handleLeave)
		 canvas.addEventListener('click', handleClick)

		 return () => {
			 window.removeEventListener('resize', resize)
			 canvas.removeEventListener('mousemove', handleMove)
			 canvas.removeEventListener('mouseleave', handleLeave)
			 canvas.removeEventListener('click', handleClick)
			 if (animRef.current) cancelAnimationFrame(animRef.current)
		 }
	 }, [hovered])

	 const selectedNode = selected ? nodesRef.current.find(n => n.id === selected.id) : null
	 const hoveredNode = hovered ? nodesRef.current.find(n => n.id === hovered.id) : null

	 // Position helpers
	 const tooltipStyle = (pt: { x: number; y: number } | null): React.CSSProperties => {
		 if (!pt || !containerRef.current) return { display: 'none' }
		 const padding = 8
		 const left = Math.max(padding, Math.min(pt.x + 12, containerRef.current.clientWidth - 160))
		 const top = Math.max(padding, Math.min(pt.y - 8, 320 - 80))
		 return { left, top, position: 'absolute' }
	 }

	 const popoverStyle = (pt: { x: number; y: number } | null): React.CSSProperties => {
		 if (!pt || !containerRef.current) return { display: 'none' }
		 const w = 260
		 const h = 180
		 const left = Math.max(8, Math.min(pt.x + 16, containerRef.current.clientWidth - w - 8))
		 const top = Math.max(8, Math.min(pt.y - h / 2, 360 - h - 8))
		 return { left, top, width: w, position: 'absolute' }
	 }

	 return (
		 <div ref={containerRef} className="relative rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
			 <canvas ref={canvasRef} className="h-[360px] w-full" />

			 {/* Hover tooltip */}
			 {hovered && hoveredNode && (
				 <div className="pointer-events-none rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" style={tooltipStyle(hovered)}>
					 {hoveredNode.label}: {hoveredNode.tooltip}
				 </div>
			 )}

			 {/* Click popover */}
			 {selected && selectedNode && (
				 <div className={[ 'rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-lg outline-none ring-offset-2 transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300', popoverEnter ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-[0.98]' ].join(' ')} style={popoverStyle(selected)} role="dialog" aria-label={`${selectedNode.label} details`}>
					 <div className="flex items-start justify-between gap-3">
						 <div>
							 <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Skill</p>
							 <h4 className="font-semibold">{selectedNode.label}</h4>
						 </div>
						 <button onClick={() => setSelected(null)} className="rounded-md px-2 py-1 text-xs text-slate-500 outline-none ring-offset-2 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-600">Close</button>
					 </div>
					 {selectedNode.details && (
						 <ul className="mt-2 list-disc space-y-1 pl-5">
							 {selectedNode.details.map((d, i) => (<li key={i}>{d}</li>))}
						 </ul>
					 )}
				 </div>
			 )}
		 </div>
	 )
}


