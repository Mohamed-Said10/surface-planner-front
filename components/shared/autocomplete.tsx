import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useCombobox } from 'downshift';

type Suggestion = {
  id: string;
  name: string;
  address: string;
  place_id?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
  }
};

export type LocationData = {
  city: string;
  community: string;
  subcommunity: string;
  building: string;
  lat: number;
  lng: number;
  formattedAddress: string;
};

type DubaiSearchBoxProps = {
  onLocationSelect?: (data: LocationData) => void;
  initialValue?: string; // Add initialValue prop
};

// Helper function to format addresses
export const formatAddress = (rawAddress: string): string => {
    // Remove United Arab Emirates if present
    let address = rawAddress.replace(/,?\s*United Arab Emirates/i, '').replace(/,?\s*Émirats arabes unis/i, '').trim();
    
    // Replace hyphens with commas
    address = address.replace(/-/g, ',');
    
    // Split by commas, trim each part, and filter out empty parts
    let parts = address.split(',')
      .map(part => part.trim())
      .filter(part => part.length > 0);
    
    // Reverse the order of parts
    parts = parts.reverse();
    
    // Join with comma and space
    address = parts.join(', ');
    
    // Clean up any remaining multiple commas or spaces
    address = address.replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim();
    
    // Remove any trailing commas
    return address.replace(/,\s*$/, '');
  };
  

export const DubaiSearchBox = forwardRef<{ setInputValue: (value: string) => void }, DubaiSearchBoxProps>(
  ({ onLocationSelect, initialValue = '' }, ref) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autocompleteService, setAutocompleteService] = 
      useState<google.maps.places.AutocompleteService | null>(null);
    const [placesService, setPlacesService] = 
      useState<google.maps.places.PlacesService | null>(null);

    // Expose setInputValue method to parent components
    useImperativeHandle(ref, () => ({
      setInputValue: (value: string) => {
        setInputValue(value);
      }
    }));
 
    useEffect(() => {

        const loadScript = async () => {
            try {
              if (!window.google?.maps?.places) {
                await loadGoogleMapsScript();
              }
              setAutocompleteService(new google.maps.places.AutocompleteService());
              
              const mapDiv = document.createElement('div');
              setPlacesService(new google.maps.places.PlacesService(mapDiv));
            } catch (err) {
              setError('Failed to load Google Maps');
            }
          };
          loadScript();
      
    }, []);

    useEffect(() => {
      if (!inputValue.trim() || !autocompleteService) {
        setSuggestions([]);
        return;
      }

      const timer = setTimeout(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const token = new google.maps.places.AutocompleteSessionToken();
          const predictions = await new Promise<google.maps.places.AutocompletePrediction[] | null>(
            (resolve) => {
              autocompleteService.getPlacePredictions(
                { 
                  input: inputValue,
                  sessionToken: token,
                  componentRestrictions: { country: 'AE' },
                  location: new google.maps.LatLng(25.2048, 55.2708),
                  radius: 50000,
                  types: ['geocode', 'establishment']
                },
                (predictions, status) => {
                  if (status !== 'OK') {
                    setError(getErrorMessage(status));
                    resolve(null);
                  } else {
                    resolve(predictions);
                  }
                }
              );
            }
          );

          if (predictions) {
            const mappedSuggestions = predictions.map((prediction) => {
              // Get secondary text and format it (reversed)
              let address = prediction.structured_formatting.secondary_text || '';
              address = formatAddress(address);
              
              return {
                id: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                address: address,
                place_id: prediction.place_id
              };
            });
            setSuggestions(mappedSuggestions);
          }
        } catch (err) {
          setError('Failed to fetch suggestions');
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [inputValue, autocompleteService]);

    const fetchPlaceDetails = (placeId: string): Promise<google.maps.places.PlaceResult> => {
      return new Promise((resolve, reject) => {
        if (!placesService) {
          reject(new Error('Places service not available'));
          return;
        }

        placesService.getDetails(
          { placeId, fields: ['geometry', 'name', 'formatted_address', 'address_components'] },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error('Failed to fetch place details'));
            }
          }
        );
      });
    };

    const handleSelectItem = async (item: Suggestion | null) => {
      if (!item || !item.place_id) return;
      
      try {
        const placeDetails = await fetchPlaceDetails(item.place_id);
        
        // Format the full address (reversed)
        const formattedFullAddress = formatAddress(placeDetails.formatted_address || '');
        const addressParts = formattedFullAddress;
        console.log("addressParts: ", placeDetails);
        
        const locationData: LocationData = {
          city: addressParts[0] || '',
          community: addressParts[1] || '',
          subcommunity: addressParts[2] || '',
          building: placeDetails.name || '',
          lat: placeDetails.geometry?.location?.lat() || 0,
          lng: placeDetails.geometry?.location?.lng() || 0,
          formattedAddress: formattedFullAddress
        };
        
        // Set the formatted address in the input
        setInputValue(item.name);
        
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
        
        setSuggestions([]);
        
      } catch (err) {
        setError('Failed to get location coordinates');
      }
    };

    const {
      isOpen,
      getMenuProps,
      getInputProps,
      getItemProps,
    } = useCombobox({
      items: suggestions,
      inputValue,
      onInputValueChange: ({ inputValue }: any) => {
        setInputValue(inputValue || '');
      },
      itemToString: (item: any) => {
        if (!item) return '';
        return formatAddress(`${item.address}`);
      },
      onSelectedItemChange: ({ selectedItem }: any) => {
        handleSelectItem(selectedItem || null);
      }
    });

    return (
      <div className="search-container">
        <div className="search-input-container">
          <input
            {...getInputProps()}
            placeholder="Search locations in UAE..."
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {isLoading && <div className="loading-spinner">Loading...</div>}
        </div>
        
        <ul {...getMenuProps()} className="suggestions-list">
          {isOpen && suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <li
                {...getItemProps({
                  key: item.id,
                  index,
                  item
                })}
                className="suggestion-item"
              >
                <div className="suggestion-name">{item.name}</div>
                <div className="suggestion-address">{item.address}</div>
              </li>
            ))
          ) : (
            isOpen && !isLoading && <li className="no-results">No results found</li>
          )}
        </ul>
        
        {error && <div className="error-message">{error}</div>}
      </div>
    );
});

// Helper function definitions
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD_rakAcENsIZ3PvTOXdRmepMG89RJ7YlI&libraries=places&language=en&region=AE`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
    
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  });
};

const getErrorMessage = (status: string): string => {
  switch (status) {
    case 'ZERO_RESULTS': return 'No results found';
    case 'OVER_QUERY_LIMIT': return 'Search quota exceeded';
    case 'REQUEST_DENIED': return 'Search request denied';
    case 'INVALID_REQUEST': return 'Invalid search request';
    default: return 'Error fetching suggestions';
  }
};


const styles = `
  .search-container {
    position: relative;
    width: 100%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  .search-input-container {
    position: relative;
  }
  .search-input {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .loading-spinner {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 14px;
  }
  .suggestions-list {
    position: absolute;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 4px 0 0;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  .suggestion-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
  }
  .suggestion-item:hover {
    background-color: #f5f5f5;
  }
  .suggestion-item:last-child {
    border-bottom: none;
  }
  .suggestion-name {
    font-weight: 600;
    margin-bottom: 4px;
  }
  .suggestion-address {
    font-size: 14px;
    color: #666;
  }
  .no-results {
    padding: 12px 16px;
    color: #666;
    font-style: italic;
  }
  .error-message {
    color: #d32f2f;
    margin-top: 8px;
    font-size: 14px;
  }
`;
