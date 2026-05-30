export class CreateUserDto {
  id?: string;
  password?: string;
  email?: string;
  username!: string;
  scopes!: string[];
  createdAt?: Date;
}
