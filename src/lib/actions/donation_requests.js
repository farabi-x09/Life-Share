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



export const updateDonationStatus = async (id, updateData) => {
  try {
    const response = await fetch(`${baseUrl}/api/donation_requests/${id}`, { 
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update donation status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating donation:", error);
    throw error;
  }
};


// delete donation request

export const deleteDonationRequest = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/donation_requests/${id}`, { 
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete donation request");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
};



// funding request
export const funding = async (fundingData) => {
  const res = await fetch(`${baseUrl}/api/funds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fundingData),
  });
  const data = await res.json();
  return data;
};