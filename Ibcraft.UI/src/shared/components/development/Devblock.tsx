import Image from "next/image";
import egg from "@static/egg.79b70834.png"

interface Style {
    height: string
}

export default function DevBlock({height}: Style) {
    return (
        <div className="container"  style={{ height: height, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "35px", fontWeight: "bold" }}>
            <div className="dev" style={{
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "20px",
                position: "relative",
                height: "100%"}}>
                <Image src={egg} alt="Egg image" />
                <p className="text">Раздел в разработке</p>
            </div>
        </div>
    )
}