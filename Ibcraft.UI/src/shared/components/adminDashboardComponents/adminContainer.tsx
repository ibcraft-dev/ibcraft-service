import style from './adminContainer.module.css';

interface AdminContainerProps {
    children: React.ReactNode;
}

export default function AdminContainer({ children }: AdminContainerProps) {
    return (
         <div className={style.container}>
            <div className={style.main_container}>
                <div className={style.ContainerBlock}>
                    {children}
                </div>
            </div>
        </div>
    );
}