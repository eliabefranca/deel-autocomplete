import { createPortal } from 'react-dom';
import './index.css';
import { useCallback, useEffect, useState } from 'react';

interface AutocompleteOverlayProps {
  children?: React.ReactNode;
  refInput?: React.RefObject<HTMLInputElement>;
  onClose?: () => void;
}

const AutocompleteOverlay: React.FC<AutocompleteOverlayProps> = ({
  children,
  onClose,
  refInput,
}) => {
  const getStyle = useCallback(() => {
    if (refInput?.current) {
      const { offsetHeight, offsetWidth } = refInput.current;

      const { top, left, right } = refInput.current.getBoundingClientRect();

      return {
        top: offsetHeight + top,
        left,
        right: right - offsetWidth,
      };
    }

    return {
      top: 0,
      left: 0,
      right: 0,
    };
  }, [refInput]);

  const [style, setStyle] = useState<React.CSSProperties>(getStyle);

  useEffect(() => {
    setStyle(getStyle());
  }, [getStyle]);

  return (
    <>
      {createPortal(
        <div className="AutocompleteOverlay">
          <div
            className="background"
            data-testid="autocomplete-overlay-background"
            onClick={onClose}
          />
          <div className="content" style={style}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AutocompleteOverlay;
