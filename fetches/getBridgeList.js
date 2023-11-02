import { API_URL } from "../configurations";

export const getBridgeList = async () => {
  try {
    const response = await fetch(API_URL + "/api/bridgelist");

    const bridgelist = response.json();

    return bridgelist;
  } catch (error) {
    alert(error.message);
  }
};
