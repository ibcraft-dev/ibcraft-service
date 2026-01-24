"use client";

import Image from "next/image";
import lock from "@static/3d-lock.png"
import style from "./auth.module.css"
import Link from "next/link";
import SubmitButton from "../Buttons/SubmitButton";
import useFormRegisterStore from "@/app/auth/register/registerStorage";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { fetchRegister } from "@hooks/hookUser";
import { useRouter } from "next/navigation";
import { useAlert } from "../alert/alertContext";


type FormStepFirst = {
    email: string;
    password: string;
    confirmPassword: string;
}

type FormStepSecond = {
    nikname: string;
}

export default function RegisterBlock() {

    const {step, setStep, data, updateData } = useFormRegisterStore();
    const [ruleAccept, setRuleAccept] = useState(false);
    const [loading, setLoading] = useState(false);
    const readirect = useRouter();
    const { setAlert } = useAlert();

    const { 
        register: registerStepFirst, 
        handleSubmit: handleSubmitStepFirst, 
        formState: { errors: errorsStepFirst },
        reset: resetStepFirst } = useForm<FormStepFirst>({ defaultValues: data });
    const { 
        register: registerStepSecond, 
        handleSubmit: handleSubmitStepSecond, 
        formState: { errors: errorsStepSecond },
        reset: resetStepSecond } = useForm<FormStepSecond>({ defaultValues: data });


    const onNextFirst: SubmitHandler<FormStepFirst> = (formData) => {
        if(!ruleAccept) {
            setAlert("Вы должны принять правила проекта", "red");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setAlert("Пароли не совпадают", "red");
            return;
        }
        
        if (formData.password.length < 6) {
            setAlert("Пароль должен быть не менее 6 символов", "red");
            return;
        }

        updateData(formData);
        setStep(2);
    }

    const onForward = () => {
        setStep(1);
    }

    const onSubmitSecond: SubmitHandler<FormStepSecond> = async (formData) => {
        updateData(formData);
        setLoading(true);
        const sendRegister = await fetchRegister({...data, ...formData});

        if (sendRegister.status !== 200 ) {
            setLoading(false);
            setAlert("Ошибка регистрации", "red");
            setStep(1);
            return;
        }

        setAlert("Вы успешно зарегистровались, подтвердите вашу почту что зайти на свой профиль.", "green");
        readirect.push("/auth/login");
        setLoading(false);
        setStep(1);
    }

    useEffect(() => {
        resetStepFirst(data); 
        resetStepSecond(data); 
      }, [data, resetStepFirst, resetStepSecond]);

    return (
        <>
           {loading && <Loader />}
           {step === 1 && (
                <>
                    <div className={style.title_auth}>
                        <Image className={style.lock_img} src={lock} alt="" />
                        <h1 className={style.media_text}>Регистрация</h1>
                    </div>
                    <form className={style.forms} onSubmit={handleSubmitStepFirst(onNextFirst)}>
                        <div className={style.group_auth_input}>
                            <input type="email" placeholder="Email" className={style.from_auth} {...registerStepFirst("email", { required: "email"})}/>
                            <input type="password" placeholder="Пароль" className={style.from_auth} {...registerStepFirst("password", { required: "password"})}/>
                            <input type="password" placeholder="Пароль еще раз" className={style.from_auth} {...registerStepFirst("confirmPassword", { required: "confirmPassword"})}/>
                        </div>
                        <div className={style.group_auth_btn}>
                            <div>
                                <input type="checkbox" id="checkrule" checked={ruleAccept} onChange={() => setRuleAccept(prev => !prev)} className={style.checkbox}/>
                                <label htmlFor="checkrule" className={style.labelctx}>Я согласен с <Link href="/rule" id={style.link_rule}> правилами </Link> данного проекта</label>
                            </div>
                            <button type="submit" className={style.button}>Продолжить</button>
                            <SubmitButton onClick={() => {
                                
                            }} disabled={false} loading={false} icon={""} className={style.auth_btn_discord}>
                                <span id={style.discord}></span>
                            </SubmitButton>
                        </div>
                        <div className={style.support_group}>
                            <Link href="/auth/login" className={style.support_btn}>Если есть профиль</Link>
                            <Link href="/auth/passwordforgot" className={style.support_btn}>Восстановить доступ</Link>
                        </div>
                    </form>
                </>
           )}

           {step === 2 && (
            <form action="" onSubmit={handleSubmitStepSecond(onSubmitSecond)} className={style.formsSecond}>
                <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100" fill="green" className={style.creeper}>
                    <polygon points="37.019,70.467 29.104,65.902 29.104,80.182 37.019,84.745 "/>
                    <polygon points="46.933,80.471 46.933,90.474 54.835,95.037 54.835,80.759 46.933,76.195 "/>
                    <polygon points="47.432,75.329 55.335,79.893 63.249,75.329 55.335,70.755 "/>
                    <path d="M63.749,40.178l-12.604,7.288c-0.001,0-0.002,0-0.002,0c-0.008,0.004-0.018,0.004-0.025,0.008  c-0.067,0.034-0.141,0.058-0.222,0.058c-0.001,0-0.001,0-0.001,0c-0.001,0-0.001,0-0.001,0s0,0-0.001,0c0,0,0,0-0.001,0  c-0.081,0-0.154-0.024-0.222-0.058c-0.008-0.004-0.018-0.004-0.025-0.008c0,0-0.001,0-0.002,0l-3.711-2.147v29.144l8.15-4.717  c0.001-0.001,0.001-0.002,0.002-0.002l8.664-4.996V40.178z" />
                    <polygon points="45.933,44.742 38.019,40.178 38.019,59.885 38.019,69.889 45.933,74.463 "/>
                    <polygon points="56.335,70.178 64.249,74.752 72.163,70.178 64.249,65.613 "/>
                    <polygon points="38.019,84.745 45.933,80.182 45.933,75.618 38.019,71.044 "/>
                    <polygon points="63.749,90.473 63.749,76.195 55.835,80.76 55.835,95.037 "/>
                    <polygon points="51.395,46.167 63.996,38.881 63.998,38.879 68.201,36.443 68.201,17.024 51.395,26.738 "/>
                    <polygon points="67.701,16.158 50.895,6.454 34.067,16.158 50.895,25.872 "/>
                    <polygon points="37.019,60.752 29.604,65.036 37.019,69.312 "/>
                    <polygon points="37.77,38.88 46.683,44.02 46.683,44.02 50.395,46.167 50.395,26.738 33.566,17.024 33.566,36.443 37.77,38.879 "/>
                    <polygon points="64.749,89.896 72.663,85.322 72.663,71.044 64.749,75.618 "/>
                </svg>
                <h1 className={style.title}>Завершите регистрацию</h1>
                <p className={style.subtitle}>Укажите ваш никнейм на котором вы будете играть на нашем сервере.</p>
                <div className={style.form}>
                    <input type="text" placeholder="Nikname" className={style.form_nikname} {...registerStepSecond("nikname", { required: "Никнейм обязателен" })}/>
                </div>
                <button type="submit" className={style.button}>Зарегистрироваться</button>
                <a href="" className={style.support_btn} onClick={onForward}>Вернутся назад</a>
            </form>
           )}
        </>
    )
}

