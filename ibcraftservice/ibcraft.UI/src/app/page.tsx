"use client";

import { useEffect } from "react";
import CardBlock from "@components/HomePage/CardBlock/CardBlock";
import MainBlock from "@components/HomePage/MainBlock/MainBlock";
import QuestionsBlock from "@components/HomePage/questionsBlock/QuestionsBlock";
import TitleBlock from "@components/HomePage/titleBlock/TitleBlock";
import styles from "./page.module.css";
import BubbleBackground from "@components/EffectComponents/BubbleContainer";
import Alert from "@components/alert/succesAlert";
import { useAlert } from "@components/alert/alertContext";

export default function Home() {
  const { alertMessage, alertColor, alertSuccess } = useAlert();

  useEffect(() => {
    document.body.style.cssText = `
      backgraund: linear-gradient(162deg, rgba(151, 71, 255, 0.20) 0%, rgba(33, 11, 52, 0.20) 49.72%, rgba(135, 0, 255, 0.20) 98.15%), #210B34;
    `
  });

  return (
    <div className={styles.page}>
      {alertMessage && (
        <Alert Success={alertSuccess} Color={alertColor}>
          {alertMessage}
        </Alert>
      )}
      <BubbleBackground />
      <MainBlock />
      <TitleBlock />
      <CardBlock />
      <QuestionsBlock />
    </div>
  );
}
