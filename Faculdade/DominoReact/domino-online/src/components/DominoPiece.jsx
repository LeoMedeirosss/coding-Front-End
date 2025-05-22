export const DominoPiece = ({
  piece,
  onClick,
  onDoubleClick,
  draggable = false,
  small = false
}) => {
  const [a, b] = piece;

  const sizeClass = small ? "w-12 h-16 text-sm" : "w-16 h-24 text-xl";
  const bgColor = "bg-white border border-black";
  const pieceStyle = `${sizeClass} ${bgColor} flex flex-col justify-center items-center rounded shadow-md`;

  return (
    <div
      className={pieceStyle}
      draggable={draggable}
      onClick={onClick}
      onDoubleClick={() => onDoubleClick?.(piece)}
      onDragStart={(e) => {
        if (draggable) e.dataTransfer.setData("domino", JSON.stringify(piece));
      }}
    >
      <div>{a}</div>
      <hr className="w-full border-t border-black" />
      <div>{b}</div>
    </div>
  );
};
