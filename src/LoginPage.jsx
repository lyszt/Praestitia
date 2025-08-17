import { useRef, useEffect } from 'react'
import PraestitLogoText from "./assets/images/LogoText.png"
import CircleShadow from "./assets/images/forms/circle-shadow.svg"
// CSS
import './assets/css/LoginPage.css'
import './App.css'

function LoginPage() {

    const circlesRef = useRef([]); // array de refs
    const anglesRef = useRef([]);  // array para os ângulos

    useEffect(() => {
        let frameId;

        const animate = () => {
            circlesRef.current.forEach((circle, i) => {
                if (!circle) return;

                // atualiza ângulo
                anglesRef.current[i] = (anglesRef.current[i] || 0) + 0.5;

                // movimento de sobe/desce
                const angle = anglesRef.current[i];
                const y = Math.sin(angle * 0.05) * 5;

                // aplica transformação
                circle.style.transform = `translateY(${y}px) rotate(${angle}deg)`;
            });

            frameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <main className="login-page flex w-screen h-screen flex-row-reverse justify-center items-center">

            {/* FORMULÁRIO */}
            <form className="login-form flex-col flex gap-3 w-1/3 mr-[10%]">
                <input className="crimson login-box text-white" name="username" type="text" placeholder="Usuário"/>
                <input className="bg-white password-box" name="password" type="password" placeholder="Senha"/>
                <input type="submit" className="submit" value="LOGIN" name="submit"/>
            </form>

            <div className="container background-widgets">
                {/* ELEMENTOS DO FUNDO */}
                {/* LOGO */}
                <img
                    className="select-none w-1/8 absolute left-1/7 top-1/3"
                    src={PraestitLogoText}
                    alt="Praestit"
                />

                {/* CÍRCULOS */}
                <div
                    ref={el => circlesRef.current[1] = el}
                    className="circle grey w-[5vw] h-[5vw] absolute left-4/9 top-1/9"
                ></div>

                <div
                    ref={el => circlesRef.current[2] = el}
                    className="circle crimson w-[5vw] h-[5vw] absolute left-2/8 top-1/9"
                ></div>

                <img
                    className="select-none w-1/5 absolute left-2/7 top-1/5"
                    src={CircleShadow}
                    alt="Circle with shadow"
                />

                <div
                    ref={el => circlesRef.current[3] = el}
                    className="circle crimson w-[10vw] h-[10vw] absolute left-3/7 top-4/6"
                ></div>
            </div>

        </main>
    )
}

export default LoginPage;
