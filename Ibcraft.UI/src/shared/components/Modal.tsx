"use client";
import { useEffect, useState } from "react";
import style from "./Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    canClose?: boolean;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, canClose = true, children }: ModalProps) {
    const [overflow, setOverflow] = useState(false);

    useEffect(() => {
        setOverflow(isOpen);
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = overflow ? "hidden" : "";
    }, [overflow]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && canClose) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, canClose, onClose]);

    if (!isOpen) return null;

    return (
        <div className={style.modal_overlay} onClick={canClose ? onClose : undefined}>
            <div className={style.modal_content} onClick={(event) => event.stopPropagation()}>
                {children}
                {canClose ? <button className={style.close_button} onClick={onClose}>Закрыть</button> : null}
            </div>
        </div>
    );
}
