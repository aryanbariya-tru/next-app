// src/types/user.ts

export type UserRole = "admin" | "principal" | "teacher" | "student" ;

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole | "";
  createdBy?: string;
}

export interface ICreateUserPayload extends Omit<IUser, "_id"> {}

export interface IApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  user?: T;
}
