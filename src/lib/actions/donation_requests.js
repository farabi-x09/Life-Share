"use server"

const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;

export async function createDonationRequest(newDonationRequestData) {
  const response = await fetch(`${baseUrl}/api/donation_requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDonationRequestData),
  });
  return response.json();
}