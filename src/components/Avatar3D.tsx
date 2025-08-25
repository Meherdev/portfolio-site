import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'
import React, { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

// Preload both models
useGLTF.preload('/stand.glb')
useGLTF.preload('/dance.glb')

interface AvatarModelProps {
  ref?: any
  onDanceToggle?: (isDancing: boolean) => void
  onModelChange?: (modelType: 'stand' | 'dance') => void
}

const AvatarModel = React.forwardRef<any, AvatarModelProps>(({ onDanceToggle, onModelChange }, ref) => {
  const [currentModel, setCurrentModel] = useState<'stand' | 'dance'>('stand')
  const [isDancing, setIsDancing] = useState(false)
  const [currentSong, setCurrentSong] = useState<string>('')
  
  // Load both models
  const standModel = useGLTF('/stand.glb')
  const danceModel = useGLTF('/dance.glb')
  
  const avatarRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

                // Sample playlist for the Spotify-like player
              const playlist = [
                { title: "Dance Music", artist: "Custom Track", duration: "3:45", file: "/music.mp3" },
                { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "3:45", file: null },
                { title: "Shake It Off", artist: "Taylor Swift", duration: "3:39", file: null },
                { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", duration: "3:56", file: null },
                { title: "Happy", artist: "Pharrell Williams", duration: "3:53", file: null }
              ]

  const makeMeDance = () => {
    if (isDancing) {
      // Stop dancing - return to stand model
      setCurrentModel('stand')
      setIsDancing(false)
      setCurrentSong('')
      
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      
      onDanceToggle?.(false)
      onModelChange?.('stand')
    } else {
      // Start dancing - switch to dance model
      setCurrentModel('dance')
      setIsDancing(true)
      
                        // Pick the custom dance music since it's available
                  const song = playlist[0] // Dance Music - Custom Track
                  setCurrentSong(`${song.title} - ${song.artist}`)
                  
                                    // Play audio if available
                  if (song.file && !audioRef.current) {
                    audioRef.current = new Audio(song.file)
                    audioRef.current.loop = false // Don't loop the entire song
                    audioRef.current.volume = 0.5
                  }
                  
                  if (audioRef.current && song.file) {
                    audioRef.current.currentTime = 0 // Start from beginning
                    audioRef.current.play().catch(console.error)
                  }
      
      onDanceToggle?.(true)
      onModelChange?.('dance')
    }
  }

  // Expose makeMeDance function via ref
  React.useImperativeHandle(ref, () => ({
    makeMeDance,
    isDancing,
    currentSong
  }))

  // Handle audio ending and restart for continuous dance
  React.useEffect(() => {
    if (audioRef.current && isDancing) {
      const handleAudioEnd = () => {
        // Restart the song when it ends
        if (audioRef.current && isDancing) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(console.error)
        }
      }
      
      audioRef.current.addEventListener('ended', handleAudioEnd)
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnd)
        }
      }
    }
  }, [isDancing])



  // Initialize animations when model changes
  React.useEffect(() => {
    const currentModelData = currentModel === 'stand' ? standModel : danceModel
    
    if (currentModelData.scene && currentModelData.animations && currentModelData.animations.length > 0) {
      // Clean up previous mixer
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
      }
      
      // Create new mixer for current model
      mixerRef.current = new THREE.AnimationMixer(currentModelData.scene)
      
      // Play the first animation
      const action = mixerRef.current.clipAction(currentModelData.animations[0])
      action.play()
      
      console.log(`Playing animation for ${currentModel} model:`, currentModelData.animations[0].name)
    }
  }, [currentModel, standModel.scene, danceModel.scene])

  useFrame((state, delta) => {
    if (avatarRef.current) {
      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta)
      }
      
      // Gentle rotation for dynamic feel
      avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Get the current model to display
  const currentScene = currentModel === 'stand' ? standModel.scene : danceModel.scene

  if (!currentScene) {
    return (
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#6b7280" />
        <Html center>
          <div className="text-center text-white text-sm bg-gray-600 bg-opacity-75 p-2 rounded">
            <p>Loading Avatar...</p>
          </div>
        </Html>
      </mesh>
    )
  }

  return (
    <group ref={avatarRef}>
      <primitive object={currentScene} scale={0.9} position={[0, -0.6, 0]} />
    </group>
  )
})



interface Avatar3DProps {
  onDanceToggle?: (isDancing: boolean) => void
}

export default function Avatar3D({ onDanceToggle }: Avatar3DProps) {
  const avatarRef = useRef<any>(null)

  React.useEffect(() => {
    const handleDanceEvent = () => {
      if (avatarRef.current) {
        avatarRef.current.makeMeDance?.()
      }
    }

    window.addEventListener('makeMeDance', handleDanceEvent)
    return () => {
      window.removeEventListener('makeMeDance', handleDanceEvent)
    }
  }, [])





  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />
        
        {/* Environment for realistic reflections */}
        <Environment preset="city" />
        
        {/* Avatar Model */}
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#6b7280" />
            <Html center>
              <div className="text-center text-white text-sm bg-gray-600 bg-opacity-75 p-2 rounded">
                <p>Loading Avatar...</p>
              </div>
            </Html>
          </mesh>
        }>
          {/* Avatar model with ref for external control */}
          <AvatarModel 
            ref={avatarRef} 
            onDanceToggle={onDanceToggle} 
          />
        </Suspense>
        
        {/* Camera Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          autoRotate={false}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>


    </div>
  )
}
