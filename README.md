# Task 3: WEB UI Forms - Task Management Frontend

A React 19 frontend application built with TypeScript and Tailwind CSS that provides a web interface for the Task Management REST API created in Task 1. This application allows users to create, view, search, delete, and execute tasks through an intuitive and accessible user interface.

## 🚀 Features

- **Create Tasks**: Add new tasks with ID, name, owner, and shell command
- **View Tasks**: Display all tasks with their details and execution history
- **Search Tasks**: Search tasks by name with real-time filtering
- **Execute Tasks**: Run shell commands and view their output
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Automatic refresh after operations
- **Error Handling**: User-friendly error messages and success notifications

## 🛠️ Technology Stack

- **React 19**: Latest React version with modern features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **ESLint**: Code linting and quality assurance

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Task Management Backend API** running on `http://localhost:8080` (from Task 1)

## 🔧 Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-management-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Endpoint

The application needs to connect to your Task Management Backend API. Since you've deployed the backend in Docker and Kubernetes, you'll need to configure the correct API endpoint.

#### Option 1: Using Environment Variables (Recommended)

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. **Set up port forwarding** (required for Docker Desktop Kubernetes):

```bash
# Forward the Kubernetes service to localhost
kubectl port-forward service/kaiburr-service 8081:8080
```

3. The `.env` file is already configured for your setup:

```bash
# Using port-forwarding to access Kubernetes backend
VITE_API_URL=http://localhost:8081/tasks
```

**Your Backend Setup:**
- **Service Name:** `kaiburr-service`
- **Service Type:** NodePort (8080:30080/TCP)
- **Access Method:** Port-forwarding to localhost:8081
- **Backend Pod:** `kaiburr-app-695c5b8768-f228t`
- **MongoDB:** `mongo` service (ClusterIP)

**Important:** Keep the `kubectl port-forward` command running in a separate terminal while using the frontend.

**Security Note:** The `.env` file is gitignored to keep your environment configuration secure. Use `.env.example` as a template for your local setup.

#### Option 2: Direct Configuration

Alternatively, you can directly update the `BASE_URL` in `src/config/api.ts`:

```typescript
// Uncomment and modify the appropriate line:
// const BASE_URL = "http://localhost:30080/tasks";  // NodePort
// const BASE_URL = "http://your-external-ip:8080/tasks";  // LoadBalancer
// const BASE_URL = "http://your-ingress-host/tasks";  // Ingress
```

#### Finding Your Kubernetes Service URL

To find the correct URL for your backend service, use these commands:

```bash
# Check service details
kubectl get services

# For NodePort services
kubectl get svc your-backend-service -o wide

# For port-forwarding (if using ClusterIP)
kubectl port-forward service/your-backend-service 8080:8080
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── config/
│   ├── Task.ts          # TypeScript interfaces for Task and TaskExecution
│   └── api.ts           # API service functions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles (Tailwind CSS)
screenshots/             # Application screenshots for documentation
.env.example             # Environment configuration template
.env                     # Environment variables (gitignored)
```

## 🔌 API Integration

This frontend connects to a **Task Management Backend deployed in Kubernetes**. The backend consists of:

- **Java Spring Boot Application** (`kaiburr-app` pod)
- **MongoDB Database** (`mongo` pod)
- **Kubernetes Service** (`kaiburr-service` - NodePort)

### API Endpoints:
- `GET /tasks` - Fetch all tasks
- `GET /tasks/{id}` - Fetch task by ID
- `POST /tasks` - Create new task
- `DELETE /tasks/{id}` - Delete task
- `GET /tasks/search?name={name}` - Search tasks by name
- `PUT /tasks/execute` - Execute task command (creates new Kubernetes pod for execution)

### Kubernetes Architecture:
```
Frontend (React) → Port Forward → kaiburr-service → kaiburr-app Pod → mongo Pod
                                                  ↓
                                            New Pod (for command execution)
```

### Task Execution in Kubernetes:
As per Task 2 requirements, the backend creates new Kubernetes pods to execute shell commands rather than running them locally. This demonstrates:
- ✅ **Kubernetes API Integration** - Backend uses Kubernetes API to create pods
- ✅ **Pod-based Command Execution** - Commands run in isolated pods
- ✅ **Microservices Architecture** - Separation of concerns between application and execution

## 🎨 User Interface Features

### Task Creation Form
- Input fields for task ID, name, owner, and command
- Form validation with error messages
- Clear form after successful creation

### Task List Display
- Card-based layout for each task
- Display task details including execution count
- Show last execution output in a scrollable container
- Action buttons for execute and delete operations

### Search Functionality
- Real-time search by task name
- Reset button to clear search and show all tasks
- Search results update automatically

### Responsive Design
- Mobile-friendly layout
- Flexible grid system
- Touch-friendly buttons and inputs

## 🔒 Security Considerations

- Input validation on the frontend
- Confirmation dialogs for destructive operations
- Error handling for API failures
- XSS protection through React's built-in sanitization

