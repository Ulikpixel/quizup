import { IQuiz } from './quiz';

export interface ILevel {
    id: number;
    name: string;
    img: string;
    xp: {
        start_at: number;
        finish_at: number; 
    }
}

export interface IProfile {
    id: number,
    username: string,
    email?: string,
    roles: string[],
    level: ILevel,
    result_games: string[],
    create_games?: IQuiz,
    points: number,
    xp: number
}