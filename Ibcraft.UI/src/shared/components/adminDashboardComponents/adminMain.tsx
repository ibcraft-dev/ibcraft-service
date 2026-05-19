import DevBlock from "../development/Devblock";
import style from "./adminStatus.module.css"


export default function AdminMain() {
    return (
        <>
            <div className={style.statusContainer}>
                <div className={style.containerTitle}>
                 <h2 className={style.statusTitle}>| Статистика</h2> 
                </div>
                <div className={style.statsGrid}>
                    <div className={style.statItem}>
                        <span className={style.statNumber}>42</span>
                        <span className={style.statLabel}>Новые заявки</span>
                    </div>
                    <div className={style.statItem}>
                        <span className={style.statNumber}>42</span>
                        <span className={style.statLabel}>Одобренные заявки</span>
                    </div>
                    <div className={style.statItem}>
                        <span className={style.statNumber}>42</span>
                        <span className={style.statLabel}>Заявок за месяц</span>
                    </div>
                </div>
            </div>

            <div className={style.devBlockContainer}>
                <div className={style.ItemBlock}>
                    <DevBlock height={"317px"} />
                </div>
            </div>
        </>
    );
}

