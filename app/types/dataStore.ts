export type DataItem = {
  _id: string;      
  name: string;
  height?: string;      
  weight?: string;      
};


export type ChangeAction =
  | { type: "add"; item: DataItem }   
  | { type: "update"; id: string; item: Partial<DataItem> }
  | { type: "delete"; id: string };            


export type DataStore = {
  data: DataItem[];  
  cached: DataItem[];    
  loading: boolean;       
  changes: ChangeAction[]; 
};


export type DataActions = {
  fetchData: () => Promise<void>;
  addData: (item: Omit<DataItem, "_id">) => Promise<void>;
  updateData: (id: string, item: Partial<DataItem>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  syncWithServer: () => Promise<void>; 
};
