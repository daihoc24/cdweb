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
  forgotPassword(email: string) {
    return request({
      url: "/Auth/forgot-password",
      method: "POST",
      data: { email },
    });
  }
  verifyForgotPasswordCode(email: string, verificationCode: string) {
    return request({
      url: "/Auth/verify-forgot-password-code",
      method: "POST",
      data: { email, verificationCode },
    });
  }
  resetPassword(email: string, newPassword: string) {
    return request({
      url: "/Auth/reset-password",
      method: "POST",
      data: { email, newPassword },
    });
  }
  getListUser() {
    return request({
      url: "/User/getListUser",
      method: "GET",
    });
  }
  deleteUser(userId: number) {
    return request({
      url: `/User/DeleteUser/${userId}`,
      method: "DELETE",
    });
  }
  searchUserByName(name: string) {
    return request({
      url: `/User/searchUserByName?name=${name}`,
      method: "GET",
    });
  }
  creatUser(data: addUser) {
    return request({
      url: "/User/creatUser",
      method: "POST",
      data,
    });
  }
}

export const userService: UserService = new UserService();
