# Gametheory IIT2021210

## Project Description
This project is a **booking app** for a sports technology company's operations team. The app allows users to book courts, view available slots, and manage sports-related bookings. It also allows admins or managers to modify predefined slots.

## College ID
**IIT2021210**

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [Run the Project](#run-the-project)
- [Deploy the Project](#deploy-the-project)
- [Prerequisites](#prerequisites)
- [Dependencies](#dependencies)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Special Instructions](#special-instructions)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SKU08/Gametheory.git
   cd Gametheory
   ```

2. **Install the required dependencies**:
   Make sure you have Node.js installed. Then, run:
   ```bash
   npm install
   ```

3. **Set up the database**:
   * Install MongoDB and start the MongoDB server
   * Update your `.env` file (or create one) with the following details:
     ```env
     DB_URI=mongodb://localhost:27017/booking-app
     PORT=5000
     ```
   * If there are any scripts to set up collections or initialize data, follow the specific instructions

## Run the Project

1. **Start the backend server**:
   To run the Node.js server locally, use the following command:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Access the application**:
   Once the server is running, navigate to `http://localhost:5000` in your browser to access the application

## Deploy the Project

1. Ensure the environment variables (like `DB_URI`) are correctly set up on the production server
2. Deploy the project using any preferred platform (e.g., **Heroku**, **AWS**, **DigitalOcean**)
3. For Heroku:
   * Push the code to a new Heroku app by running:
     ```bash
     heroku create
     git push heroku main
     ```
   * Make sure the MongoDB URI is set in the Heroku app's config variables

## Prerequisites

Before running this project, ensure you have:
* **Node.js** (v14+)
* **npm** (v6+)
* **MongoDB** (v4.0+)

## Dependencies

Here are the major dependencies for the project:
```json
{
  "express": "^4.17.1",
  "mongoose": "^5.13.3",
  "cors": "^2.8.5",
  "dotenv": "^8.2.0"
}
```
Install all dependencies by running `npm install` from the root folder of the project.

## Assumptions and Limitations

### Assumptions:
* The admin/manager is responsible for adding and modifying the available slots for bookings
* Only registered users are allowed to make bookings

### Limitations:
* The current version does not include user authentication. User login/logout mechanisms need to be added in future iterations
* This app only supports bookings for one sport at a time

## Special Instructions

* **Environment Variables**: Ensure the `.env` file is properly set with the MongoDB URI (`DB_URI`) and server port (`PORT`)
* **MongoDB Setup**: Ensure MongoDB is installed and running locally for development
* **Running Tests**: There are no automated tests available in the current version. Testing should be done manually