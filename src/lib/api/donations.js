const baseUrl=process.env.NEXT_PUBLIC_BASE_URL;

export const getSomeDonation = async(requesterEmail) => {
    const res = await fetch(`${baseUrl}/api/donation_requests?requesterEmail=${requesterEmail}`);
    return res.json();
}