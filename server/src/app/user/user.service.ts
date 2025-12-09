import { User } from './user.model';
import type { CreateUserDTO, UserDTO } from './user.schema';

const userService = {
  createUser: async (userDto: CreateUserDTO): Promise<UserDTO> => {
    const newUser = await User.create(userDto);

    return {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };
  },
};

export default userService;
