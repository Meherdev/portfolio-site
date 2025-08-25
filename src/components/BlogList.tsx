type BlogPost = { id: string; title: string; date: string; summary: string; href: string }

export default function BlogList({ posts }: { posts: BlogPost[] }) {
	 return (
		 <div className="space-y-3">
			 {posts.map((p) => (
				 <a key={p.id} href={p.href} className="block rounded-lg border border-slate-200 bg-white/70 p-4 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:bg-slate-900">
					 <div className="flex items-center justify-between gap-2">
						 <h4 className="text-sm font-semibold tracking-tight">{p.title}</h4>
						 <span className="text-[11px] text-slate-500 dark:text-slate-400">{p.date}</span>
					 </div>
					 <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.summary}</p>
				 </a>
			 ))}
		 </div>
	 )
}


