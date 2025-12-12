import { UserDTO } from './user-dto';

export interface AuthenticateUserResponseDTO {
  token: string;
  user: UserDTO;
}
