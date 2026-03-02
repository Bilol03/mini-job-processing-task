import { RoleEnum } from "src/constants/enums"

export interface IUserProfileDto {
    id: string
    email: string,
    is_active: boolean
    roles: RoleEnum
 
}