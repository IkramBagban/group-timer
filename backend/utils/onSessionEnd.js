import { sessions } from "../index.js";
import { notifyUserIfBackground } from "./sendBackgroundNotification.js";

/**
 * Handles actions to be performed when a session countdown ends.
 * This includes notifying all users that the session has ended,
 * marking the session as ended, clearing the countdown interval,
 * and eventually deleting the session from the sessions store.
 *
 * @param {Object} sessions - The store holding all active session data.
 * @param {string} sessionCode - The unique code identifying the session.
 * @param {NodeJS.Timeout} countdownInterval - The interval ID for the session countdown.
 */

export const onSessionEnd = (sessionCode, countdownInterval) => {
  // Retrieve the session object using the provided sessionCode
  const session = sessions[sessionCode];

  // Check if the session has not already been marked as ended to avoid redundant notifications
  if (!session.sessionEnded) {
    // Notify all users in the session who are in a background state
    session.users.forEach((user) =>
      notifyUserIfBackground(
        user,
        "Timer Complete",
        "Your timer has been completed."
      )
    );

    // Mark the session as ended to prevent further actions on this session
    session.sessionEnded = true;
  }

  clearInterval(countdownInterval);
  setTimeout(() => delete sessions[sessionCode], 5000); // 5000 milliseconds = 5 seconds
  return;
};
