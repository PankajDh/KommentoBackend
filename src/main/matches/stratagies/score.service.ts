import { Injectable } from "@nestjs/common";
import * as pg from 'pg';
import { NetworkService } from "../../network/strategies/network.service";
import { Helper } from '../../../helper';
import { ManualScoreUpdateDto } from "../dto/manualScoreUpdate.dto";
const ormConfig = require('../../../../ormconfig.json');

@Injectable()
export class ScoreService{
    constructor( readonly networkService:NetworkService) {}
   
    async saveScore(rapidApiMatchId:string, rapidApiSeriesId:string, kommetoMatchId:string, apiCallDate:string):Promise<void> {
        let pool;
        try {
            const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});

            const countQueryResult = await pool.query(`select * from score_api_calls where date=$1`,[apiCallDate]);
            await pool.end();
            pool = null;

            const count  = countQueryResult.rows[0].calls;
            if (count > 2500) {
                console.log(`calls done for ${apiCallDate} is ${count}`);
                return;
            }

            const url = `https://dev132-cricket-live-scores-v1.p.rapidapi.com/scorecards.php`;
            const response = await this.networkService.get(url, {
                matchid: rapidApiMatchId,
                seriesid: rapidApiSeriesId
            }, {
                'x-rapidapi-key': '26701d3635msh0d928fdacc4271bp1cb7a2jsn365d34548189',
                'x-rapidapi-host': 'dev132-cricket-live-scores-v1.p.rapidapi.com',
                'useQueryString': 'true'
            });
            const score: ManualScoreUpdateDto = {
                teamOneRuns : parseInt(response.fullScorecard.innings[0].run),
                teamOneOvers: parseFloat(response.fullScorecard.innings[0].over),
                teamOneWickets: parseInt(response.fullScorecard.innings[0].wicket),
                teamTwoRuns : response.fullScorecard.innings.length > 1 ? parseInt(response.fullScorecard.innings[1].run) : 0,
                teamTwoOvers: response.fullScorecard.innings.length > 1 ? parseFloat(response.fullScorecard.innings[1].over) : 0.0,
                teamTwoWickets: response.fullScorecard.innings.length > 1  ? parseInt(response.fullScorecard.innings[1].wicket) : 0,
            }

			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
            
            await pool.query('update score_api_calls set calls=$1 where date=$2',[count+1, apiCallDate]);

			await pool.query(
				`update matches set 
                    team_one_runs=$1, 
                    team_one_overs=$2, 
                    team_one_wickets=$3,
                    team_two_runs=$4,
                    team_two_overs=$5,
                    team_two_wickets=$6
                where id = $7
                `,
                [score.teamOneRuns, score.teamOneOvers, score.teamOneWickets, score.teamTwoRuns, score.teamTwoOvers, score.teamTwoWickets, kommetoMatchId]
			);
			await pool.end();
        } catch(err) {
            if(pool && !pool.ended){
                await pool.end();
            }
            throw err;
        }
    }

    async saveScoreManually(score:ManualScoreUpdateDto, matchId:string):Promise<void>{
        let pool;
        try {
            const { user, password, host, database } = ormConfig;
			pool = new pg.Pool({
				user,
				password,
				host,
				database,
			});
			await pool.query(
				`update matches set 
                    team_one_runs=$1, 
                    team_one_overs=$2, 
                    team_one_wickets=$3,
                    team_two_runs=$4,
                    team_two_overs=$5,
                    team_two_wickets=$6
                where id = $7
                `,
                [score.teamOneRuns, score.teamOneOvers, score.teamOneWickets, score.teamTwoRuns, score.teamTwoOvers, score.teamTwoWickets, matchId]
			);
			await pool.end();
        } catch(err) {
            if (pool && !pool.ended) {
                await pool.end();
            }
            throw err;
        }
    }
}