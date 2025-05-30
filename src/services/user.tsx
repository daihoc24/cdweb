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
  updatePassword(userId: number, data: UpdatePasswordDto) {
    return request({
      url: `/User/update-password/${userId}`,
      method: "POST",
      data,
    });
  }
  loginUser(data: UserLogin) {
    return request({
      url: "/Auth/Login",
      method: "POST",
      data,
    });
  }
  signUp(data: UserSignup) {
    return request({
      url: "/Auth/Signup",
      method: "POST",
      data,
    });
  }
  verifyEmail(email: string, code: string) {
    return request({
      url: "/Auth/Verify",
      method: "POST",
      data: { email, code },
    });
  }
  updateUser(userId: number, data: any) {
    return request({
      url: `/User/UpdateUser/${userId}`,
      method: "PUT",
      data,
    });
  }
}

export const userService: UserService = new UserService();
