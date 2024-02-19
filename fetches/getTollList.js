import { API_URL } from "../configurations";

export const getTollList = async () => {
  try {
    const response = await fetch(API_URL + "/api/tolllist");

    const bridgelist = response.json();

    return bridgelist;
  } catch (error) {
    alert(error.message);
  }
};
