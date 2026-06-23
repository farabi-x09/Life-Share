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


// export const updateDonationStatus = async (id, updateData) => {
//   try {
//     // 💡 এখানে route name ঠিক করা হয়েছে (donations এর জায়গায় donation_requests)
//     const response = await fetch(`${baseUrl}/api/donation_requests/${id}`, { 
//       method: "PATCH", 
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updateData),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update donation status");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating donation:", error);
//     throw error;
//   }
// };

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
