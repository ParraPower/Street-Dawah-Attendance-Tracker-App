export class CreateUserDto {
  name?: string;
  mobile!: string;
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';
  currentSuburb?: number;
  authUserId?: number;
  createdAt?: Date;
}
