import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/api/users/entities/user.entity' 
import { IUserProfileDto } from 'src/dtos'

export const CurrentUser = createParamDecorator(
	(data: keyof IUserProfileDto, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<{ user: IUserProfileDto }>()
		const user = request.user		
		return data ? user[data] : user
	}
)
