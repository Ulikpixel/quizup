export default class LocalStorage {
    static set(key: string, data: any): void {
        try {
            const value: string = JSON.stringify(data);
            localStorage.setItem(key, value);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    static get(key: string): any {
        try {
            const response: string | null = localStorage.getItem(key);
            return response ? JSON.parse(response) : null;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    static getSimple(key: string): any {
        try {
            const response = localStorage.getItem(key);
            return response ? response : null;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    static clear(): any {
        try {
            localStorage.clear();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}