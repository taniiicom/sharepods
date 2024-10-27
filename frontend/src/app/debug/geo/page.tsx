"use client"
import useGeolocation from "@/hooks/useGeolocation";

export default function DebugGeoPage() {
  const {coordinates, loading, error} = useGeolocation()

  return <div>
    {coordinates ? <>
          <p>coordinates[0]: {coordinates[0]}</p>
          <p>coordinates[1]: {coordinates[1]}</p>
        </>
        : <p>coordinates is null</p>
    }
    <p>loading: {loading}</p>
    <p>error: {error}</p>
  </div>
}
