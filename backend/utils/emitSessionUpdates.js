import { io, sessions } from "../index.js";

export const emitSessionUpdates = (sessionCode) => {
  const session = sessions[sessionCode];
  if (session) {
    io.to(sessionCode).emit("sessionUpdate", session.users);
  }
};
