import { ILevel, IProfile } from './profile';

export interface IAsk {
    id: number;
    title: string;
    answers: string[];
    is_correct: boolean;
}

export interface IQuiz {
    id: number;
    name: string;
    description?: string;
    level: ILevel;
    points: number;
    owner: IProfile; 
    asks: IAsk[];
    result_users: string[];
    xp: number;
}