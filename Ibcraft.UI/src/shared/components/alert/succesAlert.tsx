import style from "./alert.module.css"

interface SuccesAlertProps {
    children: React.ReactNode;
    Success?: boolean;
    Color?: string;
}

export default function Alert({children, Success, Color}: SuccesAlertProps) {
    return (
        <div className={`${style.succesBlock} ${Success ? style.active : ""}`}>
            <div className={style.alert} style={{backgroundColor: Color}}>
                <div className={style.text_title}>
                    {children}
                </div>
            </div>
        </div>
    )
}