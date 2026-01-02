import Link from 'next/link'

import "@/app/css/reusables/critical/landingpage-hero.css";

export default async function Home() {

  return (
    <div className="main__max__width">
      <div className="landingpage__hero__container">
        <div className="landingpage__hero__content">
          <h1 className="landingpage__hero__h1">Fodbold-betting<br/>med virtuelle penge</h1>
          <p className="landingpage__hero__description">Konkurrér i private og offentlige ligaer med virtuelle penge, og se, hvem der kan omsætte startbeløbet til mest.</p>
          <div className="landingpage__hero__cta__container">
            <div className="header__cta__buttons">
              <Link href="/signup" className="main__cta__primary">Opret konto</Link>
              <Link href="/login" className="main__cta__secondary">Log ind</Link>
            </div>
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
          </div>
        </div>
        <div className="main__lines__container">
          <div className="main__lines__small"></div>
          <div className="main__lines__large"></div>
        </div>
      </div>
    </div>
  );
}
