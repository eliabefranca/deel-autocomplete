import './index.css';

interface AutocompleteItemProps {
  image?: string;
  handleClick?: () => void;
  title: string;
  highlighted: string;
}

const AutocompleteItem: React.FC<AutocompleteItemProps> = ({
  image,
  title,
  highlighted,
  handleClick,
}) => {
  const regex = new RegExp(highlighted, 'gi');

  const matches = title.match(regex) ?? [];

  for (const match of matches) {
    title = title.replace(match, `<strong>${match}</strong>`);
  }

  return (
    <div
      data-testid="autocomplete-item"
      className="AutocompleteItem"
      onClick={handleClick}
    >
      {image && (
        <div className="photo">
          <img src={image} alt={title} />
        </div>
      )}
      <span className="title">
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </span>
    </div>
  );
};

export default AutocompleteItem;
