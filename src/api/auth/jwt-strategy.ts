import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("JWT_SECRET"), // ← undefined bo'lmaydi
        });
    }

    async validate(payload: { userId: string; role: string }) {
        const user = await this.userRepository.findOne({
            where: { id: payload.userId },
        });

        if (!user || !user.is_active) {
            throw new UnauthorizedException("Access denied");
        }

        return user;
    }
}