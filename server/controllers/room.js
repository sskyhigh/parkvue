import tryCatch from "./utils/tryCatch";
import Room from "../models/Room";

export const createRoom = tryCatch(async (req, res) => {
  const { id: uid, name: uName, photoURL: uPhoto } = req.user;
  const newRoom = new Room({ ...req.body, uid, uName, uPhoto });
  await newRoom.save();
  res.status(201).json({ success: true, result: newRoom });
});

// export const createRoom = async (req, res) => {
//   //testing resource access
//   res.status(201)
//       .json({ success: true, result: { id: 123, title: 'test room'}} );
// };