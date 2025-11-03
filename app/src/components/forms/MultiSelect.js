import { useState, useEffect, useRef } from 'react';
import './MultiSelect.css';

export default function MultiSelect({ 
  value = [], 
  onChange, 
  options = [], 
  label,
  placeholder = 'Select items...',
  required = false,
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Initialize selected items from value prop
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedItems(value);
    } else if (typeof value === 'string' && value) {
      setSelectedItems(value.split(',').map(id => id.trim()));
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (itemId) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelected);
    onChange({ 
      target: { 
        name, 
        value: newSelected 
      } 
    });
    setSearchTerm('');
  };

  const handleRemove = (itemId, e) => {
    e.stopPropagation();
    const newSelected = selectedItems.filter(id => id !== itemId);
    setSelectedItems(newSelected);
    onChange({ 
      target: { 
        name, 
        value: newSelected 
      } 
    });
  };

  const getItemLabel = (itemId) => {
    const item = options.find(opt => opt.value === itemId || opt.id === itemId);
    return item ? (item.label || item.name || itemId) : itemId;
  };

  const filteredOptions = options.filter(option => {
    const label = option.label || option.name || option.value || option.id || '';
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      {label && (
        <label className="multi-select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className={`multi-select-input ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="selected-items">
          {selectedItems.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            selectedItems.map(itemId => (
              <span key={itemId} className="chip">
                {getItemLabel(itemId)}
                <button
                  type="button"
                  className="chip-remove"
                  onClick={(e) => handleRemove(itemId, e)}
                  aria-label="Remove"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="multi-select-dropdown">
          <input
            type="text"
            className="dropdown-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="dropdown-options">
            {filteredOptions.length === 0 ? (
              <div className="dropdown-option disabled">No options available</div>
            ) : (
              filteredOptions.map((option) => {
                const optionId = option.value || option.id;
                const optionLabel = option.label || option.name || optionId;
                const isSelected = selectedItems.includes(optionId);
                
                return (
                  <div
                    key={optionId}
                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(optionId);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{optionLabel}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

