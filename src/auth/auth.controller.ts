import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PaginationDto } from '../general/pagination/pagination.dto';
import { AuthDecorator } from './decorators/auth.decorator';
import { ListRoles } from './interfaces/list-roles';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './entities/auth.entity';
import { ListDataUser } from './interfaces/list-data-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('sign-in')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get()
  @AuthDecorator(ListRoles.admin, ListRoles.superUser)
  // @AuthDecorator()
  findAll(
    // @GetUser() user: Auth,
    @GetUser(`${ListDataUser.uid}`) data: any,
    @Query() paginationDto: PaginationDto
  ) {
    // console.log('User from GetUser: ', user);
    console.log(`User ${ListDataUser.uid} from GetUser: `, data);
    
    return this.authService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
