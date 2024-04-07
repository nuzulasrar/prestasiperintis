import { API_URL } from "../configurations";

export const uploadImage = async (images1, images2, images3) => {
  let allarray = [...images1, ...images2, ...images3];
  var fd = new FormData();

  allarray.forEach((item, index) => {
    fd.append(`files${index}`, {
      uri: item.data,
      name: `${index}${item.type}.jpg`,
      type: "image/jpeg",
    });
  });

  try {
    const response = await fetch(API_URL + "/api/upload", {
      method: "post",
      body: fd,
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
