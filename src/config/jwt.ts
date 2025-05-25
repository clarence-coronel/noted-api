export const convertJwtTimeToMs = (jwtTime: string): number => {
  const unit = jwtTime.slice(-1);
  const value = parseInt(jwtTime.slice(0, -1));

  switch (unit) {
    case "s":
      return value * 1000; // seconds
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    case "w":
      return value * 7 * 24 * 60 * 60 * 1000; // weeks
    default:
      return parseInt(jwtTime) * 1000; // assume seconds if no unit
  }
};

export const ACCESS_TOKEN_EXPIRES = "1h";
export const REFRESH_TOKEN_EXPIRES = "7d";
