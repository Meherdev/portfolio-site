
export type ProjectStory = {
	id: string
	title: string
	subtitle?: string
	image?: { src: string; alt: string }
	problem: string
	role: string
	impact: string
	tech: string[]
	links?: Array<{ label: string; href: string }>
}

export function ProjectStoryCard({ project }: { project: ProjectStory }) {
	 return (
		 <article
			 className={[
				 'group relative overflow-hidden rounded-xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur',
				 'transition-colors hover:bg-white focus-within:ring-2 focus-within:ring-slate-400 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-950 dark:focus-within:ring-slate-600',
			 ].join(' ')}
		 >
			 {project.image && (
				 <img
					 src={project.image.src}
					 alt={project.image.alt}
					 className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				 />
			 )}
			 <div className="p-4">
				 <div className="flex flex-wrap items-start justify-between gap-3">
					 <div>
						 <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
						 {project.subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{project.subtitle}</p>}
					 </div>
					 <div className="flex flex-wrap gap-1">
						 {project.tech.map((t) => (
							 <span key={t} className="rounded-md border border-slate-200 px-2 py-0.5 text-xs dark:border-slate-800">{t}</span>
						 ))}
					 </div>
				 </div>

				 <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
					 <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
						 <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Problem</p>
						 <p className="mt-1 text-slate-700 dark:text-slate-300">{project.problem}</p>
					 </div>
					 <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
						 <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Your Role</p>
						 <p className="mt-1 text-slate-700 dark:text-slate-300">{project.role}</p>
					 </div>
					 <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-800">
						 <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Impact</p>
						 <p className="mt-1 text-slate-700 dark:text-slate-300">{project.impact}</p>
					 </div>
				 </div>

				 {project.links && project.links.length > 0 && (
					 <div className="mt-3 flex flex-wrap gap-2">
						 {project.links.map((link) => (
							 <a key={link.href} href={link.href} target="_blank" className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">{link.label}</a>
						 ))}
					 </div>
				 )}
			 </div>
		 </article>
	 )
}


