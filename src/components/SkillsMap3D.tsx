import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Float } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

type SkillCategory = 'frontend' | 'backend' | 'cloud' | 'ai' | 'mobile' | 'tools' | 'databases'

interface SkillNode {
  id: string
  name: string
  category: SkillCategory
  level: number // 1-5
  experience: string
  position: [number, number, number]
  color: string
  icon?: string
}

const skillData: SkillNode[] = [
  // Frontend Technologies
  { id: 'react', name: 'React', category: 'frontend', level: 5, experience: '7+ years', position: [0, 3, 0], color: '#61DAFB', icon: '⚛️' },
  { id: 'reactnative', name: 'React Native', category: 'frontend', level: 5, experience: '5+ years', position: [2, 3, 0], color: '#61DAFB', icon: '📱' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', level: 4, experience: '3+ years', position: [0, 3, 2], color: '#000000', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 5, experience: '6+ years', position: [2, 3, 2], color: '#3178C6', icon: '🔷' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', level: 5, experience: '4+ years', position: [-2, 3, 0], color: '#06B6D4', icon: '🎨' },
  
  // Backend Technologies
  { id: 'nodejs', name: 'Node.js', category: 'backend', level: 4, experience: '5+ years', position: [0, 0, 6], color: '#339933', icon: '🟢' },
  { id: 'expressjs', name: 'Express.js', category: 'backend', level: 4, experience: '5+ years', position: [2, 0, 6], color: '#000000', icon: '🚀' },
  { id: 'python', name: 'Python', category: 'backend', level: 4, experience: '4+ years', position: [-2, 0, 6], color: '#3776AB', icon: '🐍' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', level: 4, experience: '3+ years', position: [0, 0, 8], color: '#009688', icon: '⚡' },
  
  // Cloud/AWS Services
  { id: 'aws', name: 'AWS', category: 'cloud', level: 4, experience: '3+ years', position: [6, 0, 0], color: '#FF9900', icon: '☁️' },
  { id: 'amplify', name: 'AWS Amplify', category: 'cloud', level: 4, experience: '2+ years', position: [8, 0, 0], color: '#FF9900', icon: '🚀' },
  { id: 'cognito', name: 'AWS Cognito', category: 'cloud', level: 4, experience: '2+ years', position: [6, 0, 2], color: '#FF9900', icon: '🔐' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'cloud', level: 4, experience: '2+ years', position: [8, 0, 2], color: '#FF9900', icon: '🗄️' },
  { id: 'lambda', name: 'AWS Lambda', category: 'cloud', level: 4, experience: '2+ years', position: [6, 0, -2], color: '#FF9900', icon: 'λ' },
  { id: 'apigateway', name: 'API Gateway', category: 'cloud', level: 4, experience: '2+ years', position: [8, 0, -2], color: '#FF9900', icon: '🌐' },
  
  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', level: 4, experience: '3+ years', position: [0, 0, -6], color: '#336791', icon: '🐘' },
  { id: 'mongodb', name: 'MongoDB', category: 'databases', level: 4, experience: '4+ years', position: [2, 0, -6], color: '#47A248', icon: '🍃' },
  { id: 'redis', name: 'Redis', category: 'databases', level: 3, experience: '2+ years', position: [-2, 0, -6], color: '#DC382D', icon: '🔴' },
  { id: 'sqlite', name: 'SQLite', category: 'databases', level: 4, experience: '3+ years', position: [0, 0, -8], color: '#003B57', icon: '💾' },
  
  // AI/ML Tools
  { id: 'openai', name: 'OpenAI API', category: 'ai', level: 4, experience: '2+ years', position: [-6, 0, 0], color: '#412991', icon: '🤖' },
  { id: 'whisper', name: 'Whisper', category: 'ai', level: 4, experience: '2+ years', position: [-8, 0, 0], color: '#412991', icon: '🎤' },
  { id: 'gpt', name: 'GPT-4', category: 'ai', level: 4, experience: '2+ years', position: [-6, 0, 2], color: '#412991', icon: '🧠' },
  { id: 'textract', name: 'Amazon Textract', category: 'ai', level: 4, experience: '2+ years', position: [-8, 0, 2], color: '#FF9900', icon: '📄' },
  
  // Other Tools
  { id: 'git', name: 'Git', category: 'tools', level: 5, experience: '7+ years', position: [0, -3, 6], color: '#F05032', icon: '📚' },
  { id: 'docker', name: 'Docker', category: 'tools', level: 4, experience: '3+ years', position: [2, -3, 6], color: '#2496ED', icon: '🐳' },
  { id: 'jira', name: 'JIRA', category: 'tools', level: 4, experience: '5+ years', position: [-2, -3, 6], color: '#0052CC', icon: '📋' },
  { id: 'graphql', name: 'GraphQL', category: 'tools', level: 4, experience: '3+ years', position: [0, -3, 8], color: '#E10098', icon: '🔮' },
]

function SkillSphere({ skill, onSelect }: { skill: SkillNode; onSelect: (s: SkillNode) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.getElapsedTime()
    const scale = hovered ? 1.2 : 1
    
    groupRef.current.scale.setScalar(scale)
    
    // Gentle floating animation
    const floatOffset = Math.sin(time * 0.5 + skill.id.length) * 0.1
    groupRef.current.position.y = skill.position[1] + floatOffset
  })

  const levelScale = skill.level / 5

  const handleClick = () => {
    setSelected(!selected)
    onSelect(skill)
  }

  // Auto-close popup after 5 seconds
  useEffect(() => {
    if (selected) {
      const timer = setTimeout(() => {
        setSelected(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [selected])

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={skill.position}>
        {/* Connection line to center */}
        <primitive object={new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0)
          ]),
          new THREE.LineBasicMaterial({ color: "#64748b", opacity: 0.3, transparent: true })
        )} />
        
        {/* Skill icon container */}
        <group ref={groupRef}>
          {/* 3D Background Bubble */}
          <mesh
            onPointerOver={(e) => { 
              e.stopPropagation(); 
              setHovered(true) 
            }}
            onPointerOut={(e) => { 
              e.stopPropagation(); 
              setHovered(false) 
            }}
            onPointerDown={(e) => { 
              e.stopPropagation(); 
              handleClick() 
            }}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshStandardMaterial 
              color={skill.color} 
              opacity={0.4} 
              transparent 
              roughness={0.1}
              metalness={0.9}
              emissive={skill.color}
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Glow effect for hover */}
          {hovered && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1.4, 16, 16]} />
              <meshBasicMaterial 
                color={skill.color} 
                transparent 
                opacity={0.2} 
                side={THREE.BackSide}
              />
            </mesh>
          )}
          
          {/* Technology icon/logo */}
          <Html center>
            <div className={`text-3xl font-bold text-white transition-all duration-300 cursor-pointer ${
              hovered ? 'scale-125' : 'scale-100'
            } ${selected ? 'ring-2 ring-blue-400 ring-opacity-80' : ''}`}>
              {skill.icon}
            </div>
          </Html>
        </group>
        

        
        {/* Skill label */}
        <Html
          center
          position={[0, levelScale * 0.8 + 0.5, 0]}
          style={{ 
            pointerEvents: 'none',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#1e293b',
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
            whiteSpace: 'nowrap'
          }}
        >
          {skill.name}
        </Html>
      </group>
    </Float>
  )
}

