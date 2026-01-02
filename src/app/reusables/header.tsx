import Link from 'next/link'
import Image from 'next/image'
import AuthActions from "@/app/components/auth/AuthActions";
import { getServerUser } from "@/lib/auth";

import "@/app/css/reusables/critical/header.css";

import wordmark_sort from '@/app/assets/identity/logo/oddsligaen_wordmark_sort.svg';
 
async function Header () {
    const user = await getServerUser();

    return (
        <header>
            <div className="announcementbar__container">
                <div className="main__max__width">
                    <div className="announcementbar__wrapper">
                        {/* <div className="announcementbar__left__container">
                        </div> */}
                        <div className="announcementbar__right__container">
                            <Link href="/hvordan-spiller-man" className="announcementbar__link">Hvordan spiller man?</Link>
                            <Link href="/kundeservice" className="announcementbar__link">Kundeservice</Link>
                            <Link href="/om-os" className="announcementbar__link">Om OddsLigaen</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header__container" id="nav-bar">
                <div className="main__max__width">
                    <nav className="header__wrapper">
                        <div className="header__navigation">
                            <Link href="/" className="header__navigation__logo">
                                <Image style={{position: "relative", width: "auto", height: 28}} alt="" src={wordmark_sort} />
                            </Link>
                            <div className="header__navigation__wrapper">
                                <Link href="/betting" className="header__navigation__link">Betting</Link>
                                <Link href="/gruppespil" className="header__navigation__link">Gruppespil</Link>
                                <Link href="/blog" className="header__navigation__link">Blog</Link>
                                <Link href="/faq" className="header__navigation__link">FAQ</Link>
                            </div>
                        </div>
                        {user ? (<div className="header__cta__container">
                            <form action="/api/auth/logout" method="post" className="header__cta__buttons">
                                <button type="submit" className="main__cta__secondary main__cta__secondary__small">Log ud</button>
                            </form>
                            <div className="header__mobile__menu">
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24"><rect y="11" width="24" height="2" rx="1"/><rect y="4" width="24" height="2" rx="1"/><rect y="18" width="24" height="2" rx="1"/></svg>
                            </div>
                        </div>) 
                        : (<div className="header__cta__container">
                            <Link href="/spillere" className="header__cta__trust">
                                <div className="header__cta__trust__people">
                                    <div className="header__cta__trust__people__person"></div>
                                    <div className="header__cta__trust__people__person"></div>
                                    <div className="header__cta__trust__people__person"></div>
                                    <div className="header__cta__trust__people__person"></div>
                                </div>
                                Mere end 2.000+ spillere
                                <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.09813 4.55129L3.46835 1L2.5 1.94871L6.12978 5.5L2.5 9.05129L3.4711 10L7.09813 6.44871C7.35545 6.19707 7.5 5.85582 7.5 5.5C7.5 5.14418 7.35545 4.80293 7.09813 4.55129Z" fill="black"/>
                                </svg>
                            </Link>
                            <div className="header__cta__buttons">
                                <Link href="/login" className="main__cta__secondary main__cta__secondary__small">Log ind</Link>
                                <Link href="/signup" className="main__cta__primary main__cta__primary__small">Opret konto</Link>
                            </div>
                            <div className="header__mobile__menu">
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24"><rect y="11" width="24" height="2" rx="1"/><rect y="4" width="24" height="2" rx="1"/><rect y="18" width="24" height="2" rx="1"/></svg>
                            </div>
                        </div>)}
                    </nav>
                </div>
            </div>
        </header>
    )
}
 
export default Header;