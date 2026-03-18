export const BASE_PATH = "https://api.alghadeeruaecrafts.ae/";

export const STATIC_AES_KEY = "OMS1@2020#^@El@K";
// export const ERC_ReCAPTCHA = "6LdO8ysqAAAAANkFNqeLXOhIzTMO-tXqzDTQkbAa";
export const ERC_ReCAPTCHA = "6Lfd6D0rAAAAAB2sJs7KnDr1pYnIcU9YAYeqtvCG";


export const AUTH_PAYLOAD = {
  UserName: "GHADEER",
  Password: "GHADEER123",
  GrantType: "password",
};

export const getAuthPayload = (username, password) => {
  return new URLSearchParams({
    username,
    password,
    grant_type: "password",
  }).toString();
};