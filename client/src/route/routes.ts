import { FC } from 'react';
import { Home, Signin, Signup } from '../components/Modules/Auth';

export interface IPublic {
    path: string,
    component: FC,
}

interface IPrivate extends IPublic {
    roles: string[]
}

interface IRoutes {
    private: IPrivate[],
    public: IPublic[]
}

export const routes: IRoutes = {
    private: [],
    public: [
        { path: '/', component: Home },
        { path: '/signin', component: Signin },
        { path: '/signup', component: Signup }
    ]
};