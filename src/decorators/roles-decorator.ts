// roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "src/constants/enums";
import { ROLES_KEY } from "src/guards/role-guard";


export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);