"use client";

import { useEffect } from "react";
import style from "./bubble.module.css";

export default function BubbleDisable() {
    useEffect(() => {
        const bubbleContainer = document.getElementById('bubble-container');
        document.body.style.background = "#13061E";

        if (bubbleContainer) {
            bubbleContainer.classList.add(style.disabled);
        }

        return () => {
            if (bubbleContainer) {
                bubbleContainer.classList.remove(style.disabled);
            }
        };
    });
}