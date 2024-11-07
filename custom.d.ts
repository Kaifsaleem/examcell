declare global {
  namespace Express {
    interface User {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      type:  'ADMIN' | 'INSTITUTE' | 'TEACHER' | 'STUDENT';
    }

    type Auth = {
      isAuthenticated: boolean;
      sub?: string;
      iat?: number;
      exp?: number;
      user?: User;
    };

    interface Request {
      auth: Auth;
    }
  }
}

export {};
