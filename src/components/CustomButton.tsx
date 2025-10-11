interface CustomButtonProps {
  text: string;
  buttonStyle: string;
  onClick?: () => void;
}

export function CustomButton({
  text,
  buttonStyle,
  onClick,
}: CustomButtonProps) {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
}
