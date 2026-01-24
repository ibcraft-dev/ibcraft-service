"use client";

import style from "./profile.module.css";
import Dropdown from "@components/Dropdown/Dropdown";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import BubbleControler from "@components/EffectComponents/BubbleControler";
import { useAuth } from "@components/Auth/AuthContext";
import { User } from "@hooks/IUser";
import StatusBlock from "@components/statusblock/StatusBlock";
import ButtonQuestionnaireLink from "@components/statusblock/ButtonQuestionnaireLink";
import Image from "next/image";
import icouser from "@static/GkSrQGFXUAA0Ar_.png"
import Modal from "@components/Modal";
import { useState } from "react";
import { fetchUpdateNikname, fetchUpdateUserAvatar } from "@hooks/hookUser";
import Loader from "@components/Loader";


const Profile = ({ avatarIco, name, id }: User) => {
        const [modalOpenName, setModalOpenName] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [uploading, setUploading] = useState(false);
        const [preview, setPreview] = useState<string | null>(null);
        const [file, setFile] = useState<File | null>(null);
        const [nikname, setNikname] = useState<string | null>();
        const [DropdownOpen, setDropdownOpen] = useState(false);

        
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0] || null;
            setFile(selectedFile);
            if (selectedFile) {
                setPreview(URL.createObjectURL(selectedFile))
            }
        };

        const handleUpload = async () => {
            if (!file) return;

            setUploading(true);
            const fromData = new FormData();
            fromData.append("file", file);
            console.log(fromData)

            try {
                const response = await fetchUpdateUserAvatar({ file: fromData })

                if (response.status !== 200) {
                    return;
                } 

                window.location.reload();
            } catch (error) {
                console.error(error);
            } finally {
                setUploading(false);
            }
        }

        const updateNikname = async () => {
            if (!nikname) return;

            setUploading(true);
            const response = await fetchUpdateNikname({ newNikname: nikname});
            if (response.status !== 200) {
                return;
            }

            window.location.reload();
        }

        const OpenDropdown = () => {
            setDropdownOpen(!DropdownOpen);
        }

        return (
            <main>
                <div className="container">
                    <div className={style.profile_container}>
                        <div className={style.profile_block}>
                            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                                <div className={style.profile_avatar} style={{height: "100px", width: "100px"}}>
                                    {avatarIco ? <img src={process.env.NEXT_PUBLIC_SERVER_URL_HTTP + avatarIco} alt="avatar" className={style.avatar}/> : <Image src={icouser} alt="avatar" className={style.avatar}/>
                                }
                                </div>
                                <div className={style.profile}>
                                    <div className={style.profile_info}>
                                        <div className={style.header_profile}>
                                            {name ? <p className={style.context_user}>{name}</p> : <p className={style.context_user}></p>}
                                            <Dropdown isOpen={DropdownOpen} onToggle={() => {OpenDropdown()}}>
                                                    <a href="#!" onClick={() => setModalOpenName(true)} style={{color: "#fff", fontWeight: "bold"}}>Сменить никнейм</a>
                                                    <a href="#!" onClick={() => setModalOpen(true)} style={{color: "#fff", fontWeight: "bold"}}>Сменить аватар</a>
                                                    <a href="#" style={{color: "#fff", fontWeight: "bold"}}>Выйти из аккаунта</a>
                                            </Dropdown>
                                        </div>
                                        <div style={{width: "340px"}}>
                                            <ButtonQuestionnaireLink Id={id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.status_block}>
                                {id ? <StatusBlock userId={id}/> : <></>}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={modalOpenName} onClose={() => setModalOpenName(false)}>
                    <div className={style.wrapper}>
                        <div className={style.context_modal}>
                            <h1 className={style.name_modal}>Смена никнейма</h1>
                            <form action="" className={style.form_nikname}>
                                <input type="text" placeholder="Новый никнейм" onChange={(e) => setNikname(e.target.value)} />
                            </form>
                        </div>
                        <div className={style.modal_component}>
                            <button onClick={updateNikname} className={style.button}>Изменить</button>
                        </div>
                    </div>
                </Modal>
                
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                    <div className={style.wrapper}>
                        <div className={style.context_modal}>
                            <h1 className={style.name_modal}>Смена аватара</h1>
                            <form action="" className={style.form_image}>
                                <label className={style.lable_file}>
                                    Загрузить файл
                                    <input type="file" accept="image/*" className={style.fileInput} onChange={handleFileChange}/>
                                </label>
                                {preview && <img src={preview} alt="Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />}
                            </form>
                        </div>
                        <div className={style.modal_component}>
                            <button onClick={handleUpload} disabled={uploading} className={style.button}>
                                {uploading ? "Загружается..." : "Загрузить"}
                            </button>
                        </div>
                    </div>
                </Modal>
            </main>
)
};

export default function ProfilePage() {
    BubbleControler();
    const { user } = useAuth();
    
    return (
        <ProtectedRoute>
            {user ? <Profile {...user} /> : <Loader />}
        </ProtectedRoute>
    );
 }