import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parseUrl } from './parseUrl';

interface IUseUrlParams {
    urlParams: any;
    setUrlParams: (data: any, key: string) => void;
    clearUrlParams: () => void;
    setAllParams: (data: any) => void;
}

const useUrlParams = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const baseUrl: any = location.search.length > 3 ? parseUrl(location.search.substring(1)) : null; // ищем наличие query params в url.
    const [params, setParams] = useState(baseUrl);

    const setUrlParams = (data: any, key: string): void => setParams({ ...params, [key]: data });

    const clearUrlParams = (): void => {
        setParams(null);
        navigate({ search: '' }); // очищаем url от query params.
    };

    const setAllParams = (data: any): void => setParams(data);

    useEffect(() => {
        // при изменений объекта params
        const keys: string[] = Object.keys(params || {});
        // превращаем его в query params
        const search: string = '?' + keys.map((key, idx) => `${key}=${params[key]}${idx !== keys.length - 1 ? '&' : ''}`).join('');
        // и пушим в url
        navigate({ search });
    }, [params]);

    const result: IUseUrlParams = { urlParams: params, setUrlParams, clearUrlParams, setAllParams };
    return result;
}

export default useUrlParams;