import style from "./adminStatus.module.css"

interface StatusCardProps {
    number: number;
    label: string;
}

export default function StatusCard({ number, label }: StatusCardProps) {
    return (
        <div className={style.statusCard}>
            <p className={style.number_status}>{number}</p>
            <p className={style.textBlock}>{label}</p>
        </div>
    );
}