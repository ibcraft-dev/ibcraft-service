'use client';

import { useEffect } from 'react';
import style from './button.module.css';
import Image from 'next/image'
import Link from 'next/link';

interface SubmitButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    className?: string;
    icon: string;
    href?: string;
}

export default function SubmitButton({children, onClick, disabled, loading, className, icon, href}: SubmitButtonProps) {

  useEffect(() => {
    const iconElement = document.getElementById('icon');
    if (!icon && iconElement != null) {
      iconElement.style.display = "none";
  
    }
  }, [icon]);

    return (
        <Link
            className={`${style.button} ${className ? className : style.padding} ${disabled ? style.disabled_btn : ""} ${loading ? "loading" : ""}`} 
            onClick={onClick}
            href={href ? href : "#!"} type='submit'
        >
            {icon && (
              <Image src={icon} id='icon' width={20} height={20} alt='icons' style={{position: "relative", marginTop: "3px"}}/>
            )}
            {children}
        </Link>
    )
}