import './CompanyLogoMarquee.css';

type Company = { name: string; shortName: string };

const companies: Company[] = [
    { name: 'Barcelona Activa', shortName: 'Barcelona Activa' },
    { name: 'Food Souvenir Barcelona', shortName: 'Food Souvenir' },
    { name: 'Interficie Internet Services', shortName: 'Interficie' },
    { name: 'MediaMarkt', shortName: 'MediaMarkt' },
    { name: 'El Corte Inglés', shortName: 'El Corte Inglés' },
    { name: 'Fira de Barcelona', shortName: 'Fira Barcelona' },
    { name: 'PortAventura', shortName: 'PortAventura' },
    { name: 'Havaianas', shortName: 'Havaianas' },
    { name: 'Facilitea', shortName: 'Facilitea' },
    { name: 'CaixaBank', shortName: 'CaixaBank' },
    { name: 'BBVA', shortName: 'BBVA' },
    { name: 'LOEWE', shortName: 'LOEWE' },
];

function Track({ ariaHidden = false }: { ariaHidden?: boolean }) {
    return <div className="company-logo-marquee__track" aria-hidden={ariaHidden}>{companies.map((company) => <div className="company-logo-marquee__item" key={`${ariaHidden ? 'duplicate-' : ''}${company.name}`}><span className="company-logo-marquee__mark" aria-hidden="true">{company.shortName.slice(0, 1)}</span><span>{company.shortName}</span></div>)}</div>;
}

export default function CompanyLogoMarquee() {
    return <section className="company-logo-marquee" aria-labelledby="company-logo-marquee-title"><div className="company-logo-marquee__inner"><p className="company-logo-marquee__eyebrow">Experience across brands</p><h2 id="company-logo-marquee-title">Companies I have worked with</h2><div className="company-logo-marquee__viewport"><Track /><Track ariaHidden /></div></div></section>;
}
