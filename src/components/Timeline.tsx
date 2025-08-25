import { useEffect, useMemo, useRef, useState } from 'react'

type TimelineMilestone = {
	id: string
	date: string
	title: string
	category: 'education' | 'project' | 'work' | 'leadership' | 'achievement'
	summary: string
	details?: Array<string>
	images?: Array<{ src: string; alt: string }>
	links?: Array<{ label: string; href: string }>
	snippet?: string
	tech?: Array<string>
}

function useRevealOnScroll<T extends HTMLElement>() {
	 const elementRef = useRef<T | null>(null)
	 const [isRevealed, setIsRevealed] = useState(false)

	 useEffect(() => {
		 if (!elementRef.current) return
		 const observer = new IntersectionObserver(
			 (entries) => {
				 for (const entry of entries) {
					 if (entry.isIntersecting) {
						 setIsRevealed(true)
						 observer.disconnect()
					 }
				 }
			 },
			 { threshold: 0.15 },
		 )
		 observer.observe(elementRef.current)
		 return () => observer.disconnect()
	 }, [])

	 return { elementRef, isRevealed }
}

function CategoryBadge({ category }: { category: TimelineMilestone['category'] }) {
	 const className = useMemo(() => {
		 switch (category) {
			 case 'education':
				 return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20'
			 case 'project':
				 return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
			 case 'work':
				 return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20'
			 case 'leadership':
				 return 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 ring-1 ring-fuchsia-500/20'
			 case 'achievement':
				 return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/20'
		 }
	 }, [category])
	 return <span className={[ 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium', className ].join(' ')}>{category}</span>
}

	function MilestoneItem({ milestone, initiallyOpen = false, revealDelayMs = 0 }: { milestone: TimelineMilestone; initiallyOpen?: boolean; revealDelayMs?: number }) {
	 const [isOpen, setIsOpen] = useState(initiallyOpen)
	 const { elementRef, isRevealed } = useRevealOnScroll<HTMLDivElement>()
	 const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		 const target = e.target as HTMLElement
		 if (target.closest('a, button')) return
		 setIsOpen((v) => !v)
	 }
	 const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		 if (e.key === 'Enter' || e.key === ' ') {
			 e.preventDefault()
			 setIsOpen((v) => !v)
		 }
	 }

	 return (
		 <div
			 ref={elementRef}
			 className={[ 'relative pl-10', 'transition-all duration-500 motion-reduce:transition-none', isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' ].join(' ')}
			 style={{ transitionDelay: isRevealed ? `${revealDelayMs}ms` : '0ms' }}
		 >
			 {/* vertical line with grow animation */}
			 <span className="absolute left-3 top-0 block h-full w-px overflow-hidden" aria-hidden="true">
				 <span className={[ 'block h-full w-px origin-top bg-slate-200 transition-transform duration-700 motion-reduce:transition-none dark:bg-slate-800', isRevealed ? 'scale-y-100' : 'scale-y-0' ].join(' ')} />
			 </span>

			 {/* node (decorative) */}
			 <span className="absolute -left-1 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
				 <span className="block h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />
			 </span>

			 <div
				 role="button"
				 tabIndex={0}
				 aria-expanded={isOpen}
				 aria-controls={`${milestone.id}-panel`}
				 onClick={onCardClick}
				 onKeyDown={onCardKeyDown}
				 className="mb-8 cursor-pointer rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm outline-none backdrop-blur transition-colors motion-reduce:transition-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-600"
			 >
				 <div className="flex flex-wrap items-start justify-between gap-3">
					 <div>
						 <p className="text-xs uppercase tracking-tight text-slate-500 dark:text-slate-400">{milestone.date}</p>
						 <h3 className="mt-1 text-base font-semibold tracking-tight">{milestone.title}</h3>
					 </div>
					 <CategoryBadge category={milestone.category} />
				 </div>
				 <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{milestone.summary}</p>

				 <div className="overflow-hidden transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none" style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
					 <div id={`${milestone.id}-panel`} className={[ 'min-h-0', 'transition-all duration-500 ease-out motion-reduce:transition-none', isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1' ].join(' ')}>
						 {milestone.images && milestone.images.length > 0 && (
							 <div className="mt-3 grid grid-cols-2 gap-2">
								 {milestone.images.map((img) => (
									 <img key={img.src} src={img.src} alt={img.alt} className="h-24 w-full rounded-md object-contain ring-1 ring-slate-200 transition-transform duration-300 hover:scale-[1.02] motion-reduce:transition-none dark:ring-slate-800" />
								 ))}
							 </div>
						 )}
						 {milestone.snippet && (
							 <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100"><code>{milestone.snippet}</code></pre>
						 )}
						 {milestone.details && (
							 <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
								 {milestone.details.map((detail, idx) => (<li key={idx}>{detail}</li>))}
							 </ul>
						 )}
						 {milestone.links && milestone.links.length > 0 && (
							 <div className="mt-3 flex flex-wrap gap-2">
								 {milestone.links.map((link) => (
									 <a key={link.href} href={link.href} target="_blank" className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">{link.label}</a>
								 ))}
							 </div>
						 )}
					 </div>
				 </div>
			 </div>
		 </div>
	 )
}

export default function Timeline() {
	 const milestones: Array<TimelineMilestone> = [
		 { 
			 id: 'work-4', 
			 date: 'Jan 2025 – Present', 
			 title: 'Mobile Developer @ Anthem Inc', 
			 category: 'work', 
			 summary: 'Contributing to Anthem\'s Sydney Health mobile app development, focusing on patient-facing features and HIPAA-compliant healthcare solutions.', 
			 details: [ 
				 'Contributed to Anthem\'s Sydney Health mobile app by enhancing core patient-facing features using React Native, Redux, and TypeScript, ensuring a seamless experience across iOS and Android',
				 'Integrated secure APIs to provide access to personalized health data, claims information, and telehealth services, collaborating with backend teams to optimize REST API calls and reduce response times by 25%',
				 'Implemented push notifications and deep linking using Firebase and React Navigation to improve user engagement with health reminders and critical alerts',
				 'Partnered with cross-functional teams (design, product, and QA) across different geographies to plan sprints and deliver HIPAA-compliant features on time',
				 'Followed CI/CD pipelines with GitHub Actions and Fastlane for automated mobile builds and deployments'
			 ],
			 tech: ['React Native', 'Redux', 'TypeScript', 'Firebase', 'React Navigation', 'GitHub Actions', 'Fastlane', 'HIPAA Compliance']
		 },
		 { 
			 id: 'edu-2', 
			 date: 'Jan 2024 – May 2025', 
			 title: 'Masters in Computer Engineering', 
			 category: 'education', 
			 summary: 'Currently pursuing advanced studies in Computer Engineering, focusing on modern software development practices and emerging technologies.', 
			 details: [ 'Specialization in Software Engineering', 'Advanced coursework in modern development frameworks' ]
		 },
		 { 
			 id: 'work-3', 
			 date: '2021 – 2023', 
			 title: 'Full Stack Developer @ MyOperator India', 
			 category: 'work', 
			 summary: 'Led migration from PHP to ReactJS and developed mobile apps, significantly improving performance and user experience.', 
			 details: [ 
				 'Led the migration of MyOperator admin panel from PHP to ReactJS, improving frontend scalability and user interface responsiveness',
				 'Reduced frontend load time by 50% through code splitting, memoization, and performance optimizations using ReactJS best practices',
				 'Developed responsive UI components using ReactJS and TypeScript, enabling agents to efficiently track call logs and telephony data in real time',
				 'Developed the entire UI for the initial versions of 2 mobile apps using React Native, delivering a user-friendly and responsive experience across iOS and Android',
				 'Integrated REST APIs with backend services to ensure real-time data synchronization, improving data accuracy and accessibility for users',
				 'Collaborated with product managers, designers, and backend engineers to define requirements, prioritize features, and ensure seamless integration of new functionalities into the product'
			 ],
			 tech: ['ReactJS', 'TypeScript', 'React Native', 'REST APIs', 'PHP Migration', 'Performance Optimization']
		 },
		 { 
			 id: 'work-2', 
			 date: '2019 – 2021', 
			 title: 'Senior Software Engineer @ Digiprex India', 
			 category: 'work', 
			 summary: 'Led frontend development and contributed to mobile app success, achieving significant business impact.', 
			 details: [ 
				 'Refactored 3,000+ lines of legacy JavaScript to ReactJS, improving loading times by 40%',
				 'Developed frontend user and admin dashboard using ReactJS and Redux Toolkit',
				 'Led to 10,000 customer sign-ups and secured pre-seed funding round',
				 'Designed MongoDB schemas and developed Python FastAPI for CRM functionalities',
				 'Contributed to MarsByGHC Flutter app, resulting in 30% sales increase and 100K+ downloads',
				 'Managed Play Store and App Store deployments with push notifications and review features',
				 'Optimized location classification workflow, reducing API calls by 74%'
			 ],
			 tech: ['ReactJS', 'Redux Toolkit', 'MongoDB', 'Python FastAPI', 'Flutter', 'GraphQL']
		 },
		 { 
			 id: 'work-1', 
			 date: '2017 – 2019', 
			 title: 'Software Engineer @ Capgemini India', 
			 category: 'work', 
			 summary: 'Led migration from PHP to ReactJS and developed mobile apps, significantly improving performance and user experience.', 
			 details: [ 
				 'Led migration of MyOperator admin panel from PHP to ReactJS',
				 'Improved frontend scalability and UI responsiveness',
				 'Reduced frontend load time by 50% through code splitting and optimizations',
				 'Developed responsive UI components using ReactJS and TypeScript',
				 'Built entire UI for 2 mobile apps using React Native',
				 'Integrated REST APIs for real-time data synchronization',
				 'Collaborated with product managers, designers, and backend engineers'
			 ],
			 tech: ['ReactJS', 'TypeScript', 'React Native', 'REST APIs', 'PHP Migration']
		 },
		 { 
			 id: 'edu-1', 
			 date: '2013 – 2017', 
			 title: 'Bachelors in Electronics and Communications Engineering', 
			 category: 'education', 
			 summary: 'Graduated from JNTUK, India with a strong foundation in engineering principles and telecommunications.', 
			 details: [ 'University: JNTUK, India', 'Focus: Electronics and Communications Engineering' ]
		 }
	 ]

	 const [expanded, setExpanded] = useState(false)
	 const visibleMilestones = expanded ? milestones : milestones.slice(0, 3)

	 return (
		 <div className="relative mx-auto max-w-3xl">
			 <div>
				 {visibleMilestones.map((m, idx) => (
					 <MilestoneItem key={m.id} milestone={m} initiallyOpen={idx === 0} revealDelayMs={idx * 60} />
				 ))}
			 </div>

			 {milestones.length > 3 && (
				 <div className="mt-2 flex justify-center">
					 <button
						 onClick={() => setExpanded((v) => !v)}
						 className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none ring-offset-2 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-600"
					>
						 {expanded ? 'Collapse timeline' : 'View full timeline'}
					 </button>
				 </div>
			 )}
		 </div>
	 )
}


