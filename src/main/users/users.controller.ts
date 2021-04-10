import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApplyForCommentaryDto } from './dto/applyForCommentary.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { UserJoinedDto } from './dto/userJoined.dto';
import { UserLoginDto } from './dto/userlogin.dto';
import { UserSignupDto } from './dto/userSignup.dto';
import { UsersService } from './strategies/users.service';

@Controller('users')
export class UsersController {
	constructor(readonly usersService: UsersService) {}

	@Get(':id')
	async getById(@Param() params:{id:string}){
		return this.usersService.getUserById(params.id);
	}
	
	@Patch('/login/automatic/:id')
	async automaticLogin(@Param() params:{id:string}){
		return this.usersService.addAutomaticLogin(params.id);
	}

	@Patch('/start/kyc')
	async startKyc(@Body() params: ApplyForCommentaryDto): Promise<void> {
		return this.usersService.startKyc(params);
	}

	@Patch('/join/commentary')
	async userJoinedMatch(@Body() params: UserJoinedDto): Promise<void> {
		return this.usersService.userJoinedMatch(params);
	}

	@Patch('login')
	async loginUser(@Body() params: UserLoginDto): Promise<LoginResponseDto> {
		return this.usersService.login(params);
	}

	@Patch('signup')
	async signupUser(@Body() params: UserSignupDto): Promise<{userId:string; isCommentator:boolean}> {
		return this.usersService.signup(params);
	}
}
