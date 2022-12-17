import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Auth } from './entities/auth.entity';
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PaginationDto } from '../general/pagination/pagination.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService // default Nest Service to generate JWT
  ) {}

  // Create a USER
  async create(createAuthDto: CreateAuthDto) {

    const { password, username, ...restUser } = createAuthDto;

    try {
      
      await this.authRepository.findOneBy( { username } );
      const newUser = this.authRepository.create({ 
        ...restUser,
        username,
        password: bcrypt.hashSync(password, 10)
      });

      const { uid, password: passwordDB, isActive, ...restUserDB } = await this.authRepository.save(newUser);
      return {
        ...restUserDB,
        uid,
        token: this.generateJWT( { uid: uid.toString()} )
      }

    } catch (error) {
      this.handleErrorsOnDB(error);
    }
  }

  // Login User
  async login(loginAuthDto: LoginAuthDto) {

    const { password, username } = loginAuthDto;


    const user = await this.authRepository.findOneBy( { username } );
    if (!user) throw new UnauthorizedException('User with those credentials not found --username');
    const { password: passwordDB, isActive, uid, ...restUser } = user;

    // Verify password
    const isValidPassword = bcrypt.compareSync( password, passwordDB );
    if ( !isValidPassword ) throw new UnauthorizedException('User with those credentials not found --password');

    return {
      ...restUser,
      uid,
      token: this.generateJWT( { uid: uid.toString()} )
    }

   
    
    
  }

  // Retrieve all Users from DB
  async findAll( paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;

    try {
      
      const allUsers = await this.authRepository.find({
        where: {},
        take: limit,
        skip: offset
      });

      return allUsers;

    } catch (error) {
      this.handleErrorsOnDB(error);
    }

  }

  async findOne(id: number) {
    const user = await this.authRepository.findOneBy( {uid: id} );
    if (!user) throw new BadRequestException(`User with ID: ${id} not found`);
    return user;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {

    const { password, ...restUpdateUser } = updateAuthDto;
    const oldUser = await this.findOne(id);

    const updatedUser = await this.authRepository.preload({
      ...oldUser,
      ...restUpdateUser,
      password: (password) ? bcrypt.hashSync(password, 10) : oldUser.password
    })

    const { uid, isActive, password: newPassword, ...restUserDB } = await this.authRepository.save(updatedUser);
    return {
      ...restUserDB,
      uid,
      token: this.generateJWT( { uid: uid.toString()} )
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // ----------------- HELPERS --------------------

  private generateJWT( payload: JwtPayload ) {
    return this.jwtService.sign( payload );
  }

  private handleErrorsOnDB( err: any ) {
    
    if ( err.errno === 1062 ) {
      throw new BadRequestException('That username was taken, just write another one');
    }
    if ( err.errno === 1052 ) {
      throw new BadRequestException(err.sqlMessage)
    }
    console.log(err);
    throw new InternalServerErrorException('Please check server --logs-- in console, error not handled yet');
  }


}
