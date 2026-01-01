import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../context/ContextProvider";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { isRoomAvailable } from "../../utils/capacity";

const useParkvueAIConfig = () => {
  const { currentUser } = useContext(Context) || {};
  const [rooms, setRooms] = useState([]);

  const domain = window.location.origin;

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUser?.city) return;

      const q = query(
        collection(db, "rooms"),
        where("city", "==", currentUser.city),
        // Fetch more than needed, then filter client-side for capacity/legacy availability
        limit(20)
      );

      const snap = await getDocs(q);

      const filtered = snap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((r) => isRoomAvailable(r))
        .slice(0, 5)
        .map((r) => ({
          title: r.title,
          description: r.description,
          price: r.price,
          fullAddress: r.fullAddress,
          ownerName: r.ownerName,
          size: r.size,
          id: r.id,
        }));

      setRooms(filtered);
    };

    fetchRooms();
  }, [currentUser?.city]);

  const config = useMemo(() => {
    const userInfo = currentUser
      ? `
USER CONTEXT:
- Name: ${currentUser.fullName || "Unknown"}
- City: ${currentUser.city || "Unknown"}
- State: ${currentUser.state || "Unknown"}
- Description: ${currentUser.description || "N/A"}
`
      : "USER CONTEXT: Guest user (not logged in)";

    const roomsContext = rooms.length
      ? `
AVAILABLE ROOMS IN USER CITY:
${rooms
  .map(
    r => `- ${r.title} | ${r.description} | ${r.price}/hr | ${r.fullAddress} | Owner: ${r.ownerName} | Size: ${r.size} | Link: ${domain}/booking/${r.id}`
  )
  .join("\n")}
`
      : "NO AVAILABLE ROOMS FOUND FOR USER CITY.";

    return {
      systemInstruction: `
You are the Parkvue Virtual Assistant.

${userInfo}

CORE FUNCTION:
Parkvue connects users to RENT OUT parking spaces (Hosts) and BOOK spaces (Drivers).

KEY FEATURES:
- Search: Map/List views, filters, listing details.
- Booking: Select date/time → Confirm → Secure card payment only → My Bookings.
- Hosting: Create listings, manage availability and requests.
- User Hub: Auth, Dashboard, Profile, Listings, Transactions, Messages.
- Account: Update profile, change password, delete account.

LINKS:
- Parkvue About: ${domain}/about
- Search Parking Rooms: ${domain}/rooms
- Hosting Rooms: ${domain}/upload
- Account Management: ${domain}/profile
- User Dashboard: ${domain}/dashboard
- Map View: ${domain}/map

${roomsContext}

GUIDELINES:
1. Professional, concise, helpful.
2. Stick strictly to listed features.
3. Escalate complex issues to Parkvue Support.
4. Never invent links, rooms, or policies.

SMART ASSISTANCE RULES:
- If the user asks for suggestions or seems lost, proactively recommend the best matching rooms.
- Match recommendations using user city, role, and stated preferences.
- Never suggest rooms outside AVAILABLE ROOMS IN USER CITY.
`,
    };
  }, [currentUser, rooms, domain]);

  return config;
};

export default useParkvueAIConfig;
