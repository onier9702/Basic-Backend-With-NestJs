import { SetMetadata } from '@nestjs/common';

import { ListRoles } from '../interfaces/list-roles';

export const MetadataRoles = (...args: ListRoles[]) => { 

    return SetMetadata('roles', args);

}
