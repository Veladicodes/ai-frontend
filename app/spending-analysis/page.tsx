'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, BarChart3, TrendingUp, Zap, Shield, FileText, Brain, AlertCircle, CheckCircle2, RotateCcw, Heart } from 'lucide-react'

// TypeScript types for API responses
interface ClusterResult {
  cluster: number
  persona: string
}

interface ApiError {
  detail: string
}

interface CategoryData {
  category: string
  amount: number
  percentage: number
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

const personaDetails = {
  "Disciplined Planner": {
    tagline: "You save smartly, invest in growth, and rarely splurge impulsively.",
    description: "Methodical with spending, focuses on long-term financial goals and careful budgeting.",
    icon: Shield,
    color: "bg-green-100 text-green-800 border-green-200"
  },
  "Experience Seeker": {
    tagline: "You value fun and experiences, but sometimes overspend on weekends.",
    description: "Values experiences and personal growth, willing to spend on meaningful activities.",
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  "Spontaneous Spender": {
    tagline: "You enjoy spontaneous purchases and late-night shopping.",
    description: "Makes impulsive purchases, often driven by emotions and immediate desires.",
    icon: Zap,
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
  "Routine Essentialist": {
    tagline: "You prioritize essentials and stick to stable routines.",
    description: "Consistent spending patterns, focuses on necessities and established routines.",
    icon: BarChart3,
    color: "bg-orange-100 text-orange-800 border-orange-200"
  }
}

export default function SpendingAnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [result, setResult] = useState<ClusterResult | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [error, setError] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError('')
      setResult(null)
    } else {
      setError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const analyzeSpending = async () => {
    if (!file) {
      setError('Please select a CSV file first')
      return
    }

    setUploadState('uploading')
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Use the Next.js API route which proxies to the clustering API
      const response = await fetch('/api/cluster', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.detail || 'Failed to process CSV file')
      }

      const data: ClusterResult = await response.json()
      setResult(data)
      setUploadState('success')

      // Mock category data for demonstration
      const mockCategoryData: CategoryData[] = [
        { category: 'Survival', amount: 1200, percentage: 40 },
        { category: 'Growth', amount: 600, percentage: 20 },
        { category: 'Joy', amount: 750, percentage: 25 },
        { category: 'Impulse', amount: 450, percentage: 15 }
      ]
      setCategoryData(mockCategoryData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      setUploadState('error')
    }
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setError('')
    setUploadState('idle')
    setCategoryData([])
    // Reset file input
    const fileInput = document.getElementById('csv-file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const getPersonaColor = (cluster: number) => {
    const colors = {
      0: 'bg-blue-100 text-blue-800 border-blue-200',
      1: 'bg-green-100 text-green-800 border-green-200',
      2: 'bg-orange-100 text-orange-800 border-orange-200',
      3: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[cluster as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const PersonaIcon = result ? personaDetails[result.persona as keyof typeof personaDetails]?.icon : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Discover Your Spending Personality
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your transaction data and get personalized insights to master your money at 18-25
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">AI-Powered Analysis</Badge>
            <Badge variant="secondary" className="text-xs">4 Spending Personas</Badge>
            <Badge variant="secondary" className="text-xs">Instant Results</Badge>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Upload className="h-6 w-6" />
              Upload Your CSV File
            </CardTitle>
            <CardDescription>
              Upload a CSV file with columns: timestamp, amount, category (Survival, Growth, Joy, Impulse)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Choose CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={uploadState === 'uploading'}
                className="cursor-pointer"
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={analyzeSpending}
                disabled={!file || uploadState === 'uploading'}
                className="flex-1"
                size="lg"
              >
                {uploadState === 'uploading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Spending
                  </>
                )}
              </Button>
              
              {(result || error) && (
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {uploadState === 'uploading' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Your spending persona based on transaction patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                <p className="text-gray-600">Analyzing your spending patterns...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {result && uploadState === 'success' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Enhanced Persona Card */}
            <Card className={`border-2 ${personaDetails[result.persona as keyof typeof personaDetails]?.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const PersonaIcon = personaDetails[result.persona as keyof typeof personaDetails]?.icon;
                    return PersonaIcon ? <PersonaIcon className="h-8 w-8" /> : null;
                  })()}
                  <div>
                    <div className="text-2xl font-bold">{result.persona}</div>
                    <div className="text-sm font-normal opacity-80">Your Spending Personality</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  {personaDetails[result.persona as keyof typeof personaDetails]?.tagline}
                </p>
                
                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Cluster ID:</span>
                    <Badge variant="secondary">{result.cluster}</Badge>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {personaDetails[result.persona as keyof typeof personaDetails]?.description}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 What this means for you:</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    As a <strong>{result.persona}</strong>, you have unique financial strengths and areas for growth. 
                    Understanding your spending personality is the first step to building better money habits.
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Next steps:</strong> Use these insights to set realistic financial goals that match your personality.</p>
                    <p><strong>Remember:</strong> There's no "perfect" spending type - each has its own advantages!</p>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={resetForm} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Analyze Another File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Spending Breakdown</CardTitle>
                  <CardDescription>Your spending distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.category}</span>
                          <span>${category.amount} ({category.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educational Section */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Understanding Your Spending Categories
                </CardTitle>
                <CardDescription>
                  Learn what each category means and how to optimize your spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-green-700 mb-1">🛡️ Survival</h4>
                      <p className="text-sm text-gray-600">Rent, groceries, utilities, transportation - your essential needs.</p>
                      <p className="text-xs text-green-600 mt-1"><strong>Tip:</strong> Aim for 50-60% of income</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-blue-700 mb-1">📈 Growth</h4>
                      <p className="text-sm text-gray-600">Education, skills, investments - building your future.</p>
                      <p className="text-xs text-blue-600 mt-1"><strong>Tip:</strong> Invest 10-20% in yourself</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-purple-700 mb-1">🎉 Joy</h4>
                      <p className="text-sm text-gray-600">Entertainment, hobbies, social activities - what makes life fun.</p>
                      <p className="text-xs text-purple-600 mt-1"><strong>Tip:</strong> Budget 15-25% for happiness</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-medium text-orange-700 mb-1">⚡ Impulse</h4>
                      <p className="text-sm text-gray-600">Unplanned purchases, late-night shopping, spontaneous buys.</p>
                      <p className="text-xs text-orange-600 mt-1"><strong>Tip:</strong> Keep under 10% if possible</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Pro tip for 18-25 year olds:</strong> Your spending patterns now set the foundation for your financial future. 
                    Small changes in impulse spending can lead to significant savings over time!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>CSV File Format</CardTitle>
            <CardDescription>
              Your CSV file should contain the following columns:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li><code className="bg-gray-100 px-1 rounded">timestamp</code> - Transaction date/time</li>
                  <li><code className="bg-gray-100 px-1 rounded">amount</code> - Transaction amount (numeric)</li>
                  <li><code className="bg-gray-100 px-1 rounded">category</code> - Spending category</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Valid Categories:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li><Badge variant="outline" className="text-xs">Survival</Badge> - Essential needs</li>
                  <li><Badge variant="outline" className="text-xs">Growth</Badge> - Personal development</li>
                  <li><Badge variant="outline" className="text-xs">Joy</Badge> - Entertainment & leisure</li>
                  <li><Badge variant="outline" className="text-xs">Impulse</Badge> - Spontaneous purchases</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}