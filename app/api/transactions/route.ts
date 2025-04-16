import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// Ensure proper handling in Vercel's serverless environment
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30; // 30 seconds timeout

// Add proper error handling for MongoDB connection
async function withDBConnection(handler: () => Promise<Response>) {
  try {
    await connectDB();
    return await handler();
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return withDBConnection(async () => {
    try {
      console.log('GET /api/transactions - Fetching transactions...');
      const transactions = await Transaction.find().sort({ date: -1 });
      console.log(`GET /api/transactions - Found ${transactions.length} transactions`);
      return NextResponse.json(transactions);
    } catch (error) {
      console.error('Error in GET /api/transactions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { error: 'Failed to fetch transactions', details: errorMessage },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: Request) {
  return withDBConnection(async () => {
    try {
      let data;
      try {
        data = await request.json();
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid JSON data' },
          { status: 400 }
        );
      }

      console.log('POST /api/transactions - Received data:', data);
      
      // Validate required fields
      if (!data.amount || !data.description || !data.type) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      console.log('POST /api/transactions - Creating transaction...');
      const transaction = await Transaction.create(data);
      console.log('POST /api/transactions - Transaction created successfully');
      return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
      console.error('Error in POST /api/transactions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { error: 'Failed to create transaction', details: errorMessage },
        { status: 500 }
      );
    }
  });
} 