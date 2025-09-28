import axios from "axios";
import type { Task } from "./Task";

const BASE_URL = "http://localhost:8080/tasks";

export const getTasks = () => axios.get<Task[]>(BASE_URL);
export const getTaskById = (id: string) => axios.get<Task>(`${BASE_URL}/${id}`);
export const createOrUpdateTask = (task: Task) => axios.post(BASE_URL, task); // POST
export const deleteTask = (id: string) => axios.delete(`${BASE_URL}/${id}`);
export const searchTasks = (name: string) => axios.get<Task[]>(`${BASE_URL}/search?name=${name}`);
export const executeTask = (id: string) => axios.put(`${BASE_URL}/execute`, { id });
