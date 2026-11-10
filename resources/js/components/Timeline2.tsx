import "./Timeline2.css";

type Timeline2Item = {
    id: string;
    title: string;
    description?: string;
};

type Timeline2Props = {
    items: Timeline2Item[];
};

export default function Timeline2({ items }: Timeline2Props) {
    return (
        <section className="timeline2" aria-label="Timeline 2 placeholder">
            <ol className="timeline2__list">
                {items.map((item) => (
                    <li key={item.id} className="timeline2__item">
                        <span className="timeline2__marker" aria-hidden="true" />
                        <div className="timeline2__content">
                            <h3 className="timeline2__title">{item.title}</h3>
                            {item.description && (
                                <p className="timeline2__description">{item.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
