import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';


export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30;

async function withDBConnection(handler: () => Promise<Response>) {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connection successful');
    return await handler();
  } catch (error) {
    console.error('Database connection error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      },
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
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { 
          error: 'Failed to fetch transactions', 
          details: errorMessage,
          name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : undefined
        },
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
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        { 
          error: 'Failed to create transaction', 
          details: errorMessage,
          name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  });
} 