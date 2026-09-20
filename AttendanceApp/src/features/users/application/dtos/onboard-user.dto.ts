export class OnboardUserDto {
  authUserId!: number;
  name!: string;
  mobile!: string;
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL';
  currentSuburb?: number;
  whatsAppMsgOptIn?: boolean;
}
