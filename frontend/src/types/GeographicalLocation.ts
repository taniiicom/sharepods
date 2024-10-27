import WatchParty from './WatchParty';
interface GeographicalLocation {
  latitude: number;
  longitude: number;
  onFetch: (watchParty: WatchParty) => void;
}

export default GeographicalLocation;
