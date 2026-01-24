import { create } from "zustand";

interface FormData {
    nikname: string;
    email: string;
    password: string;
    confirmPassword: string
}

interface Register {
    step: number;
    data: FormData;
    setStep: (step: number) => void;
    updateData: (newData: Partial<FormData>) => void;
}

const useFormRegisterStore =  create<Register>((set) => ({
    step: 1,
    data: {
        nikname: '',
        email: '',
        password: '',
        confirmPassword: ''
    },
    setStep: (step) => set({ step }),
    updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData}}))
}))

export default useFormRegisterStore;