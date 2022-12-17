import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth } from '../entities/auth.entity';
import { ListRoles } from '../interfaces/list-roles';



@Injectable()
export class RolesGuard implements CanActivate {


  constructor( private readonly reflector: Reflector ) {}

  canActivate( context: ExecutionContext ): boolean | Promise<boolean> {

    const ValidRoles: string[] = this.reflector.get<ListRoles[]>('roles', context.getHandler());
    
    if ( !ValidRoles || !ValidRoles.length) return true;

    const req = context.switchToHttp().getRequest(); // Get Request as make Express in Node Js
    const user = req.user as Auth; // this is an user as entity auth user
    
    if (!user) throw new UnauthorizedException('Not Valid User was found');

    for (const role of user.roles) {
      if ( ValidRoles.includes(role) ) return true;
    }

    throw new ForbiddenException(`User ${user.username} does not have one valid role [ ${ValidRoles} ]`);
  }
}
