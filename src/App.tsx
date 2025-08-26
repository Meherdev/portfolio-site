import { useState, useEffect } from 'react'
import Timeline from './components/Timeline'
import { ProjectStoryCard, type ProjectStory } from './components/ProjectStory'
import SkillsMap3D from './components/SkillsMap3D'
import Avatar3D from './components/Avatar3D'
// import { FloatingChat } from './components/FloatingChat' // Archived for future implementation

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isAvatarDancing, setIsAvatarDancing] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 text-slate-700 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
          </svg>
        )}
      </button>

      <main>
        <section id="home" className="relative mx-auto flex min-h-[60svh] max-w-6xl flex-col lg:flex-row items-center justify-center gap-8 px-4 py-24">
          {/* Left side - Text content */}
          <div className="flex-1 text-left">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Hi, I'm Meher!
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-6">
              Full Stack Developer
            </p>
            
            {/* Developer Object Display */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm mb-6 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-600 dark:text-slate-400 mb-2">const meher = {`{`}</div>
              <div className="ml-4 space-y-1">
                <div className="text-blue-600 dark:text-blue-400">role: <span className="text-green-600 dark:text-green-400">"Developer"</span>,</div>
                <div className="text-blue-600 dark:text-blue-400">builds: [</div>
                <div className="ml-4 text-green-600 dark:text-green-400">"Web", "Mobile", "AI"</div>
                <div className="text-blue-600 dark:text-blue-400">]</div>
              </div>
              <div className="text-slate-600 dark:text-slate-400">{`}`}</div>
            </div>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">React</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">Node.js</span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">Python</span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">AWS</span>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">React Native</span>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">TypeScript</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
              <span>📍 San Jose, California</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href="https://www.linkedin.com/in/meher-prasad-janapareddy-b02649125/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/Meherdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200"
                aria-label="GitHub Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center justify-center p-2.5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors duration-200 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                aria-label="Download Resume"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
          
          {/* Right side - 3D Avatar */}
          <div className="flex-1 h-[500px] lg:h-[600px] relative">
            <Avatar3D 
              onDanceToggle={(isDancing) => {
                setIsAvatarDancing(isDancing)
                if (isDancing) {
                  // Play some background music or sound effect
                  console.log('🎵 Avatar started dancing!')
                } else {
                  console.log('🎭 Avatar stopped dancing')
                }
              }}
            />
            
            {/* Stand/Dance Toggle Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-lg border border-slate-200 dark:border-slate-700 space-x-1.5">
                {/* Stand Icon */}
                <button
                  onClick={() => {
                    if (isAvatarDancing) {
                      const event = new CustomEvent('makeMeDance')
                      window.dispatchEvent(event)
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    !isAvatarDancing 
                      ? 'bg-blue-500 text-white shadow-md scale-110' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                  aria-label="Stand Mode"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </button>

                {/* Dance Icon */}
                <button
                  onClick={() => {
                    if (!isAvatarDancing) {
                      const event = new CustomEvent('makeMeDance')
                      window.dispatchEvent(event)
                    }
                  }}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    isAvatarDancing 
                      ? 'bg-purple-500 text-white shadow-md scale-110' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                  aria-label="Dance Mode"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Section id="projects" title="Latest Projects">
          <div className="grid gap-6 sm:grid-cols-2">
            {([
              {
                id: 'p1',
                title: '📺 YouTube Video Summarizer',
                subtitle: 'AI-Powered Web Application',
                image: { src: '/youtube.jpg', alt: 'YouTube Summarizer Preview' },
                problem: 'Long-form video content is time-consuming to consume, making it inaccessible for busy users who need quick insights.',
                role: 'Built full-stack web app with React frontend and FastAPI backend, integrated OpenAI Whisper and GPT for AI-powered transcription and summarization.',
                impact: 'Enables users to get concise summaries of any YouTube video in seconds, making video content accessible and digestible.',
                tech: ['React', 'Tailwind CSS', 'FastAPI', 'Python', 'OpenAI Whisper', 'GPT-4', 'SQLite', 'Vercel', 'Fly.io'],
                links: [
                  { label: '🌐 Live Demo', href: 'https://youtube-summary-nu.vercel.app/' },
                  { label: '📁 GitHub', href: 'https://github.com/Meherdev/youtube-summary' },
                  { label: '🎥 Demo Video', href: 'https://vimeo.com/showcase/11317688?video=1079594185' }
                ]
              },
              {
                id: 'p2',
                title: '💰 Smart Expense Tracker',
                subtitle: 'React Native Mobile App',
                image: { src: '/expense.jpg', alt: 'Expense Tracker Preview' },
                problem: 'Manual expense logging is tedious and error-prone, making personal finance management difficult and time-consuming.',
                role: 'Developed React Native mobile app with AWS serverless backend, integrated Amazon Textract for automatic receipt scanning and data extraction.',
                impact: 'Automates expense tracking by scanning receipts, eliminating manual data entry and providing comprehensive financial insights.',
                tech: ['React Native', 'TypeScript', 'AWS Amplify', 'Cognito', 'DynamoDB', 'Lambda', 'API Gateway', 'Amazon Textract'],
                links: [
                  { label: '📁 GitHub', href: 'https://github.com/Meherdev/SmartExpenseTracker' },
                  { label: '🎥 Demo Video', href: 'https://vimeo.com/showcase/11317688?video=998284789' }
                ]
              }
            ] as ProjectStory[]).map((prj) => (
              <ProjectStoryCard key={prj.id} project={prj} />
            ))}
          </div>
        </Section>

        <Section id="timeline" title="Timeline">
          <Timeline />
        </Section>

        <Section id="skills" title="Interactive Skills Map">
          <SkillsMap3D />
        </Section>

        {/* <Section id="testimonials" title="Testimonials">
          <Testimonials items={[
            { quote: 'Meher led our mobile release and boosted signups by 35%.', author: 'Anita Rao', role: 'Product Lead' },
            { quote: 'Ship-it attitude with clean, maintainable code.', author: 'Rahul Mehta', role: 'Engineering Manager' },
          ]} />
        </Section> */}

        <Section id="about" title="Beyond Code">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-sm font-semibold">🏏 Cricket Team Captain</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Led my team to victory in multiple tournaments, developing leadership skills, strategic thinking, and team coordination.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-sm font-semibold">✈️ Passionate Traveler</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Exploring new cultures and environments has broadened my perspective and enhanced adaptability in diverse situations.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-sm font-semibold">🎮 Mobile Games Enthusiast</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Deep understanding of mobile gaming mechanics and user experience, providing valuable insights for mobile app development.</p>
            </div>
          </div>
        </Section>

        {/* <Section id="blog" title="Notes & Blog (optional)">
          <BlogList posts={[
            { id: 'b1', title: 'A single JSX line broke prod', date: '2024-11-18', summary: 'Lessons from a React Native edge case and how to guard against it.', href: '#' },
            { id: 'b2', title: 'Optimizing image pipelines', date: '2025-01-04', summary: 'Parallelization patterns in serverless for big wins.', href: '#' },
          ]} />
        </Section> */}

        <Section id="contact" title="Contact">
          Reach me at <a className="underline hover:text-blue-500 transition-colors" href="mailto:meherprasad720@gmail.com">meherprasad720@gmail.com</a>
        </Section>
      </main>

      <footer className="border-t border-slate-200/10 py-8 text-center text-sm text-slate-500 dark:border-slate-800/60">
        © {new Date().getFullYear()} Meher
      </footer>

      {/* Floating Chat Component - Archived for future implementation */}
      {/* <FloatingChat /> */}
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  )
}

export default App