function CentralNode() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#0ea5e9" 
          emissive="#0369a1" 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Central label */}
      <Html center>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '8px 12px',
          borderRadius: '8px',
          whiteSpace: 'nowrap'
        }}>
          Meher
        </div>
      </Html>
    </group>
  )
}

function CategoryLegend() {
  const categories = [
    { name: 'Frontend', color: '#7C5CFF' },
    { name: 'Backend', color: '#22c55e' },
    { name: 'Cloud', color: '#06b6d4' },
    { name: 'AI/ML', color: '#eab308' },
    { name: 'Mobile', color: '#ec4899' },
    { name: 'Databases', color: '#f97316' },
    { name: 'Tools', color: '#8b5cf6' }
  ]

  return (
    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
      {categories.map((cat) => (
        <div key={cat.name} className="flex items-center gap-2 rounded-md bg-white/90 px-2 py-1 text-xs shadow-sm dark:bg-slate-900/90">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: cat.color }}
          />
          <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function SkillsMap3D() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Canvas 
        camera={{ position: [8, 8, 8], fov: 60 }} 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[10, -10, 10]} intensity={0.5} color="#ec4899" />
        <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />
        
        {/* Scene */}
        <group>
          <CentralNode />
          {skillData.map((skill) => (
            <SkillSphere 
              key={skill.id} 
              skill={skill} 
              onSelect={setSelectedSkill}
            />
          ))}
        </group>
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          enableDamping 
          dampingFactor={0.05}
          minDistance={6} 
          maxDistance={20}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Skill details panel */}
      {selectedSkill && (
        <div className="absolute right-4 top-4 w-72 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: selectedSkill.color }}
                />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {selectedSkill.name}
                </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedSkill.experience} experience
              </p>
            </div>
            <button 
              onClick={() => setSelectedSkill(null)}
              className="rounded-md px-2 py-1 text-xs text-slate-500 outline-none ring-offset-2 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-600"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Proficiency</span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Level {selectedSkill.level}/5
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(selectedSkill.level / 5) * 100}%`,
                  backgroundColor: selectedSkill.color
                }}
              />
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Category
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 capitalize">
              {selectedSkill.category}
            </p>
          </div>
        </div>
      )}

      <CategoryLegend />
    </div>
  )
}


