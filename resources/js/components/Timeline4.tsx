import "./Timeline4.css";

type Timeline4Item = {
    id: string;
    title: string;
    description?: string;
};

type Timeline4Props = {
    items: Timeline4Item[];
};

export default function Timeline4({ items }: Timeline4Props) {
    return (
        <section className="timeline4" aria-label="Timeline 4 placeholder">
            <ol className="timeline4__list">
                {items.map((item) => (
                    <li key={item.id} className="timeline4__item">
                        <div className="timeline4__content">
                            <h3 className="timeline4__title">{item.title}</h3>
                            {item.description && (
                                <p className="timeline4__description">{item.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
