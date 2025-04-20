# V-Chat - Real-Time Messaging Application

A full-stack real-time chat application built with Django, Django REST Framework, Django Channels, React, and Redux.

## Features

- **Real-time messaging** using WebSockets and Django Channels
- **User authentication** with JWT tokens
- **Profile management** with image upload capability
- **Responsive UI** built with React and TailwindCSS
- **State management** using Redux Toolkit
- **Database integration** with PostgreSQL
- **Messaging queue** with Redis for WebSocket communication

## Tech Stack

### Backend

- **Django 5.2**: Web framework for building the API
- **Django REST Framework**: RESTful API toolkit
- **Django Channels**: WebSocket support for real-time communication
- **PostgreSQL**: Database for storing user data and messages
- **Redis**: Message broker for WebSocket connections
- **JWT Authentication**: Secure user authentication
- **Daphne**: ASGI server for Django Channels

### Frontend

- **React**: JavaScript library for building user interfaces
- **Redux Toolkit**: State management
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Vite**: Build tool and development server

## Project Structure

The project follows a standard structure with separate directories for backend and frontend:

```
├── backend/             # Django backend
│   ├── users/           # User authentication and messaging app
│   └── vchat/           # Main Django project
├── frontend/            # React frontend
│   └── vchat/           # Vite-based React application
```

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/amrazz/v-chat.git
   cd vchat/backend
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   cd vchat
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `vchat` directory with the following variables:
   ```
   SECRET_KEY=your_secret_key
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

5. Set up the database
   ```bash
   cd vchat
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create a superuser (optional)
   ```bash
   python manage.py createsuperuser
   ```

7. Start the Redis server
   ```bash
   # Install Redis if not already installed
   # On Ubuntu: sudo apt install redis-server
   # On macOS: brew install redis
   redis-server
   ```

8. Run the Django development server
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../../frontend/vchat
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. The application will be available at `http://localhost:5173`

## API Endpoints

The application provides the following API endpoints:

### Authentication

- `POST /api/users/register/`: Register a new user
- `POST /api/users/login/`: Log in a user
- `POST /api/users/logout/`: Log out a user
- `POST /api/token/`: Obtain JWT access token
- `POST /api/token/refresh/`: Refresh JWT token

### User Management

- `PUT /api/users/update-profile/`: Update user profile
- `GET /api/users/list-user/`: Get list of all users
- `GET /api/users/user-message/<user_id>/`: Get messages with a specific user

## WebSocket Communication

The application uses WebSockets for real-time messaging. WebSocket connections are established using the following route:

```
ws://localhost:8000/ws/chat/<user_id>/
```

## Deployment

### Backend Deployment

1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your production domain
3. Configure your production database in `settings.py`
4. Set up a production ASGI server (Daphne/Uvicorn)
5. Configure Redis for production

### Frontend Deployment

1. Build the React application
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web server



## Acknowledgements

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)


Project Link: [https://github.com/amrazz/v-chat](https://github.com/amrazz/v-chat)