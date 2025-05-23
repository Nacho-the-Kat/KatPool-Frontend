import { NextResponse } from 'next/server'

// Mock data for demonstration
const mockPayouts = [
  {
    payment_id: "xyz789",
    amount: "25.00",
    asset: "USD",
    status: "completed",
    date: "2024-04-28T10:15:00Z"
  },
  {
    payment_id: "abc123",
    amount: "50.00",
    asset: "USD",
    status: "completed",
    date: "2024-04-27T15:30:00Z"
  },
  {
    payment_id: "def456",
    amount: "75.00",
    asset: "USD",
    status: "pending",
    date: "2024-04-26T09:45:00Z"
  }
]

export async function GET() {
  try {
    // TODO: 
    // In a real implementation, you would:
    // 1. Fetch data from Uphold API
    // 2. Transform the data to match the required format
    // 3. Handle authentication and error cases
    
    return NextResponse.json({
      status: 'success',
      data: mockPayouts
    })
  } catch (error) {
    console.error('Error fetching Uphold payouts:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch Uphold payouts'
      },
      { status: 500 }
    )
  }
} 