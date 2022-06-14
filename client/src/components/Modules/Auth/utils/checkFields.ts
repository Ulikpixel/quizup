export interface IRequired {
    field: string,
    length?: number,
    status?: boolean
}

export const checkFields = (required: IRequired[], data: any): any[] => {
    const fields = required.map(({ field, length, status }) => {
        const item = data[field];
        if (!item) return field;
        if (length && item.length < length) return field;
        if (status && item !== status) return field;
    });

    return fields.filter(el => el);
};