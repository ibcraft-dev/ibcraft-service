import Link from 'next/link';
import style from './Notifcations.module.css';

interface Notification {
    id: number;
    text: string;
    info: string;
    path?: string;
}

export default function Notifications({id, text, info, path}: Notification) {
    return (
        <div className={style.notificationsContainer}>
            <Link href={path ? path : "#"} className={style.notifications}>
                <div className={style.notificationItem}>
                    < i className='bx  bx-bell'  ></i> 
                    <div className={style.contextItem}>
                        <span className={style.notificationText}>{text}</span>
                        <span className={style.notificationTime}>{info}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}