interface User {
    id?: string;
    name?: string;
    avatarIco?: string;
    roles?: string[];
    isBanned?: boolean;
}


type TypefetchRegister = {
    confirmPassword: string;
    email: string;
    nikname: string;
    password: string;
}


export type {User, TypefetchRegister};
