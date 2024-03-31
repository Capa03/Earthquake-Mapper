export interface EarthquakeFeature {
  type: 'Feature';
  properties: {
    mag: number; // Earthquake magnitude
    place?: string; // Location description (optional)
    time: number; // Earthquake timestamp in milliseconds
    updated?: number; // Last update timestamp in milliseconds (optional)
    tz?: string | null; // Timezone information (optional)
    url?: string; // Link to earthquake details (optional)
    detail?: string; // Link to detailed earthquake data (optional)
    felt?: null | any; // Indicates if the earthquake was felt (optional, structure might vary)
    cdi?: null | any; // California Intensity Scale rating (optional, structure might vary)
    mmi?: null | any; // Modified Mercalli Intensity rating (optional, structure might vary)
    alert?: null | any; // Alert information (optional, structure might vary)
    status: string; // Status of the earthquake data (e.g., "automatic")
    tsunami: number; // Presence of tsunami (0 for absent)
    sig: number; // Significance score
    net: string; // Network identifier
    code: string; // Earthquake event code
    ids: string; // Comma-separated list of identifiers (optional)
    sources: string; // Comma-separated list of sources (optional)
    types: string; // Comma-separated list of data types (optional)
    nst: number; // Number of stations used in the solution
    dmin: number; // Minimum distance (optional)
    rms: number; // Root mean square of travel-time residuals (optional)
    gap: number; // Largest azimuthal gap (optional)
    magType: string; // Type of magnitude measurement (e.g., "ml")
    title: string; // Earthquake title
  };
  geometry: {
    type: 'Point';
    coordinates: number[]; // Array of [longitude, latitude, altitude]
  };
  id?: string; // Feature identifier (optional)
}

export interface Earthquake {
  type: 'FeatureCollection';
  metadata?: { // Metadata object (optional)
    generated: number; // Generation timestamp in milliseconds
    url: string; // Data source URL
    title: string; // Collection title
    status: number; // HTTP status code
    api: string; // API version
    count: number; // Number of features in the collection
  };
  crs?: { // Coordinate reference system (optional, present in second example)
    type: string; // "name"
    properties: {
      name: string; // CRS name (e.g., "urn:ogc:def:crs:OGC:1.3:CRS84")
    };
  };
  features: EarthquakeFeature[];
}
