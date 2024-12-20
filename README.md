# Full Stack Expense Tracker

## Overview

**Track and manage your expenses effortlessly with the Full Stack Expense Tracker. This platform empowers users to gain insights into their spending habits while enjoying a user-friendly experience. Premium members can unlock the ability to download all their expenses as CSV files for easy storage and management.**

## Features

- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) for token-based authentication.
- **Expense Management**: Users can add, edit, and delete expenses.
- **Premium Features**: Premium members can download all expenses as CSV files for easy storage.
- **File Uploads**: Integrates AWS S3 for secure file storage, allowing users to upload receipts and related documents.
- **Responsive Design**: Built with a mobile-first approach, ensuring usability across devices.

## Technology Stack

- **Frontend**: JavaScript for a dynamic user interface.
- **Backend**: Node.js with Express for server-side logic.
- **Database**: MongoDB for data storage, providing a flexible schema.
- **Authentication**: JWT for secure authentication and session management.
- **File Storage**: AWS S3 for handling file uploads securely (Note: in future will use cloudinary for image file storage due to aws free tier limits).
- **Payment Gateway**: Razorpay for processing premium subscriptions securely.
- **Security**: Helmet.js for setting various HTTP headers to help protect the app from well-known web vulnerabilities.

# Test Login
Email: test@test.com .
Password: test

## Some Glimpses of Frontend
1.
![Screenshot 2024-11-13 203528](https://github.com/user-attachments/assets/e8a33bcc-b87b-4740-97da-1fb6e711f2c5)

2.
![image](https://github.com/user-attachments/assets/6203cade-75d9-4bdd-9df5-f89103bfaf71)



## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone [https://github.com/yourusername/expense-tracker.git](https://github.com/MSami625/ExpenseTracker-Backend.git)
   cd ExpenseTracker-Backend
   To run locally  update env file with your credentials
   npm install
   npm start
