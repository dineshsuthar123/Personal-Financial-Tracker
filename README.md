# Personal Finance Visualizer

A modern web application for tracking and visualizing personal finances built with Next.js, React, TypeScript, and MongoDB.


## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Data Visualization**: View monthly expenses through interactive charts
- **Filtering & Sorting**: Filter transactions by type and date range
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components for a polished look and feel

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Data Visualization**: Recharts
- **Database**: MongoDB
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB running locally or a MongoDB Atlas account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   ```
   Replace with your MongoDB connection string if using MongoDB Atlas.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
personal-finance-visualizer/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── components/       # React components
│   └── page.tsx          # Main page component
├── components/           # Shared components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions
├── models/               # MongoDB models
├── public/               # Static assets
└── styles/               # Global styles
```

## Usage

1. **Adding Transactions**: Click the "Add Transaction" button to add a new income or expense.
2. **Viewing Transactions**: All transactions are displayed in the Transactions tab.
3. **Visualizing Data**: Switch to the Overview tab to see your monthly expenses chart.
4. **Filtering**: Use the filter dropdowns to filter transactions by type and date range.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Next.js](https://nextjs.org/) for the amazing React framework

📬 Contact
Got questions or suggestions?
Reach out on @Dinesh12839101[Twitter]

