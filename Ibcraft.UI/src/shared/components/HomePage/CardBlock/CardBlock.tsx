
import style from './cardblock.module.css';
import gamepad_ico from "@static/gamepad.svg";
import ico_pc from "@static/pc.svg"
import ico_server from "@static/server.svg"
import Image from 'next/image';

function CardBlock() {
    return (
        <div className={style.card_blocks}>
            <div className="container">
                <div className={style.cards}>
                    <div className={style.card}>
                        <div className={style.title_card}>
                            <p>Ванильное<br/>выживание</p>
                            <Image src={gamepad_ico} width={55} height={55} alt="gamepad_ico"/>
                        </div>
                        <p className={style.context_card}>
                            Наш сервер - ванильный, т.е. 
                            без серверных модов. 
                            Сборка клиентских модов 
                            улучшает и украшает игру, 
                            но никак не меняет сам 
                            геймплей, вы можете играть 
                            и без нашей сборки модов.  
                        </p>
                    </div>
                    <div className={style.card}>
                        <div className={style.title_card}>
                            <p>Современные<br/>технологии</p>
                            <Image src={ico_pc} width={55} height={55} alt="pc_ico"/>
                        </div>
                        <ul className={style.context_list}>
                                <li>Онлайн карта мира SquareMap</li>
                                <li>Ядро Pufferfish последней версии</li>
                                <li>Синхронизация с Discord Rich Presence</li>
                                <li>Свой ресурс-пак сервера с кастомным контентом</li>
                                <li>Голосовой чат</li>
                                <li>Плагин CoreProtect для защиты от гриферства и как следствие 
                                отсутствие приватов</li>
                        </ul>
                    </div>
                    <div className={style.card}>
                        <div className={style.title_card}>
                            <p>Мощный<br/>сервер</p>
                            <Image src={ico_server} width={55} height={55} alt="server_ico"/>
                        </div>
                        <p className={style.context_card}>
                            Мощностей нашего сервера 
                            хватает для комфортной игры 24 
                            игроков с прорисовкой в 12 чанков. 
                            Сервер находится в Донецке 
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default CardBlock;