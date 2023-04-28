import './index.css';

interface AutocompleteOverlayProps {
  children?: React.ReactNode;
  onClose?: () => void;
}

const AutocompleteOverlay: React.FC<AutocompleteOverlayProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="AutocompleteOverlay">
      <div
        className="background"
        data-testid="autocomplete-overlay-background"
        onClick={onClose}
      ></div>
      <div className="content">{children}</div>
    </div>
  );
};

export default AutocompleteOverlay;
