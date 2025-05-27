import { AxiosResponse } from "axios";
import { request } from "../config/api";
import { addUser, UpdatePasswordDto, updateUser, UserLogin, UserSignup } from "../interfaces/user";

class UserService {
  getUserById(userId: number | undefined): Promise<AxiosResponse<any>> {
    return request({
      url: `/User/UserInformation/${userId}`,
      method: "GET",
    });
  }
}

export const userService: UserService = new UserService();
