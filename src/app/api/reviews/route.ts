import { NextResponse } from 'next/server';
export const revalidate = 3600;

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  try {
    // 1. Buscar el ID automáticamente
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key!,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.reviews'
      },
      body: JSON.stringify({ textQuery: "Balladares Motors, Rodolfo Briceño 2718, Concepción" })
    });
    const searchData = await searchRes.json();
    const place = searchData.places?.[0];

    if (!place) throw new Error("no place");

    return NextResponse.json({
      rating: place.rating || 4.7,
      total: place.userRatingCount || 57,
      reviews: place.reviews?.slice(0, 3) || [],
      name: place.displayName?.text
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ rating: 4.7, total: 57, reviews: [] });
  }
}