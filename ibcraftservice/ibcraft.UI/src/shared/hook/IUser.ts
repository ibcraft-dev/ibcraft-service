interface User {
    id?: string;
    name?: string;
    avatarIco?: string;
}


type TypefetchRegister = {
    confirmPassword: string;
    email: string;
    nikname: string;
    password: string;
}


export type {User, TypefetchRegister};