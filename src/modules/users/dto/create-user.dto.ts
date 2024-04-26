export class CreateUserDto {
  id: number;
  name?: string;
  username: string;
  email?: string;
  mobile?: string;
  password: string;
  avatar?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}
