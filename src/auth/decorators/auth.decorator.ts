import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ListRoles } from '../interfaces/list-roles';
import { MetadataRoles } from './metadata-roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

export const AuthDecorator = (...roles: ListRoles[]) => { 


    return applyDecorators(
        MetadataRoles( ...roles ),  // Decorator to establish Roles in Metadata
        UseGuards(
            AuthGuard(), // default guard of nestjs/passport who check user token
            RolesGuard
        )
    )

}
