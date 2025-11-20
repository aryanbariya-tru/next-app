export type FileItem = {
  id: number;
  url: string;
  userId: number;
  createdAt: string; 
};

export type User = {
  id: number;
  name: string;
  email: string;
  password:string;
  role: string;
  createdAt: string;
  files: FileItem[];
};

export type ReguserStore = {
  user:string|null;
  token:string|null;
  results: User[];
  fetchRegusers: () => Promise<void>;
  loginUsers: (payload: FormData) => Promise<{ success: boolean; data?: User }>;
  createReguser: (payload: FormData) => Promise<{ success: boolean; data?: User }>;
};
