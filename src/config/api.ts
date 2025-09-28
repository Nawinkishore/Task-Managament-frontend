import axios from "axios";
import type { Task } from "./Task";

// API Configuration
// Update this URL based on your Kubernetes service exposure method:
// - For NodePort: http://localhost:<nodeport>/tasks
// - For LoadBalancer: http://<external-ip>:<port>/tasks
// - For Ingress: http://<ingress-host>/tasks
// - For port-forward: http://localhost:<forwarded-port>/tasks

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:30080/tasks";

// Your Kubernetes setup (NodePort service on port 30080):
// Service: kaiburr-service (NodePort) - 8080:30080/TCP
// Backend Pod: kaiburr-app-695c5b8768-f228t
// MongoDB: mongo service (ClusterIP) - 27017/TCP

export const getTasks = () => axios.get<Task[]>(BASE_URL);
export const getTaskById = (id: string) => axios.get<Task>(`${BASE_URL}/${id}`);
export const createOrUpdateTask = (task: Task) => axios.post(BASE_URL, task); // POST
export const deleteTask = (id: string) => axios.delete(`${BASE_URL}/${id}`);
export const searchTasks = (name: string) => axios.get<Task[]>(`${BASE_URL}/search?name=${name}`);
export const executeTask = (id: string) => axios.put(`${BASE_URL}/execute`, { id });
