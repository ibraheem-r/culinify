'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Utensils, ArrowLeft, LogOut, BookOpen, Clock, Copy, CheckCircle, Loader2, Sparkles } from 'lucide-react'

type Recipe = {
  id: number
  recipe: string
  created_at: string
}

export default function HistoryPage() {
  const supabase = createClient()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const router = useRouter()

  const fetchRecipes = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      router.push('/')
      return
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecipes(data)
    }

    setLoading(false)
  }

  
  useEffect(() => {
    fetchRecipes()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCopy = (recipe: string, id: number) => {
    navigator.clipboard.writeText(recipe)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <Link 
              href="/generate" 
              className="group flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Generate New Recipe</span>
            </Link>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="text-sm border-purple-200 hover:bg-purple-50 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200 p-8 sm:p-12 animate-scale-in">
            
            {/* Header Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text-purple tracking-tight">
                  Your Recipe Library
                </h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                All your culinary creations in one place. Revisit your favorite recipes anytime.
              </p>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-16 animate-fade-in">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                  <p className="text-gray-600">Loading your culinary masterpieces...</p>
                </div>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No recipes yet</h3>
                    <p className="text-gray-600 mb-6">Start creating your first recipe to see it here!</p>
                    <Link href="/generate">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                        <Utensils className="w-5 h-5 mr-2" />
                        Create Your First Recipe
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{recipes.length}</span>
                    </div>
                    <span className="text-gray-600 font-medium">
                      {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your library
                    </span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {recipes.map((recipe, index) => (
                    <div
                      key={recipe.id}
                      className="group bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Recipe #{recipe.id}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(recipe.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(recipe.recipe, recipe.id)}
                          className="group/copy flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-purple-50"
                        >
                          {copiedId === recipe.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100">
                        <div className="prose prose-purple max-w-none">
                          <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium text-sm">
                            {recipe.recipe}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
