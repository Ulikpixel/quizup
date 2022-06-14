import { Languages } from './../constains/languages';
import { IProfile } from './../types/profile';
import { makeAutoObservable } from 'mobx';
import LocalStorage from '../utils/localStorage';

class Store {
    constructor() {
        makeAutoObservable(this);
    }

    profile: IProfile = LocalStorage.get('upquiz_profile');
    auth: boolean | undefined = LocalStorage.get('upquiz_auth');
    lang: Languages = Languages.ru;

    setLoc(lang: Languages) {
        this.lang = lang;
    }
}

export default new Store()