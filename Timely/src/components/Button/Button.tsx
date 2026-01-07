import './Button.css';

type ButtonProps = {
  text: string;
  variant?: 'primary' | 'outline' | 'signin' | 'quick-action';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;     
  description?: string; 
};

export default function Button({
  text,
  variant = 'primary',
  onClick,
  type = 'button',
  icon,
  description,
}: ButtonProps) {
  if(variant == 'quick-action') {
    return (
       <button type={type} onClick={onClick} className={`button ${variant}`}>
        <div className="quick-action-content">
          {icon && <div className="quick-action-icon">{icon}</div>}
          <span className="quick-action-label">{text}</span>
          {description && <span className="quick-action-desc">{description}</span>}
        </div>
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variant}`}
    >
      {text}
    </button>
  );
}
