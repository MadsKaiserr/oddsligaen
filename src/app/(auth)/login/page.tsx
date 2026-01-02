"use client"
import Link from 'next/link'
import Image from 'next/image'

import "@/app/css/reusables/critical/auth.css";

import wordmark_sort from '@/app/assets/identity/logo/oddsligaen_wordmark_sort.svg';
import { useEffect, useState } from 'react';
import { createFirebaseSession } from '@/app/components/auth/functions';
import { validateEmail, validatePasswordLogin } from '@/app/components/auth/validations';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type FormMessage = {
  type: "error" | "warning" | "info";
  message: string;
};
 
function Login () {
    const router = useRouter();

    const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStage, setPasswordStage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberDeviceCheckbox, setRememberDeviceCheckbox] = useState(false);

    useEffect(() => {
        setFormMessage(null)
    }, [email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true)

        if (!passwordStage) {
            // Første step: valider email
            const validation = validateEmail(email);
            if (validation) {
                setFormMessage(validation);
                return;
            }
            setFormMessage(null);
            setPasswordStage(true);
            setLoading(false)
            return;
        }

        // Andet step: valider password
        const passwordValidation = validatePasswordLogin(password);
        if (passwordValidation) {
            setFormMessage(passwordValidation);
            setLoading(false)
            return;
        }

        setFormMessage(null);

        // Her kan du kalde Firebase login / API
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const user = credential.user;

            // Hent ID token for server-side session
            const idToken = await user.getIdToken();

            // Send token til API route for server-side session
            await createFirebaseSession(idToken);
            router.push("/");

            return user;
        } catch (error: any) {
            switch (error.code) {
                case "auth/invalid-email":
                setFormMessage({
                    type: "error",
                    message: "Emailen er ikke gyldig",
                });
                break;

                case "auth/user-disabled":
                setFormMessage({
                    type: "error",
                    message: "Denne bruger er deaktiveret",
                });
                break;

                case "auth/user-not-found":
                setFormMessage({
                    type: "error",
                    message: "Ingen bruger med denne email blev fundet",
                });
                break;

                case "auth/wrong-password":
                setFormMessage({
                    type: "error",
                    message: "Adgangskoden er forkert",
                });
                break;

                case "auth/too-many-requests":
                setFormMessage({
                    type: "error",
                    message: "For mange loginforsøg. Prøv igen senere",
                });
                break;

                case "auth/invalid-credential":
                setFormMessage({
                    type: "error",
                    message: "Login-oplysningerne er ikke gyldige",
                });
                break;

                case "auth/account-exists-with-different-credential":
                setFormMessage({
                    type: "error",
                    message: "Denne email er allerede tilknyttet en anden loginmetode",
                });
                break;

                case "auth/operation-not-allowed":
                setFormMessage({
                    type: "error",
                    message: "Denne login-metode er ikke aktiveret",
                });
                break;

                default:
                setFormMessage({
                    type: "error",
                    message: "Der opstod en fejl. Prøv igen.",
                });
                break;
            }
            setLoading(false)
        }
    };

    async function handleGoogleSignup() {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: "select_account",
            });

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

    return (
        <div className="login__container">
            <div className="login__identity__container">
                <Link href="/" className="login__identity__wrapper">
                    <Image height={24} src={wordmark_sort} alt="OddsLigaen Logo" className="login__identity__logo" />
                </Link>
            </div>
            <div className="login__modal__container">
                <h1 className="login__modal__h1">Velkommen tilbage</h1>
                <p className="login__modal__h2">Log ind på din profil</p>
                <form onSubmit={handleSubmit} noValidate>
                    {passwordStage ? <>
                        <div className="login__modal__form__element login__modal__form__element__disabled">
                            <div className="login__modal__form__element__input__container">
                                <input 
                                    type="text" 
                                    className="login__modal__form__element__input" 
                                    value={email}
                                    disabled 
                                />
                            </div>
                        </div>
                        <div className="login__modal__form__element">
                            <div className="login__modal__form__element__input__container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Adgangskode"
                                    className="login__modal__form__element__input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                    required
                                    aria-describedby={formMessage ? "form-message" : undefined}
                                />

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="button" aria-label="Vis kodeord" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <g id="_01_align_center" data-name="01 align center"><path d="M23.821,11.181v0a15.736,15.736,0,0,0-4.145-5.44l3.032-3.032L21.293,1.293,18,4.583A11.783,11.783,0,0,0,12,3C4.5,3,1.057,9.261.179,11.181a1.969,1.969,0,0,0,0,1.64,15.736,15.736,0,0,0,4.145,5.44L1.293,21.293l1.414,1.414L6,19.417A11.783,11.783,0,0,0,12,21c7.5,0,10.943-6.261,11.821-8.181A1.968,1.968,0,0,0,23.821,11.181ZM2,12.011C2.75,10.366,5.693,5,12,5a9.847,9.847,0,0,1,4.518,1.068L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92L5.754,16.832A13.647,13.647,0,0,1,2,12.011ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm3,7a9.847,9.847,0,0,1-4.518-1.068l1.765-1.765a4.992,4.992,0,0,0,6.92-6.92l2.078-2.078A13.584,13.584,0,0,1,22,12C21.236,13.657,18.292,19,12,19Z"/></g>
                                : <g id="_01_align_center" data-name="01 align center"><path d="M23.821,11.181v0C22.943,9.261,19.5,3,12,3S1.057,9.261.179,11.181a1.969,1.969,0,0,0,0,1.64C1.057,14.739,4.5,21,12,21s10.943-6.261,11.821-8.181A1.968,1.968,0,0,0,23.821,11.181ZM12,19c-6.307,0-9.25-5.366-10-6.989C2.75,10.366,5.693,5,12,5c6.292,0,9.236,5.343,10,7C21.236,13.657,18.292,19,12,19Z"/><path d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/></g>}
                                </svg>
                            </div>
                        </div>
                    </>
                    : <div className="login__modal__form__element">
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
                    </div>}
                    {/* <button onClick={() => setRememberDeviceCheckbox(prev => !prev)} className={rememberDeviceCheckbox ? "login__modal__checkbox__container login__modal__checkbox__selected" : "login__modal__checkbox__container"} type="button" role="checkbox" aria-checked={rememberDeviceCheckbox ? "true" : "false"} aria-label="Husk denne enhed i 30 dage">
                        <div className="login__modal__checkbox__box">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                        </div>
                        <p className="login__modal__checkbox__p">Husk denne enhed i 30 dage</p>
                    </button> */}
                    {formMessage && <div className="form__error__container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z"/></svg>
                        <p className="form__error__p">{formMessage.message}</p>
                    </div>}
                    <div className="login__modal__cta__container">
                        <button value="Login" type="submit" className="login__modal__cta__primary">
                            {!loading ? <>
                                {passwordStage ? "Log ind" : "Fortsæt med email"}
                                <div className="login__modal__cta__primary__arrow__container">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M18,12h0a2,2,0,0,0-.59-1.4l-4.29-4.3a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L15,11H5a1,1,0,0,0,0,2H15l-3.29,3.29a1,1,0,0,0,1.41,1.42l4.29-4.3A2,2,0,0,0,18,12Z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M18,12h0a2,2,0,0,0-.59-1.4l-4.29-4.3a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L15,11H5a1,1,0,0,0,0,2H15l-3.29,3.29a1,1,0,0,0,1.41,1.42l4.29-4.3A2,2,0,0,0,18,12Z"/></svg>
                                </div>
                            </> 
                            : <span>
                                <div className="loader" id="loader"></div>
                            </span>}
                        </button>
                        <div className="login__modal__cta__divider">
                            <div className="login__modal__cta__divider__line"></div>
                            <p className="login__modal__cta__divider__p">eller</p>
                            <div className="login__modal__cta__divider__line"></div>
                        </div>
                        <div className="login__modal__cta__provider__container">
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
                            <div className="login__modal__cta__provider__element">
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
                        </div>
                    </div>
                    <p className="login__modal__label">Har du ikke en konto endnu? <Link href="/signup" className="login__modal__link">Opret konto</Link></p>
                </form>
            </div>
            <div className="main__lines__container">
                <div className="main__lines__small"></div>
                <div className="main__lines__large"></div>
            </div>
        </div>
    )
}
 
export default Login;