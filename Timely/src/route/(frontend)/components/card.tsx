import './card.css'

interface CardTemplate{
    title: String
    text: string
}

interface CardComponentProps{
    _card: CardTemplate
    color?: string
}

function CardComponent ({_card, color}: CardComponentProps) {

     const cardClass = color ? `card-template card-${color}` : "card-template";

    return (
        <div className={cardClass}>
            <h3>{_card.title}</h3>
            <p>{_card.text}</p>
        </div>
    )
}

export default CardComponent