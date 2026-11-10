import "./Timeline3.css";

type Timeline3Item = {
    id: string;
    title: string;
    description?: string;
};

type Timeline3Props = {
    items: Timeline3Item[];
};

export default function Timeline3({ items }: Timeline3Props) {
    return (
        <section className="timeline3" aria-label="Timeline 3 placeholder">
            <ol className="timeline3__list">
                {items.map((item) => (
                    <li key={item.id} className="timeline3__item">
                        <div className="timeline3__content">
                            <h3 className="timeline3__title">{item.title}</h3>
                            {item.description && (
                                <p className="timeline3__description">{item.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
