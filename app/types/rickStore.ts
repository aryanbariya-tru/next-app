export type Rick ={
    id:number;
    name:string;
    status:string;
    species:string;
    type:string;
    gender:string;
    origin:{
        name:string;
        url:string;
    };
    image:string;
};
export type Pagination = {
  current: number;
  next: number | null;
  last: number;
  records: number;
};
export type RickResponse = {
  data: Rick[];
  meta: {
    pagination: Pagination;
  };
};

export type RickStore = {
  results: Rick[];
  pagination: Pagination | null;
  fetchRick: (page?: number) => Promise<void>;
  fetchONE: (id: number) => Promise<void>;
  fetchSearch: (name: string) => Promise<void>;
};