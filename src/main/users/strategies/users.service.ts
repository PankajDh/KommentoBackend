import { Injectable } from '@nestjs/common';
import * as pg from 'pg';
import { Helper } from '../../../helper';
import { ApplyForCommentaryDto } from '../dto/applyForCommentary.dto';
import { UserJoinedDto } from '../dto/userJoined.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('../../../../ormconfig.json');
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from '../dto/userlogin.dto';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { UserSignupDto } from '../dto/userSignup.dto';

@Injectable()
export class UsersService {
	async addLoginDetails(phoneNumber: string): Promise<any> {
		let pool;
		try {
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const queryResult = await pool.query(
				`select * from users where phone_number=$1`,
				[phoneNumber],
			);

			let userDetails;
			if (queryResult?.rows[0]) {
				const updateResults = await pool.query(
					`update users set last_login = $1 where id = $2 returning *`,
					[new Date(), queryResult.rows[0].id],
				);
				userDetails = updateResults?.rows[0];
			} else {
				const insertResults = await pool.query(
					`insert into users(phone_number, last_login) values($1, $2) returning *`,
					[phoneNumber, new Date()],
				);
				userDetails = insertResults?.rows[0];
			}
			await pool.end();
			return Helper.convertToCamelCaseObject(userDetails);
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async startKyc(params: ApplyForCommentaryDto): Promise<void> {
		let pool;
		try {
			const { canCall, email, userId } = params;
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			await pool.query(
				`update users set email=$1, can_call=$2, kyc_requested_at=now(), kyc_status='REQUESTED' where id=$3`,
				[email.trim(), canCall, userId],
			);
			await pool.end();
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async userJoinedMatch(params: UserJoinedDto): Promise<void> {
		const { commentaryId, userId, currentState } = params;
		let pool;
		try {
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const selectResult = await pool.query(
				`select * from user_match_relation where user_id=$1 and commentary_id=$2`,
				[userId, commentaryId],
			);

			const userMatchRelation = selectResult.rows[0];
			const newJoinDetails = {
				event_time: new Date(),
				status: currentState,
			};
			if (userMatchRelation) {
				const totalJoinDetails = userMatchRelation.join_details ?? [];
				totalJoinDetails.push(newJoinDetails);

				await pool.query(
					`update user_match_relation set current_state=$1, join_details=$2 where id = $3`,
					[
						currentState,
						JSON.stringify(totalJoinDetails),
						userMatchRelation.id,
					],
				);
			} else {
				await pool.query(
					`insert into user_match_relation(user_id,commentary_id,current_state,join_details) values($1,$2,$3,$4)`,
					[
						userId,
						commentaryId,
						currentState,
						JSON.stringify([newJoinDetails]),
					],
				);
			}
			await pool.end();
		} catch (err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async login(params:UserLoginDto):Promise<LoginResponseDto> {
		const {phoneNumber, code} = params;
		let pool;
		try {
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database
			});
			const selectResult = await pool.query(
				`select * from users where phone_number=$1`,
				[phoneNumber.trim()],
			);
			await pool.end();
			
			const userDetails = selectResult.rows[0];
			if (!userDetails) {
				return {
					newUser :true
				};
			}

			const passcodeCompare =  await bcrypt.compare(code, userDetails.passcode);
			if (passcodeCompare) {
				const {id, is_commentator} = userDetails;
				await this.addLoginDetails(userDetails.phone_number);
				return {
					userId: id,
					isCommentator: is_commentator,
					verified:true,
					newUser:false
				}	
			}
			return {
				verified:false,
				newUser: false
			};
		} catch(err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}	
	}

	async signup(params:UserSignupDto) : Promise<{userId:string; isCommentator:boolean}>{
		let pool;
		try {
			const {phoneNumber, code} = params;
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database
			});
			const selectResult = await pool.query(
				`select * from users where phone_number=$1`,
				[phoneNumber.trim()],
			);
			const userDetails =  selectResult.rows[0];
			const hashedCode =  await bcrypt.hash(code, 10);
			
			let newUserDetails;
			if (userDetails) {
				const updateResults = await pool.query(`update users set passcode=$1, last_login=$2 where id = $3 returning *`,[hashedCode, new Date(), userDetails.id]);
				newUserDetails = updateResults.rows[0];
			} else {
				const insertResults = await pool.query(`insert into users(phone_number, passcode, last_login) values($1, $2, $3) returning *`, [phoneNumber, hashedCode, new Date()]);
				newUserDetails = insertResults.rows[0];
			}
			return {
				userId: newUserDetails.id,
				isCommentator: newUserDetails.is_commentator
			}

		} catch(err) {
			if (pool && !pool.ended) {
				await pool.end();
			}
			throw err;
		}
	}

	async getUserById(id:string){
		let pool;
		try{
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const queryResult = await pool.query(
				`select * from users where id=$1`,
				[id]
			);
			await pool.end();
			const userDetails = queryResult.rows[0];
			return {
				userId: userDetails.id,
				isCommentator: userDetails.is_commentator,
				forceLogin: userDetails.force_login
			};
 		} catch(err) {
			if(pool && !pool.ended){
			await pool.end();
			}
			throw err;
		}
	}

	async addAutomaticLogin(id:string):Promise<void>{
		let pool;
		try{
			const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			const queryResult = await pool.query(
				`select * from users where id=$1`,
				[id]
			);
			await pool.end();
			await this.addLoginDetails(queryResult.rows[0].phone_number);
 		} catch(err) {
			if(pool && !pool.ended){
			await pool.end();
			}
			throw err;
		}
	}
}
