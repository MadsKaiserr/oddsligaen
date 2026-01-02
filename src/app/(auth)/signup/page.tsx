"use client"
import Link from 'next/link'
import Image from 'next/image'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, FacebookAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import "@/app/css/reusables/critical/auth.css";

import wordmark_sort from '@/app/assets/identity/logo/oddsligaen_wordmark_sort.svg';
import { useEffect, useState } from 'react';
import { createFirebaseSession } from '@/app/components/auth/functions';
import { validateName, validateEmail, validatePasswordSignup } from '@/app/components/auth/validations';

type FormMessage = {
  type: "error" | "warning" | "info";
  message: string;
};
 
function Signup () {
    const router = useRouter();

    const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

    const [formStage, setFormStage] = useState(0)

    const [email, setEmail] = useState("");
    const [fornavn, setFornavn] = useState("");
    const [efternavn, setEfternavn] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberDeviceCheckbox, setRememberDeviceCheckbox] = useState(false);

    useEffect(() => {
        setFormMessage(null)
    }, [email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const firstNameError = validateName(fornavn);
        if (firstNameError) return setFormMessage(firstNameError);

        const lastNameError = validateName(efternavn);
        if (lastNameError) return setFormMessage(lastNameError);

        const emailError = validateEmail(email);
        if (emailError) return setFormMessage(emailError);

        const passwordError = validatePasswordSignup(password);
        if (passwordError) return setFormMessage(passwordError);

        setFormMessage(null);

        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(credential.user, {
                displayName: `${fornavn} ${efternavn}`,
            });

            await createFirebaseSession(await credential.user.getIdToken());
            router.push("/");

        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
            setFormMessage({
                type: "error",
                message: "Emailen er allerede i brug",
            });
            } else if (error.code === "auth/weak-password") {
            setFormMessage({
                type: "error",
                message: "Adgangskoden er for svag",
            });
            } else {
            setFormMessage({
                type: "error",
                message: "Der opstod en fejl. Prøv igen.",
            });
            }
        }
    };

    async function handleGoogleSignup() {
        try {
            const provider = new GoogleAuthProvider();

            const credential = await signInWithPopup(auth, provider);
            const user = credential.user;

            // 3️⃣ Opdater profil hvis nødvendigt
            // Bemærk: Google leverer allerede displayName og email
            // Hvis du vil tilføje noget ekstra, kan du gøre det her
            // await updateProfile(user, { displayName: "Ekstra navn" });

            const idToken = await user.getIdToken();
            await createFirebaseSession(idToken);

            router.push("/");

        } catch (error: any) {
            let message = "Der opstod en fejl under Google login. Prøv igen.";
            console.log(error)

            switch (error.code) {
            case "auth/popup-closed-by-user":
                message = "Popup-vinduet blev lukket før login.";
                break;
            case "auth/cancelled-popup-request":
                message = "Login blev afbrudt. Prøv igen.";
                break;
            case "auth/account-exists-with-different-credential":
                message =
                "Denne email er allerede tilknyttet en anden loginmetode. Prøv en anden metode.";
                break;
            case "auth/invalid-credential":
                message = "Ugyldig Google login. Prøv igen.";
                break;
            }

            setFormMessage({
                type: "error",
                message,
            });
        }
    }

    async function handleFacebookSignup() {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const idToken = await user.getIdToken();
            await createFirebaseSession(idToken);

            router.push("/");
        } catch (error: any) {
            if (error.code === "auth/account-exists-with-different-credential") {
            console.error(
                "Der findes allerede en konto med denne email under en anden provider."
            );
            } else if (error.code === "auth/popup-blocked") {
            console.error("Popup blev blokeret. Tillad popups for dit site.");
            } else if (error.code === "auth/cancelled-popup-request") {
            console.error("Popup blev lukket før login fuldført.");
            } else if (error.code === "auth/popup-closed-by-user") {
            console.error("Popup blev lukket af brugeren.");
            } else {
            console.error("Facebook signup fejl:", error.code, error.message);
            }
        }
    }

    function nextStage() {
        setFormStage(formStage + 1)
    }

    return (
        <div className="login__container">
            <div className="login__identity__container">
                <Link href="/" className="login__identity__wrapper">
                    <Image height={24} src={wordmark_sort} alt="OddsLigaen Logo" className="login__identity__logo" />
                </Link>
            </div>
            <div className="login__modal__container">
                <h1 className="login__modal__h1">Opret din konto</h1>
                <p className="login__modal__h2">Vælg en af nedenstående for at fortsætte</p>
                <form onSubmit={handleSubmit} noValidate>
                    {formStage == 1 && <div className="login__modal__form__fields">
                        <div className="login__modal__form__element">
                            <div className="login__modal__form__element__input__container">
                                <input 
                                    placeholder='Email adresse' 
                                    type="text" 
                                    className="login__modal__form__element__input" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    aria-invalid={formMessage?.type === "error"}
                                    aria-describedby={formMessage ? "form-message" : undefined}
                                    required 
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="login__modal__form__element__multi">
                            <div className="login__modal__form__element__input__container">
                                <input 
                                    placeholder='Fornavn' 
                                    type="text" 
                                    className="login__modal__form__element__input" 
                                    onChange={(e) => setFornavn(e.target.value)}
                                    value={fornavn}
                                    aria-invalid={formMessage?.type === "error"}
                                    aria-describedby={formMessage ? "form-message" : undefined}
                                    required 
                                />
                            </div>
                            <div className="login__modal__form__element__input__container">
                                <input 
                                    placeholder='Efternavn' 
                                    type="text" 
                                    className="login__modal__form__element__input" 
                                    onChange={(e) => setEfternavn(e.target.value)}
                                    value={efternavn}
                                    aria-invalid={formMessage?.type === "error"}
                                    aria-describedby={formMessage ? "form-message" : undefined}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="login__modal__form__element">
                            <div className="login__modal__form__element__input__container">
                                <input 
                                    placeholder='Kodeord' 
                                    type="password" 
                                    className="login__modal__form__element__input" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    aria-invalid={formMessage?.type === "error"}
                                    aria-describedby={formMessage ? "form-message" : undefined}
                                    required 
                                />
                            </div>
                        </div>
                    </div>}
                    {formMessage && <div className="form__error__container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z"/></svg>
                        <p className="form__error__p">{formMessage.message}</p>
                    </div>}
                    <div className="login__modal__cta__container">
                        <button type={formStage < 1 ? "button" : "submit"} className="login__modal__cta__primary" onClick={() => {
                            if (formStage < 1) {
                                nextStage()
                            }
                        }}>
                            {formStage == 0 && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                            </svg>}
                            {formStage == 0 && "Fortsæt med email"}
                            {formStage > 0 && "Opret konto med Email"}
                            {formStage > 0 && <div className="login__modal__cta__primary__arrow__container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M18,12h0a2,2,0,0,0-.59-1.4l-4.29-4.3a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L15,11H5a1,1,0,0,0,0,2H15l-3.29,3.29a1,1,0,0,0,1.41,1.42l4.29-4.3A2,2,0,0,0,18,12Z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M18,12h0a2,2,0,0,0-.59-1.4l-4.29-4.3a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L15,11H5a1,1,0,0,0,0,2H15l-3.29,3.29a1,1,0,0,0,1.41,1.42l4.29-4.3A2,2,0,0,0,18,12Z"/></svg>
                            </div>}
                        </button>
                        <div className="login__modal__cta__divider">
                            <div className="login__modal__cta__divider__line"></div>
                            <p className="login__modal__cta__divider__p">eller</p>
                            <div className="login__modal__cta__divider__line"></div>
                        </div>
                        <div className="login__modal__cta__provider__container">
                            {formStage > 0 ? <div className="login__modal__cta__provider__element">
                                Benyt en anden metode
                            </div> 
                            : <>
                                {/* <div className="login__modal__cta__provider__element">
                                    <svg className="login__modal__cta__provider__element__icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve">
                                        <g id="_Group_2">
                                            <g id="_Group_3">
                                                <path id="_Path_" d="M18.546,12.763c0.024-1.87,1.004-3.597,2.597-4.576c-1.009-1.442-2.64-2.323-4.399-2.378    c-1.851-0.194-3.645,1.107-4.588,1.107c-0.961,0-2.413-1.088-3.977-1.056C6.122,5.927,4.25,7.068,3.249,8.867    c-2.131,3.69-0.542,9.114,1.5,12.097c1.022,1.461,2.215,3.092,3.778,3.035c1.529-0.063,2.1-0.975,3.945-0.975    c1.828,0,2.364,0.975,3.958,0.938c1.64-0.027,2.674-1.467,3.66-2.942c0.734-1.041,1.299-2.191,1.673-3.408    C19.815,16.788,18.548,14.879,18.546,12.763z"/>
                                                <path id="_Path_2" d="M15.535,3.847C16.429,2.773,16.87,1.393,16.763,0c-1.366,0.144-2.629,0.797-3.535,1.829    c-0.895,1.019-1.349,2.351-1.261,3.705C13.352,5.548,14.667,4.926,15.535,3.847z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </div> */}
                                <div className="login__modal__cta__provider__element" onClick={() => handleFacebookSignup()}>
                                    <svg className="login__modal__cta__provider__element__icon" style={{fill: "#1977f3"}} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve">
                                        <g>
                                            <path d="M24,12.073c0,5.989-4.394,10.954-10.13,11.855v-8.363h2.789l0.531-3.46H13.87V9.86c0-0.947,0.464-1.869,1.95-1.869h1.509   V5.045c0,0-1.37-0.234-2.679-0.234c-2.734,0-4.52,1.657-4.52,4.656v2.637H7.091v3.46h3.039v8.363C4.395,23.025,0,18.061,0,12.073   c0-6.627,5.373-12,12-12S24,5.445,24,12.073z"/>
                                        </g>
                                    </svg>
                                </div>
                                <div className="login__modal__cta__provider__element" onClick={() => handleGoogleSignup()}>
                                    <svg version="1.1" className="login__modal__cta__provider__element__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <path style={{fill: "#EA4335"}} d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path style={{fill: "#4285F4"}} fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path style={{fill: "#FBBC05"}} fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path style={{fill: "#34A853"}} fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    </svg>
                                </div>
                            </>}
                        </div>
                    </div>
                    <p className="login__modal__label">Har du allerede en konto? <Link href="/login" className="login__modal__link">Log ind</Link></p>
                </form>
            </div>
            <div className="main__lines__container">
                <div className="main__lines__small"></div>
                <div className="main__lines__large"></div>
            </div>
        </div>
    )
}
 
export default Signup;