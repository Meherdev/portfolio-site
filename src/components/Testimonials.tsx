type Testimonial = {
	quote: string
	author: string
	role?: string
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
	 return (
		 <div className="grid gap-4 sm:grid-cols-2">
			 {items.map((t, i) => (
				 <figure key={i} className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
					 <blockquote className="text-sm text-slate-700 dark:text-slate-300">“{t.quote}”</blockquote>
					 <figcaption className="mt-2 text-xs text-slate-500 dark:text-slate-400">— {t.author}{t.role ? `, ${t.role}` : ''}</figcaption>
				 </figure>
			 ))}
		 </div>
	 )
}


