"use client"

import DevBlock from "@components/development/Devblock";
import BubbleDisable from "@components/EffectComponents/BubbleControler";


export default function HowPlaying() {
    BubbleDisable();

    return (
        <div style={{height: "100vh"}}>
            <DevBlock height={"100vh"} />
        </div>
    )
}