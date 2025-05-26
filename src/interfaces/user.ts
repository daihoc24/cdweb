export interface UserLogin {
  user_email: string;
  user_password: string;
}
export interface User {
  user_id:number,
  user_fullname: string;
  user_email: string;
  user_address: string;
  user_phone: string;
  user_birthDate: string;
  user_role: string
}
export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
export interface UserSignup {
  user_fullname: string;
  user_email: string;
  user_password: string;
  user_address: string;
  user_phone: string;
  user_birthDate: string;
}
export interface addUser {
  user_fullname: string;
  user_email: string;
  user_password:string;
  user_address: string;
  user_phone: string;
  user_birthDate: string;
  user_role: string
}
export interface AddUserFormValues {
  user_fullname: string;
  user_email: string;
  user_password: string;
  user_phone: string;
  user_birthDate: string;
  user_role: string;
  sonha: string;
  ward: string;
  district: string;
  province: string;
}
export interface UpdateUserFormValues {
  user_fullname: string;
  user_email: string;
  user_phone: string;
  user_birthDate: string;
  user_role: string;
  sonha: string;
  ward: string;
  district: string;
  province: string;
}
export interface updateUser {
  user_fullname: string;
  user_email: string;
  user_address: string;
  user_phone: string;
  user_birthDate: string;
  user_role: string
}