export class CreateUserDto {
  id?: string;
  tempPassword?: string;
  email!: string;
  username!: string;
  scopes!: string[];
  createdAt?: Date;
}
