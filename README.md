# URLs App

## Description
URLs App is a web application that fetches metadata (like titles, descriptions, and images) from a list of URLs provided by the user. It uses Express.js for the backend, and React for the frontend.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation
1. **Clone the repository**:
```bash
git clone https://github.com/juampi58/urls-metadata-fetcher.git
```

2. **Navigate to the project directory**:
```bash
cd urls-metadata-fetcher
```

3. **Install dependencies**: 
Navigate to both the `backend` and `frontend` directories and install the dependencies.
```bash
npm install
cd backend
npm install


```

## Usage
1. **Start the backend server**:
```bash
npm run server
```

2. **Start the frontend**:
```bash
cd .
npm run client
```

3. Open your browser and navigate to `http://localhost:3000`.

## Testing
To deploy this app to Heroku:
1. **Backend**:
```bash
cd backend
npm test
```
2. **Frontend and e2e**:
```bash
npm test
```

## Contributing
Contributions are welcome! Please follow these steps:
1. **Fork the repository**.
2. **Create a new branch** for your feature or bugfix:
```bash
git checkout -b feature/your-feature-name
```
3. **Commit your changes**:
```bash
git commit -m "Add your feature"
```
4. **Push to the branch**:
```bash
git push origin feature/your-feature-name
```
5. **Create a pull request**.

