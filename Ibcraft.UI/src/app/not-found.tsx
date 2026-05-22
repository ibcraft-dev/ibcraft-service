

import BubbleBackground from "@components/EffectComponents/BubbleContainer";

function NotFoundPage() {
	return (
        <>
            <BubbleBackground/>
            <div className="container" style={{height: "100vh"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: "20px"}}>
                    <h1 style={{fontSize: "150px"}}>404</h1>
                    <p style={{fontSize: "50px"}}>Страница не найдена</p>
                </div>
            </div>
        </>
    )
}

export default NotFoundPage;