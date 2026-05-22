import style from './statusblock.module.css'
import { useStatus } from '@hooks/useStatus'

interface StatusUser {
    userId: string
}

export default function StatusBlock({userId}: StatusUser) {
    const status = useStatus(userId);

    const renderStatusblock = () => {
        switch (status) {
            case "Unfiled":
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>
                                <img width="48" height="48" src="https://img.icons8.com/fluency/48/info-squared.png" alt="info-squared"/>
                            </span>
                            <h1 className={style.context_status}>Статус заявки</h1>
                        </div>
                        <div className={style.info_status}>
                            <p className={style.status_text}>Не подана, чтобы её подать нажмите "Подать на получение проходки"</p>
                        </div>
                    </>
                );
            case "Approved":
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <linearGradient id="HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse"><stop offset=".108" stop-color="#0d7044"></stop><stop offset=".433" stop-color="#11945a"></stop></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCa_VFaz7MkjAiu0_gr1)" d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z"></path><linearGradient id="HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2ac782"></stop><stop offset="1" stop-color="#21b876"></stop></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCb_VFaz7MkjAiu0_gr2)" d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z"></path>
                            </svg>
                            </span>
                            <h1 className={style.context_status}>Статус заявки</h1>
                        </div>
                        <div className={style.info_status}>
                            <p className={style.status_text}>Ваша заявка одобрена!</p>
                        </div>
                    </>
                )
            case "Reject":
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1" x1="7.534" x2="27.557" y1="7.534" y2="27.557" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#f44f5a"></stop><stop offset=".443" stopColor="#ee3d4a"></stop><stop offset="1" stopColor="#e52030"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)" d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"></path><linearGradient id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2" x1="27.373" x2="40.507" y1="27.373" y2="40.507" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a8142e"></stop><stop offset=".179" stopColor="#ba1632"></stop><stop offset=".243" stopColor="#c21734"></stop></linearGradient><path fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)" d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"></path>
                                </svg>
                            </span>
                            <h1 className={style.context_status}>Статус заявки</h1>
                        </div>
                        <div className={style.info_status}>
                            <p className={style.status_text}>Ваша заявка отклонена.</p>
                        </div>
                    </>
                )
            case "Pending":
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><linearGradient id="85hxlWiLZsrxIScZDGwmUa" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#889097"/><stop offset="1" stopColor="#64717c"/></linearGradient><circle cx="24" cy="24" r="20" fill="url(#85hxlWiLZsrxIScZDGwmUa)"/><radialGradient id="85hxlWiLZsrxIScZDGwmUb" cx="24" cy="24" r="18.5" gradientUnits="userSpaceOnUse"><stop offset="0"/><stop offset="1" stopOpacity="0"/></radialGradient><circle cx="24" cy="24" r="18.5" fill="url(#85hxlWiLZsrxIScZDGwmUb)"/><radialGradient id="85hxlWiLZsrxIScZDGwmUc" cx="23.89" cy="7.394" r="37.883" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fafafb"/><stop offset="1" stopColor="#c8cdd1"/></radialGradient><circle cx="24" cy="24" r="17" fill="url(#85hxlWiLZsrxIScZDGwmUc)"/><line x1="24" x2="24" y1="24" y2="36" fill="none" stroke="#d83b01" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5"/><line x1="24" x2="32.485" y1="24" y2="15.515" fill="none" stroke="#45494d" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5"/><g><line x1="24" x2="16.213" y1="24" y2="20.265" fill="none" stroke="#45494d" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.5"/></g><circle cx="24" cy="24" r="2" fill="#1e2021"/></svg>
                            </span>
                            <h1 className={style.context_status}>Статус заявки</h1>
                        </div>
                        <div className={style.info_status}>
                            <p className={style.status_text}>Ваша заявка на рассмотрении. Пожалуйста, ожидайте.</p>
                        </div>
                    </>
                )
            case "error":
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
                                    <path d="m7.7773 2.5h84.445c2.9141 0 5.2773 2.3633 5.2773 5.2773v84.445c0 2.9141-2.3633 5.2773-5.2773 5.2773h-84.445c-2.9141 0-5.2773-2.3633-5.2773-5.2773v-84.445c0-2.9141 2.3633-5.2773 5.2773-5.2773zm32.168 29.984c-2.0625-2.0625-5.4023-2.0625-7.4609 0-2.0625 2.0586-2.0625 5.4023 0 7.4609l10.055 10.055-10.055 10.055c-2.0625 2.0625-2.0625 5.4023 0 7.4648 2.0625 2.0586 5.4023 2.0586 7.4609 0l10.055-10.055 10.055 10.055c2.0625 2.0586 5.4023 2.0586 7.4648 0 2.0586-2.0625 2.0586-5.4023 0-7.4648l-10.055-10.055 10.055-10.055c2.0586-2.0625 2.0586-5.4023 0-7.4609-2.0625-2.0625-5.4023-2.0625-7.4648 0l-10.055 10.055z" fillRule="evenodd"/>
                                </svg>
                            </span>
                            <h1 className={style.context_status}>Статус заявки</h1>
                        </div>
                        <div className={style.info_status}>
                            <p className={style.status_text}>Ошибка при получении статуса. Попробуйте позже.</p>
                        </div>
                    </>
                )
            default:
                return (
                    <>
                        <div className={style.status_header}>
                            <span className={style.status_icon}>

                            </span>
                            <h1 className={style.context_status}>Загрузка статуса...</h1>
                        </div>
                    </>
                )
        }

    }

    return (
        <>
            <div className={style.status}>
                <div className={style.status_item}>
                    {renderStatusblock()}
                </div>
            </div>
        </>
    )
}

