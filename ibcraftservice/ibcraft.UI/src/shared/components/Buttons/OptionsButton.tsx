import Link from "next/link";
import { useEffect } from "react";
import style from './button.module.css';
import Image from 'next/image'

interface OptionButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    className?: string;
    icon: string;
    href?: string;
}


export default function OptionsButton({children, onClick, disabled, loading, className, icon, href}: OptionButtonProps) {
    useEffect(() => {
        const iconElement = document.getElementById('icon');
        if (!icon && iconElement != null) {
          iconElement.style.display = "none";
      
        }
      }, [icon]);
    
    return (
        <Link
            className={`${style.buttonOption} ${className ? className : style.padding} ${disabled ? "disabled_btn" : ""} ${loading ? "loading" : ""}`} 
            onClick={onClick}
            href={href ? href : ""}
        >
            {icon && (
                <Image src={icon} id='icon' width={20} height={20} alt='icons' style={{position: "relative", marginTop: "3px"}}/>
            )}
            {children}
        </Link>
    )
}