import { API_URL } from "../configurations";

export const getSubMiitedFormList = async () => {
  try {
    const response = await fetch(API_URL + "/api/viewform");

    const viewformlist = response.json();

    return viewformlist;
  } catch (error) {
    alert(error.message);
  }
};