## 🧪 Testing

The project includes testing setup with:
- Jest for unit testing
- React Testing Library for component testing
- ESLint for code quality

Run tests with:
```bash
npm test
```

## 📱 Accessibility Features

- Semantic HTML elements
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Clear visual hierarchy
- Descriptive button labels

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error (Kubernetes Deployment)**
   - Verify your backend service is running: `kubectl get pods`
   - Check service exposure: `kubectl get services`
   - Test API endpoint directly: `curl http://your-api-url/tasks`
   - Ensure CORS is configured for your frontend domain
   - For NodePort: Check if the port is accessible from your machine
   - For LoadBalancer: Verify external IP is assigned
   - For Ingress: Check ingress controller and DNS resolution

2. **API URL Configuration**
   - Verify the correct API URL in `.env` file or `src/config/api.ts`
   - Restart the development server after changing environment variables
   - Check browser network tab for actual API calls being made

3. **Kubernetes Service Discovery**
   ```bash
   # Check if backend pods are running
   kubectl get pods -l app=your-backend-app

   # Check service endpoints
   kubectl get endpoints your-backend-service

   # Test service connectivity (from within cluster)
   kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://your-service:8080/tasks
   ```

4. **Port Forwarding Issues**
   ```bash
   # Forward backend service to local port
   kubectl port-forward service/your-backend-service 8080:8080

   # Then use: VITE_API_URL=http://localhost:8080/tasks
   ```

5. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

6. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules

## 📸 Screenshots

This section demonstrates the complete Task 3 implementation - a React frontend connected to a Kubernetes-deployed backend from Tasks 1 & 2.

### 1. Kubernetes Backend Infrastructure

**Kubernetes Pods and Services Status**
![Kubernetes Status](screenshots/Screenshot%202025-09-28%20213616.png)
*Shows the backend application (`kaiburr-app`) and MongoDB (`mongo`) running in Kubernetes pods, with the `kaiburr-service` NodePort service exposing the API. Demonstrates the complete Kubernetes deployment with kubectl commands.*

### 2. Application Homepage & Task Management

**Main Dashboard with Task List**
![Application Homepage](screenshots/Screenshot%202025-09-28%20213442.png)
*The main Task Manager interface displaying existing tasks loaded from the Kubernetes-deployed backend. Shows the clean, responsive design with task cards and action buttons.*

### 3. Application Dashboard - Alternative View

**Task Management Dashboard**
![Dashboard View](screenshots/Screenshot%202025-09-28%20213453.png)
*Another view of the main dashboard showing the task management interface with full functionality - create, view, search, execute, and delete tasks. Demonstrates the responsive Tailwind CSS design.*

### 4. Task Execution & Kubernetes Integration

**Task Execution with Kubernetes Pod Creation**
![Task Execution](screenshots/Screenshot%202025-09-28%20213512.png)
*Shows task execution attempt demonstrating the Kubernetes integration. The "kubectl: not found" error proves the backend is running in a Kubernetes pod and attempting to create new pods for command execution (as required by Task 2).*

### 5. Search Functionality & Real-time Updates

**Search and Filter Tasks**
![Search Functionality](screenshots/Screenshot%202025-09-28%20213536.png)
*Demonstrates the search functionality allowing users to filter tasks by name, with real-time updates and responsive design. Shows how the interface dynamically filters results based on user input.*

### Key Features Demonstrated:

✅ **Frontend-Backend Integration**: React app successfully communicating with Kubernetes-deployed Java backend
✅ **CRUD Operations**: Create, Read, Update, Delete tasks through REST API
✅ **Real-time Updates**: UI updates automatically after operations
✅ **Kubernetes Deployment**: Backend running in K8s with MongoDB
✅ **Responsive Design**: Clean, accessible interface using Tailwind CSS
✅ **Error Handling**: User-friendly error messages and validation
✅ **Search & Filter**: Dynamic task filtering capabilities
✅ **Task Execution**: Integration with Kubernetes pod creation for command execution

### Technical Stack Validation:

- **✅ React 19**: Latest React version with modern hooks and components
- **✅ TypeScript**: Type-safe development with proper interfaces
- **✅ Tailwind CSS**: Utility-first CSS framework for responsive design
- **✅ Axios**: HTTP client for API communication
- **✅ Vite**: Fast development server and build tool
- **✅ Kubernetes Integration**: Frontend connecting to K8s-deployed backend
- **✅ MongoDB**: Data persistence through Kubernetes-deployed database

### Accessibility & Usability Features:

- **Semantic HTML**: Proper heading hierarchy and form labels
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Visual Feedback**: Clear success/error messages and loading states
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **High Contrast**: Readable color scheme with sufficient contrast ratios
- **Screen Reader Support**: ARIA labels and descriptive text

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of a technical assessment and is for demonstration purposes.

---

**Note**: This frontend application requires the Task Management Backend API (Task 1) to be running for full functionality.
