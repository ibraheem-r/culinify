'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Copy, 
  Utensils, 
  Sparkles, 
  ArrowLeft, 
  LogOut, 
  History, 
  Wand2, 
  CheckCircle, 
  Loader2,
  Clock,
  Users,
  ChefHat,
  Heart,
  Shuffle,
  Lightbulb
} from 'lucide-react'

type Recipe = {
  recipe: string
}

const quickPrompts = [
  "Quick 15-minute dinner with chicken",
  "Vegetarian pasta with seasonal vegetables",
  "Healthy breakfast bowl with fruits",
  "Comfort food for a rainy day",
  "Light summer salad with protein",
  "One-pot meal for busy weeknight"
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (prompt.length > 0) {
      setShowQuickPrompts(false)
    } else {
      setShowQuickPrompts(true)
    }
  }, [prompt])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleGenerate = async () => {
    setLoading(true)
    setGeneratedRecipe(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      const userId = user.id

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId }),
      })

      if (!response.ok) throw new Error('Failed to generate recipe')

      const data: Recipe = await response.json()
      setGeneratedRecipe(data.recipe)

      await fetch('/api/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: data.recipe, userId }),
      })

    } catch (err) {
      console.error('Error generating or saving recipe:', err)
      setGeneratedRecipe('❌ Error generating recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  
  const handleCopy = () => {
    if (generatedRecipe) {
      navigator.clipboard.writeText(generatedRecipe)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
    setShowQuickPrompts(false)
  }

  const handleSurpriseMe = () => {
    const randomPrompt = quickPrompts[Math.floor(Math.random() * quickPrompts.length)]
    setPrompt(randomPrompt)
    setShowQuickPrompts(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <Link
              href="/history"
              className="group flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-all duration-300 hover:scale-105"
            >
              <div className="p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
              <span>Recipe History</span>
            </Link>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="text-sm border-purple-200 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/50 p-8 sm:p-12 space-y-10 animate-scale-in">
            
            {/* Enhanced Header Section */}
            <div className="text-center space-y-6 animate-fade-in">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight">
                  Culinify
                </h1>
              </div>
              <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
                Transform your ingredients into culinary masterpieces with AI-powered recipe generation
              </p>
              
              {/* Recipe Stats */}
              <div className="flex justify-center space-x-8 text-sm text-gray-500 mt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>Instant recipes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>Any serving size</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-purple-500" />
                  <span>Personalized</span>
                </div>
              </div>
            </div>

            {/* Enhanced Input Section */}
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Quick Prompts */}
              {showQuickPrompts && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-700">Quick Ideas</h3>
                    </div>
                    <Button
                      onClick={handleSurpriseMe}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Surprise Me
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickPrompts.map((quickPrompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(quickPrompt)}
                        className="p-4 text-left bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md text-sm"
                      >
                        {quickPrompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="relative">
                  <Textarea
                    placeholder="Describe your ingredients, dietary preferences, or cooking style... 
E.g., 'I have chicken, rice, and spinach. Make it Mediterranean style!' or 'Quick vegetarian dinner under 30 minutes'"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value)
                      setIsTyping(e.target.value.length > 0)
                    }}
                    className="min-h-[180px] p-8 rounded-2xl border-2 border-purple-200 shadow-lg bg-white/95 focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400 transition-all duration-300 text-lg resize-none placeholder:text-gray-400"
                  />
                  <div className="absolute bottom-4 right-6 flex items-center space-x-4">
                    <div className={`text-sm transition-colors ${prompt.length > 400 ? 'text-red-500' : 'text-purple-400'}`}>
                      {prompt.length}/500
                    </div>
                    {isTyping && (
                      <div className="flex items-center space-x-1 text-purple-500">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="group bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white px-10 py-5 rounded-2xl text-xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      <span className="animate-pulse">Crafting your perfect recipe...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                      {generatedRecipe ? 'Create New Recipe' : 'Generate Recipe Magic'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Enhanced Recipe Output */}
            {generatedRecipe && (
              <div className="animate-fade-in space-y-6" style={{ animationDelay: '0.4s' }}>
                <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-2 border-purple-200/50 p-8 rounded-3xl shadow-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
                          Your Custom Recipe
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Generated with AI precision</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="group flex items-center gap-3 text-sm text-purple-600 hover:text-purple-800 transition-all duration-300 px-6 py-3 rounded-xl hover:bg-purple-100 border border-purple-200 hover:border-purple-300 hover:scale-105"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-600 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Copy Recipe</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-purple-100 shadow-inner">
                    <div className="prose prose-purple max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium text-base font-sans">
                        {generatedRecipe}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-3 rounded-full text-sm font-medium border border-green-200 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                      <span>Recipe automatically saved to your collection!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quick Actions */}
            {generatedRecipe && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Button
                  onClick={() => {
                    setPrompt('')
                    setGeneratedRecipe(null)
                    setShowQuickPrompts(true)
                  }}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-300 px-8 py-4 rounded-2xl font-medium hover:scale-105"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Create Another Recipe
                </Button>
                <Link href="/history">
                  <Button className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 hover:from-purple-200 hover:to-indigo-200 transition-all duration-300 px-8 py-4 rounded-2xl font-medium hover:scale-105 border border-purple-200">
                    <History className="w-5 h-5 mr-2" />
                    View Recipe Collection
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
