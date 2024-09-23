# JsonCharts Installation and Usage Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation Instructions](#installation-instructions)
4. [Usage](#usage)

## Introduction
JsonCharts is a web application that allows users to upload JSON files and visualize the data through various chart types. The application features user authentication, secure password storage, and dynamic chart generation.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [SQLite](https://www.sqlite.org/index.html) (for database management)

## Installation Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/JsonCharts.git
   cd JsonCharts
2. **Install Dependencies Run the following command to install all required npm packages:**
    ```bash
   npm install
   ```
3. **Set Up the Database Create the SQLite database by running the ``createDB.js`` script:**
    ```bash
   node createDB.js
   ```
4. **Start the Application To start the application, run:**
    ```bash
   npm start
   ```
## User Registration
Before you can log in to the system, you need to register users in the database. The ``/register`` endpoint is not exposed through a form, so you'll need to use Postman to send POST requests to register users.

### Registering Users with Postman
1. Open Postman and create a new POST request to:
   ```bash
   http://localhost:3000/register
   ```
2. Set the body to ``x-www-form-urlencoded`` with the following fields:
 - ``username``: The user's email (e.g., sophie@gmail.com).
 - ``password``: The user's password (e.g., sophie123).
3. Send the request to create the user.
4. Repeat the same steps for any additional users.


## Usage
1. Access the Application Open your web browser and navigate to http://localhost:3000.
2. User Registration and Login
 - Login: Enter the registered email and password to access the dashboard.
3. Uploading JSON Files
 - After logging in, you will be directed to the upload page.
 - Select a JSON file formatted as follows:
   ```json
    [
      {"label": "January", "value": 150},
      {"label": "February", "value": 200},
      {"label": "March", "value": 175},
      {"label": "April", "value": 250}
   ] 
    ```
- Click the upload button to submit your file.

4. Generating Charts

 - After uploading, choose the type of chart you want to generate (Bar, Line, Pie, Doughnut).
 - The chart will be displayed below the options based on the uploaded data.