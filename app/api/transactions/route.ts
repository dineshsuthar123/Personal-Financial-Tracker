import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    console.log('GET /api/transactions - Connecting to database...');
    await connectDB();
    console.log('GET /api/transactions - Fetching transactions...');
    const transactions = await Transaction.find().sort({ date: -1 });
    console.log(`GET /api/transactions - Found ${transactions.length} transactions`);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error in GET /api/transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/transactions - Connecting to database...');
    await connectDB();
    const data = await request.json();
    console.log('POST /api/transactions - Received data:', data);
    console.log('POST /api/transactions - Creating transaction...');
    const transaction = await Transaction.create(data);
    console.log('POST /api/transactions - Transaction created successfully');
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/transactions:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 