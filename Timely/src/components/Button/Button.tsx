type ButtonProps = {
  text: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  text,
  variant = 'primary',
  onClick,
  type = 'button',
}: ButtonProps) {
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
