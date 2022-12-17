

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";

import { Auth } from '../entities/auth.entity';
import { JwtPayload } from "../interfaces/jwt-payload.interface";

// Remember make this class an injectable to allow use this class wherever
// and add this injectable providers in AuthModule as a provider and an exports
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() 
            // here above the way to send token is via Bearer token
        });
    }


    async validate( payload: JwtPayload ) :Promise<Auth> {

        const { uid } = payload;

        console.log('User logged in From Strategy: ', uid);
        
        const user = await this.authRepository.findOneBy( {uid: +uid} );
        if ( !user ) 
            throw new UnauthorizedException('Token not valid');

        if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk to Admin');


        return user;  // is important this return because this add user to request
        // the preview return make this: req: request => req.user = user;

        // it means: req.user is added to request Express
    }


}