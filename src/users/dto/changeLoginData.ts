export interface ChangePasswordDto {
  id:string,
  oldPassword:string,
  newPassword:string,
}

export interface ChangeEmailDto {
  id:string,
  newEmail:string,
  password:string,
}