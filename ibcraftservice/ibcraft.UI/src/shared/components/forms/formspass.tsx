"use client";

import SubmitButton from "../Buttons/SubmitButton"
import { useEffect, useState } from "react"
import style from "./pass.module.css"

import Link from "next/link";
import { fetchSend } from "@hooks/HookQuestionnaire";
import { useRouter } from "next/navigation";
import { useAlert } from "../alert/alertContext";

export default function FormPass() {
    const  [rangeBuild, setRangeBuild] = useState(10);
    const  [rangeAdequacy, setRangeAdequacy] = useState(10);
    const  [age, setAge] = useState<number>();
    const  [playtime, setPlaytime] = useState<string>();
    const  [rule, setRule] = useState<boolean>();
    const  [playingRp, setPlayingRp] = useState<boolean>();
    const  [license, setLicense] = useState<boolean>();
    const  [discription, setDiscription] =  useState<string>();
    const { setAlert } = useAlert();
    const readirect = useRouter();


    const handleRangeBuildChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRangeBuild(Number(event.target.value));
    };

    const handleRangeAdequacyChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setRangeAdequacy(Number(event.target.value));
    };

    useEffect(() => {
        document.body.style.overflowY = "auto";
    }, [])

    const handleSubmit = async () => {
        if (rule === undefined || playingRp === undefined || license === undefined) {
            setAlert("Не все поля были заполнины!", "red");
            return;
        };

        if (age === undefined || playtime === undefined || discription == undefined) {
            setAlert("Не все поля были заполнины!", "red");
            return;
        };

        if (isNaN(age)) {
            setAlert("Поле возраст принимает только числа", "red");
            return
        }


        const sendPost = await fetchSend({
            age: age, 
            playingTime: playtime,
            acceptRule: rule, 
            playingServer: playingRp, 
            licenseMinecraft: license, 
            buildingLevel: rangeBuild,
            adequacyLevel: rangeAdequacy,
            discription: discription});
        
        if (sendPost.code !== 200) {
            return setAlert(sendPost.data, "red");
        }

        setAlert("Ваша заявка на проходку отпралена в обработку.", "green");
        readirect.push("/profile");
    }

    
    return (
            <>
            <div className={style.title}>
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
                <h1>Получение бесплатной проходки на сервер IB-CRAFT</h1>
                <p>Для получения проходки на сервер IB-CRAFT вам необходимо заполнить анкету</p>
                <p><span className={style.animated_gradient}>Получить проходку на сервер можно только с 13 лет!</span></p>
            </div>
            <div className={style.form_block} >
                <div className={style.from_data_age}>
                    <div className={style.inputs_age}>
                        <p className={style.placeholder_input}>Ваш возраст</p>
                        <input type="text" className={style.input} name="age" onChange={(e) => {
                                setAge(Number(e.target.value))
                        }}  />
                        <p className={style.discripton}>Сколька вам полных лет</p>
                    </div>
                    <div className={style.inputs_playing}>
                        <p className={style.placeholder_input}>Как долго вы играете в Minecraft</p>
                        <input type="text" className={style.input} name="playtime" onChange={(e) => setPlaytime(e.target.value)}/>
                        <p className={style.discripton}>Укажите, сколька лет вы играете Minecraft</p>
                    </div>
                </div>
                <div className={style.from_checkboxs}>
                    <div className={style.context_check}>
                        <p className={style.placeholder_input}>Вы ознакомлены с правилами сервера?</p>
                        <div className={style.checkbox_block}>
                            <div>
                                <input type="radio" placeholder="Да" className={style.checkbox_input} 
                                id="rule_accept" 
                                value="true" 
                                name="rule"
                                onChange={() => setRule(true)} 
                                />
                                <label htmlFor="rule_accept">Да</label>
                            </div>
                            <div>
                                <input type="radio" placeholder="Нет" className={style.checkbox_input} 
                                id="rule_notaccept" 
                                value="false" 
                                name="rule"
                                onChange={() => setRule(false)} />
                                <label htmlFor="rule_notaccept">Нет</label>
                            </div>
                        </div>
                        <p className={style.discripton}>Правила сервера можно прочитать на сайте: <Link href="/rule" className={style.link_rule}>Тык</Link></p>
                    </div>
                    <div className={style.context_check}>
                        <p className={style.placeholder_input}>Вы когда ни будь играли до этого на РП серверах?</p>
                        <div className={style.checkbox_block}>
                            <div>
                                <input type="radio" 
                                placeholder="Да" 
                                className={style.checkbox_input} 
                                id="playing_accept" 
                                value="true" 
                                name="playing_rp"
                                checked={playingRp === true}
                                onChange={() => setPlayingRp(true)} />
                                <label htmlFor="playing_accept">Да</label>
                            </div>
                            <div>
                                <input type="radio" 
                                placeholder="Нет" 
                                className={style.checkbox_input} 
                                id="playing_notaccept" 
                                value="false" 
                                name="playing_rp"
                                checked={playingRp === false}
                                onChange={() => setPlayingRp(false)}/>
                                <label htmlFor="playing_notaccept">Нет</label>
                            </div>
                        </div>
                        <p className={style.discripton}>Напремер такие сервера как:<br/> "СП", "Starshine Project", "Сабшилд", "Bubostan" и т.д</p>
                    </div>
                    <div className={style.context_check}>
                        <p className={style.placeholder_input}>У вас есть лицензия Minecraft?</p>
                        <div className={style.checkbox_block}>
                            <div>
                                <input type="radio" 
                                placeholder="Да" 
                                className={style.checkbox_input} 
                                id="accept" 
                                value="true" 
                                name="license"
                                onChange={() => {setLicense(true)}}/>
                                <label htmlFor="accept">Да</label>
                            </div>
                            <div>
                                <input type="radio" 
                                placeholder="Нет" 
                                className={style.checkbox_input} 
                                id="notaccept" 
                                value="false" 
                                name="license"
                                onChange={() => {setLicense(false)}} />
                                <label htmlFor="notaccept">Нет</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.slide_container}>
                    <div className={style.slide_block}>
                        <p className={style.placeholder_input}>Вы хорошо строите?</p>
                        <input type="range" min="0" max="10" value={rangeBuild} className={style.slider} onChange={handleRangeBuildChange}/>
                        <p className={style.discripton}>Выбранное значение: {rangeBuild}</p>
                        <p className={style.discripton}>0 - Нет, мой пик креативности и красоты - коробки из грязи / 5 - Могу построить 
                            неплохой уютный домик, не самый красивый, но и не коробка / 10 - Да, строю прекрасные масштабные постройки уровня 2B2T
                        </p>
                    </div>
                    <div className={style.slide_block}>
                        <p className={style.placeholder_input}>На сколько вы считаете себя адекватным?</p>
                        <input type="range" min="0" max="10" value={rangeAdequacy} className={style.slider} onChange={handleRangeAdequacyChange}/>
                        <p className={style.discripton}>Выбранное значение: {rangeAdequacy}</p>
                        <p className={style.discripton}>0 - Псих / 10 - Идеально адекватный человек. Отвечайте честно, спросите самого себя, на сколько вы адекватны?
                            От этого пункта так же зависит одобрение или отказ выдачи проходки.
                        </p>
                    </div>
                </div>
                <div className={style.about_me}>
                    <p className={style.placeholder_input}>Чем вы планируете заниматься на нашем сервере?</p>
                    <textarea className={style.textarea}  name="discription" onChange={(e) => {setDiscription(e.target.value)}} />
                    <p className={style.discripton}>Напишите, чем вы будете заниматься играя на нашем сервере, какие у вас цели, планы или идеи</p>
                </div>
                <div className={style.buttons}>
                    <SubmitButton onClick={handleSubmit} disabled={false} loading={false} icon={""} href="#!">
                        <p>Отправить заявку</p>
                    </SubmitButton>
                </div>
            </div>
        </>

    )

    

}