import style from "./alert.module.css"

interface ClipAlertProps {
    children: React.ReactNode;
    copySuccess: boolean;
}

export default function ClipAlert({children, copySuccess} : ClipAlertProps) {
    return (
    <div className={`${style.clip}  ${copySuccess ? style.active_clip : ""}`}>
        <div className={`${style.clipboard}`}>
            <div className={style.text_title}>
                {children}
            </div>
        </div>
    </div>
    )
}