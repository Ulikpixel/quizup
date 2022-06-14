import { FC, useState, useEffect } from "react";
import { IProfile } from "../../../../types/profile";
import { instance as axiosInstance } from "../../../../utils/api";
import LocalStorage from "../../../../utils/localStorage";
import { checkFields, IRequired } from "../utils/checkFields";
import { classNames as cn } from '../../../../utils/classNames';

interface IBody {
    username?: string;
    password?: string;
    email?: string;
}

interface IForm {
    loading: boolean;
    data: IBody;
}

interface IResponse {
    message: string;
    data: IProfile;
}

const Signup: FC = () => {
    const required: IRequired[] = [
        { field: "username", length: 3 },
        { field: "password", length: 3 }
    ];

    const [error, setError] = useState<{ fields: string[], data: any }>({ fields: [], data: null });
    const [form, setForm] = useState<IForm>({ 
        loading: false, 
        data: {}, 
    });
    
    const stopLoading = (): void => setForm({ ...form, loading: false });
    const setField = (key: string, value: string) => setForm({ ...form, data: { ...form.data, [key]: value } }); 
    const check = (name: string): boolean => error.fields.includes(name);

    const signup = (e: any): void => {
        e.preventDefault();

        const fields: string[] = checkFields(required, form.data);
        setForm({ ...form, loading: true });
        
        if(fields.length) {
            setError({ ...error, fields });
            stopLoading();
            return;
        };

        axiosInstance({ method: 'POST', data: form.data, url: 'auth/signup' })
            .then(({ data }) => {
                const response: IResponse = data;
                LocalStorage.set('upquiz_profile', response);
                LocalStorage.set('upquiz_auth', true);
            })
            .catch((e) => setError({ ...error, data: e }))
            .finally(stopLoading)
    }
    
    return (
        <form className="signup" onSubmit={signup}>
            <input 
                type="text" 
                placeholder="username" 
                value={form.data?.username} 
                onChange={(e) => setField('username', e.target.value)}
                className={cn({
                    field: true,
                    field__error: check('username')
                })}
            />
            <input 
                type="password" 
                placeholder="password" 
                value={form.data?.password} 
                onChange={(e) => setField('password', e.target.value)}
                className={cn({
                    field: true,
                    field__error: check('password')
                })}
            />
            <input 
                type="email" 
                placeholder="email" 
                value={form.data?.email}
                onChange={(e) => setField('email', e.target.value)}
                className={cn({
                    field: true,
                    field__error: check('email')
                })}
            />
            <button type="submit">send</button>
        </form>
    )
}

export default Signup;