export interface User {
  username: string;
  password: string;
  createdAt: Date;
}

export interface CurrentUser {
  username: string;
  email: string;
  loginTime: Date;
}