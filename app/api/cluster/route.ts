import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { detail: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { detail: 'Please upload a CSV file' },
        { status: 400 }
      )
    }

    // Create new FormData for the FastAPI request
    const apiFormData = new FormData()
    apiFormData.append('file', file)

    // Forward the request to the FastAPI clustering service
    // Note: Update this URL to match your clustering API endpoint
    const clusteringApiUrl = process.env.CLUSTERING_API_URL || 'http://localhost:8000'
    
    const response = await fetch(`${clusteringApiUrl}/predict_csv`, {
      method: 'POST',
      body: apiFormData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { detail: errorData.detail || 'Failed to process CSV file' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Clustering API error:', error)
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }
}