import { API_URL } from "../configurations";

export const uploadImage = async (images1, images2, images3) => {
  //   console.log(images1);
  let allarray = [...images1, ...images2, ...images3];
  var fd = new FormData();

  allarray.forEach((item, index) => {
    fd.append(`files${index}`, {
      uri: item.data,
      name: `${index}${item.type}.jpg`,
      type: "image/jpeg",
    });
  });
  //   images2.forEach((item, index) => {
  //     fd.append(`files222${index}`, {
  //       uri: item,
  //       name: `${index}image.jpg`,
  //       type: "image/jpeg",
  //     });
  //   });
  //   images3.forEach((item, index) => {
  //     fd.append(`files${index}`, {
  //       uri: item,
  //       name: `${index}image.jpg`,
  //       type: "image/jpeg",
  //     });
  //   });

  fetch(API_URL + "/api/upload", {
    method: "post",
    body: fd,
    // headers: {
    //     'Content-Type': 'multipart/form-data; ',
    // },
  })
    .then((res) => res.json())
    .then((json) => {
      alert(JSON.stringify(json));
    })
    .catch((error) => console.log(error.message));
};
