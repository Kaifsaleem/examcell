export enum UserTypes {
  ADMIN = 'ADMIN',
  INSTITUTE = 'INSTITUTE',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export type UserType = keyof typeof UserTypes | UserTypes;
