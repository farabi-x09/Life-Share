const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;

export const getSomeDonation = async(requesterEmail) => {
    const res = await fetch(`${baseUrl}/api/donation_requests?requesterEmail=${requesterEmail}`);
    return res.json();
}

export const getDonations = async(status) => {
    const res = await fetch(`${baseUrl}/api/donation_requests?status=${status}`);
    return res.json();
}


export const getRequestById = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/api/donation_requests/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching request by ID:", error);
    return null;
  }
};