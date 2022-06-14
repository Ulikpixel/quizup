import { IProfile } from './profile';
import { IQuiz } from './quiz';

export interface IAnswer {
    id: number;
    is_correct: boolean;
    answer: string;
}

export interface IResultGame {
    id: number;
    date_from: Date;
    date_until?: Date;
    quiz: IQuiz;
    user: IProfile;
    status: boolean;
    answers_correct: IAnswer[];
}