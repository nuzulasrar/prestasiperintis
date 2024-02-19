import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Image as RNImage,
  Modal,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useState, useEffect, useRef } from "react";

import Collapsible from "react-native-collapsible";

import { Link } from "expo-router";

import axios from "axios";

import { router, useLocalSearchParams } from "expo-router";

import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../configurations";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { getBridgeList } from "../fetches/getBridgeList";

import { getTollList } from "../fetches/getTollList";

import { getSubMiitedFormList } from "../fetches/getSubmittedFormList";

import Draw from "./draw";

export default function Page() {
  const { width, height } = useWindowDimensions();

  const [image, setImage] = useState(null);

  const { data } = useLocalSearchParams();

  const thisdata = JSON.parse(data);

  const [modalVisible, setModalVisible] = useState(false);

  const [zoomModalVisible, setZoomModalVisible] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [formInfo, setFormInfo] = useState({});

  const [debounceTimer, setDebounceTimer] = useState(null);

  //data of the form
  const [formList, setFormList] = useState([]);

  //data of the submitted form previously
  const [viewFormList, setViewFormList] = useState([]);

  //guna utk change component
  const [activeIndex, setActiveIndex] = useState(-1);

  //disable button state
  const [disableButton, setDisableButton] = useState(false);

  //sample images array
  const [arraySampleImages, setArraySampleImages] = useState([]);

  //image zoom
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const receivedImage = (image) => {
    let thisarray = [...arraySampleImages];
    thisarray.push(image);
    setArraySampleImages(thisarray);
    plusActiveIndex(activeIndex);
  };

  const flatListRef = useRef(null);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  useEffect(() => {
    scrollToTop();
    setDisableButton(false);
  }, [activeIndex]);

  const thisApiCall = async () => {
    let returnApiCall;

    if (thisdata.project_type === "Toll") {
      returnApiCall = await getTollList();
    } else if (thisdata.project_type === "Bridge") {
      returnApiCall = await getBridgeList();
    }

    // console.log("api", returnApiCall.bridgelist)
    setFormList(returnApiCall);

    let returnViewFormData = await getSubMiitedFormList();

    // console.log("api", returnApiCall.bridgelist)
    setViewFormList(returnViewFormData);
  };

  useEffect(() => {
    thisApiCall();
  }, []);

  const minusActiveIndex = (index) => {
    if (index !== -1) {
      // setDisableButton(true);
      setActiveIndex(activeIndex - 1);
    }
  };

  const plusActiveIndex = (index) => {
    // setDisableButton(true);
    setActiveIndex(activeIndex + 1);
  };

  const captureFormInfo = (name, value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(
      setTimeout(() => {
        setFormInfo({ ...formInfo, [name]: value });
      }, 500) // Adjust the delay as needed
    );
  };

  useEffect(() => {
    // Clean up any existing debounce timer when the component unmounts
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const captureInput = (
    code,
    whichDetail,
    component,
    material,
    type_of_damages,
    material_rating
  ) => {
    //ambik yg lama
    const thisMaterial = { ...formList };

    //parse structure
    let thisStructure = JSON.parse(
      thisMaterial.bridgelist[component].structure
    );

    //x pernah set
    if (
      String(
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].tick
      ) == "0"
    ) {
      //set active details
      thisStructure["component"].material[material].type_of_damages[
        type_of_damages
      ].active_details = whichDetail;
      //set rating of damage
      thisStructure["component"].material[material].type_of_damages[
        type_of_damages
      ].severity_of_damage = material_rating + 1;

      //set tick for the material
      thisStructure["component"].material[material].type_of_damages[
        type_of_damages
      ].tick = 1;

      //set percentage affected
      if (whichDetail == 1) {
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].percentage_affected =
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].severity_of_damage_list[material_rating].details;
      } else if (whichDetail == 2) {
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].percentage_affected =
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].severity_of_damage_list[material_rating].details_2;
      } else if (whichDetail == 3) {
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].percentage_affected =
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].severity_of_damage_list[material_rating].details_3;
      }
    }
    // pernah set
    else {
      //sama
      if (
        String(
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].severity_of_damage
        ) == String(Number(material_rating + 1))
      ) {
        //set active details
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].active_details = 0;
        //set rating of damage
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].severity_of_damage = 0;

        //set tick for the material
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].tick = 0;

        //set percentage affected
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].percentage_affected = "";
      }
      //x sama
      else {
        //set active details
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].active_details = whichDetail;
        //set rating of damage
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].severity_of_damage = material_rating + 1;

        //set percentage affected
        if (whichDetail == 1) {
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].percentage_affected =
            thisStructure["component"].material[material].type_of_damages[
              type_of_damages
            ].severity_of_damage_list[material_rating].details;
        } else if (whichDetail == 2) {
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].percentage_affected =
            thisStructure["component"].material[material].type_of_damages[
              type_of_damages
            ].severity_of_damage_list[material_rating].details_2;
        } else if (whichDetail == 3) {
          thisStructure["component"].material[material].type_of_damages[
            type_of_damages
          ].percentage_affected =
            thisStructure["component"].material[material].type_of_damages[
              type_of_damages
            ].severity_of_damage_list[material_rating].details_3;
        }
      }
    }

    thisStructure.component.material.forEach((item, index) => {
      let maxSeverity = 0;

      // Iterate through the "type_of_damages" array for each "material" item
      item.type_of_damages.forEach((damage) => {
        const severity = damage.severity_of_damage;
        if (severity > maxSeverity) {
          maxSeverity = severity;
        }
      });

      // Update the "rating_of_member" with the maximum severity
      item.rating_of_member = maxSeverity;
    });

    // convert to string to store to DB
    thisMaterial.bridgelist[component].structure =
      JSON.stringify(thisStructure);

    // console.log(
    //   JSON.stringify(JSON.parse(thisMaterial.bridgelist[component].structure))
    // );

    // set to the original list to FE
    setFormList(thisMaterial);
  };

  const captureInput2 = (
    componentIndex,
    materialCategoryIndex,
    materialIndex
  ) => {
    //ambik yg lama
    const thisMaterial = { ...formList };

    //parse structure
    let thisStructure = JSON.parse(
      thisMaterial.bridgelist[componentIndex].structure
    );
    // console.log(JSON.stringify(thisStructure["component"].material[materialCategoryIndex].material_details[
    //   materialIndex
    // ].tick))

    if (
      thisStructure["component"].material[materialCategoryIndex]
        .material_details[materialIndex].tick === 0
    ) {
      thisStructure["component"].material[
        materialCategoryIndex
      ].material_details[materialIndex].tick = 1;
    } else {
      thisStructure["component"].material[
        materialCategoryIndex
      ].material_details[materialIndex].tick = 0;
    }

    thisMaterial.bridgelist[componentIndex].structure =
      JSON.stringify(thisStructure);

    setFormList(thisMaterial);
  };

  const FormItems = ({ item, index }) => {
    if (index !== activeIndex) {
      return;
    }

    let materialNames = [];
    let ratingOfMember = [];
    let typeOfDamageNames = [];

    let thisstructure = JSON.parse(item.structure);

    // console.log(index + "--" + JSON.stringify(thisstructure));

    if (thisstructure.component.material) {
      materials = thisstructure.component.material.map((item2, index2) => {
        if (item2.material_details) {
          material_details = item2.material_details.map((item3, index3) => {
            if (item3.name) {
              return (
                <View className="w-full">
                  <TouchableOpacity
                    onPress={() => {
                      captureInput2(index, index2, index3);
                    }}
                    style={{
                      elevation: 5,
                      backgroundColor:
                        item3.tick === 0
                          ? "rgb(229 231 235)"
                          : "rgba(37, 99, 235, 1)",
                    }}
                    className="bg-blue-600 mb-2 p-2 rounded-md flex-row justify-start items-center"
                  >
                    <FontAwesomeIcon
                      icon={
                        item3.tick === 0
                          ? `fa-regular fa-square`
                          : `square-check`
                      }
                      color={item3.tick === 0 ? "black" : "white"}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className="text-[16px] font-semibold"
                      style={{ color: item3.tick === 0 ? "black" : "white" }}
                    >
                      {item3.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
          });
          ratingOfMember.push(item2.rating_of_member);
          materialNames.push(material_details);
        }

        if (item2.type_of_damages) {
          damages_details = item2.type_of_damages.map((item3, index3) => {
            if (item3.name) {
              if (item3.severity_of_damage_list) {
                return (
                  <View className="mb-2 rounded-md">
                    <View className="w-full flex-row justify-start items-center mb-4">
                      <FontAwesomeIcon
                        icon="house-damage"
                        color="rgba(37, 99, 275, 1)"
                        size={20}
                        style={{ marginRight: 8 }}
                      />
                      <View className="flex-row justify-center items-center">
                        <Text className="text-[18px] font-bold underline mr-3">
                          {index3 + 1}- {item3.name}{" "}
                        </Text>
                        <View
                          style={{ elevation: 3 }}
                          className="bg-green-600 rounded-full h-[25px] w-[100px] justify-center items-center"
                        >
                          <Text className="text-white text-[16px] font-bold">
                            Code: {item3.code}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="mb-4 p-0 rounded-md justify-center items-end">
                      <View
                        className="h-[50px] justify-center"
                        style={{ width: "90%" }}
                      >
                        <Text className="text-black text-[16px] font-semibold">
                          {item3.type_of_damages_array[0]}
                        </Text>
                      </View>
                      {item3.severity_of_damage_list.map(
                        (severityItem, severityIndex) => {
                          return (
                            <TouchableOpacity
                              style={{
                                elevation: 5,
                                width: "90%",
                                backgroundColor:
                                  String(item3.tick) == "1" &&
                                  severityIndex ==
                                    String(
                                      Number(item3.severity_of_damage - 1)
                                    ) &&
                                  String(item3.active_details) == "1"
                                    ? "rgba(27,99,235,1)"
                                    : "rgba(243,244,246,1)",
                              }}
                              className={`p-3 mb-2 rounded-md flex-row`}
                              onPress={() => {
                                captureInput(
                                  item3.code,
                                  1,
                                  index,
                                  index2,
                                  index3,
                                  severityIndex
                                );
                              }}
                            >
                              <Text
                                className={`font-bold leading-5 text-[16px]`}
                                style={{
                                  color:
                                    String(item3.tick) == "1" &&
                                    severityIndex ==
                                      String(
                                        Number(item3.severity_of_damage - 1)
                                      ) &&
                                    String(item3.active_details) == "1"
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {severityItem.level} -{" "}
                                <Text className="font-semibold">
                                  {" "}
                                  {severityItem.details}
                                </Text>
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      )}

                      {item3.code == 3 ||
                      item3.code == 6 ||
                      item3.code == 7 ||
                      item3.code == 10 ||
                      item3.code == 14 ||
                      item3.code == 17 ||
                      item3.code == 35 ? (
                        <View
                          className="h-[50px] justify-center"
                          style={{ width: "90%" }}
                        >
                          <Text className="text-black text-[16px] font-semibold">
                            {item3.type_of_damages_array[1]}
                          </Text>
                        </View>
                      ) : null}

                      {item3.code == 3 ||
                      item3.code == 6 ||
                      item3.code == 7 ||
                      item3.code == 10 ||
                      item3.code == 14 ||
                      item3.code == 17 ||
                      item3.code == 35
                        ? item3.severity_of_damage_list.map(
                            (severityItem, severityIndex) => {
                              return (
                                <TouchableOpacity
                                  style={{
                                    elevation: 5,
                                    width: "90%",
                                    backgroundColor:
                                      String(item3.tick) == "1" &&
                                      severityIndex ==
                                        String(
                                          Number(item3.severity_of_damage - 1)
                                        ) &&
                                      String(item3.active_details) == "2"
                                        ? "rgba(27,99,235,1)"
                                        : "rgba(243,244,246,1)",
                                  }}
                                  className={`p-3 mb-2 rounded-md flex-row`}
                                  onPress={() => {
                                    captureInput(
                                      item3.code,
                                      2,
                                      index,
                                      index2,
                                      index3,
                                      severityIndex
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      color:
                                        String(item3.tick) == "1" &&
                                        severityIndex ==
                                          String(
                                            Number(item3.severity_of_damage - 1)
                                          ) &&
                                        String(item3.active_details) == "2"
                                          ? "white"
                                          : "black",
                                    }}
                                    className={`font-bold leading-5 text-[16px]`}
                                  >
                                    {severityItem.level} -{" "}
                                    <Text className="font-semibold">
                                      {" "}
                                      {severityItem.details_2}
                                    </Text>
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          )
                        : null}

                      {item3.code == 17 ? (
                        <View
                          className="h-[50px] justify-center"
                          style={{ width: "90%" }}
                        >
                          <Text className="text-black text-[16px] font-semibold">
                            {item3.type_of_damages_array[2]}
                          </Text>
                        </View>
                      ) : null}

                      {item3.code == 17
                        ? item3.severity_of_damage_list.map(
                            (severityItem, severityIndex) => {
                              return (
                                <TouchableOpacity
                                  style={{
                                    elevation: 5,
                                    width: "90%",
                                    backgroundColor:
                                      String(item3.tick) == "1" &&
                                      severityIndex ==
                                        String(
                                          Number(item3.severity_of_damage - 1)
                                        ) &&
                                      String(item3.active_details) == "3"
                                        ? "rgba(27,99,235,1)"
                                        : "rgba(243,244,246,1)",
                                  }}
                                  className={`p-3 mb-2 rounded-md flex-row`}
                                  onPress={() => {
                                    // alert("hi");
                                    captureInput(
                                      item3.code,
                                      3,
                                      index,
                                      index2,
                                      index3,
                                      severityIndex
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      color:
                                        String(item3.tick) == "1" &&
                                        severityIndex ==
                                          String(
                                            Number(item3.severity_of_damage - 1)
                                          ) &&
                                        String(item3.active_details) == "3"
                                          ? "white"
                                          : "black",
                                    }}
                                    className={`font-bold leading-5 text-[16px]`}
                                  >
                                    {severityItem.level} -{" "}
                                    <Text className="font-semibold">
                                      {" "}
                                      {severityItem.details_3}
                                    </Text>
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          )
                        : null}
                    </View>
                    <View className="mb-3 self-end" style={{ width: "90%" }}>
                      <View className="mb-2">
                        <View className="flex-row justify-start items-center mb-2">
                          <FontAwesomeIcon
                            icon="percent"
                            color="rgba(37, 99, 275, 1)"
                            size={18}
                            style={{ marginRight: 8 }}
                          />
                          <Text className="text-black text-[18px] font-semibold">
                            Percentage Affected
                          </Text>
                        </View>
                        <TextInput
                          value={String(item3.percentage_affected)}
                          className="bg-gray-100 rounded-md h-[35px] pl-3"
                        />
                      </View>
                      <View className="mb-2">
                        <View className="flex-row justify-start items-center mb-2">
                          <FontAwesomeIcon
                            icon="comment"
                            color="rgba(37, 99, 275, 1)"
                            size={18}
                            style={{ marginRight: 8 }}
                          />
                          <Text className="text-black text-[18px] font-semibold">
                            Remarks
                          </Text>
                        </View>
                        <TextInput
                          value={String(item3.remarks)}
                          className="bg-gray-100 rounded-md h-[35px] pl-3"
                        />
                      </View>
                      <View className="mb-2">
                        <View className="flex-row justify-start items-center mb-2">
                          <FontAwesomeIcon
                            icon="chart-bar"
                            color="rgba(37, 99, 275, 1)"
                            size={18}
                            style={{ marginRight: 8 }}
                          />
                          <Text className="text-black text-[18px] font-semibold">
                            Rating of Damage
                          </Text>
                        </View>
                        <TextInput
                          value={String(item3.severity_of_damage)}
                          className="bg-gray-100 rounded-md h-[35px] pl-3"
                        />
                      </View>
                    </View>
                  </View>
                );
              }
            }
          });
          typeOfDamageNames.push(damages_details);
        }
      });
    }

    return (
      <View className="mb-5 border-b-2">
        {/* debug value */}
        {/* <Text selectable>{JSON.stringify(JSON.parse(formList.bridgelist[activeIndex].structure).component)}</Text> */}
        <View className="bg-yellow-400 p-2 flex-row justify-start items-center mb-4">
          <FontAwesomeIcon
            icon="truck-loading"
            color="black"
            size={20}
            style={{ marginRight: 8 }}
          />
          <Text className="text-black font-bold text-[20px]">
            {thisstructure.component.component_details.name}
          </Text>
        </View>
        {materialNames.map((thisItem, thisIndex) => {
          return (
            <View className="mb-3">
              {thisItem}
              <Text className="mb-2 text-black text-[18px] font-semibold">
                Rating of Member: {ratingOfMember[thisIndex]}
              </Text>
              <View className="h-[8px]" />
              {typeOfDamageNames[thisIndex]}
            </View>
          );
        })}
      </View>
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    var fd = new FormData();

    fd.append("files", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    });

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

  const submitForm = () => {
    // console.log("form: ", formList.bridgelist);
    var fd = new FormData();

    fd.append("name", JSON.stringify(formList.bridgelist));

    fd.append("project_type", thisdata.project_type);

    fetch(API_URL + "/api/submitform", {
      method: "POST",
      body: fd,
      // headers: {
      //   "Content-Type": "multipart/form-data; ",
      // },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("json", json);

        if (json.success) {
          setModalVisible(false);
        }
      })
      .catch((error) => console.log("ERROR", error));
  };

  const ViewFormRender = ({ item, index }) => {
    let eachform = JSON.parse(item.formdata);
    let eachform2 = JSON.parse(eachform);
    // let eachform3 = JSON.parse(eachform2[1].structure)
    return (
      <TouchableOpacity className="w-full bg-gray-200 mb-2 rounded-md p-2">
        <Text selectable className="text-black">
          {JSON.stringify(eachform2)}
        </Text>
        <View className="h-[20px]" />
      </TouchableOpacity>
    );
  };

  const [zoomIndex, setZoomIndex] = useState(-1);

  const RenderArraySampleImages = ({ item, index }) => {
    return (
      <View className="justify-center items-center">
        <TouchableOpacity
          onPress={() => {
            setZoomIndex(index);
            setZoomModalVisible(true);
            setModalVisible(false);
          }}
        >
          <RNImage
            source={{ uri: item }}
            style={{
              width: width * 0.3,
              height: width * 0.3,
              marginBottom: 10,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            let thisArray = [...arraySampleImages];

            thisArray.splice(index, 1);

            setArraySampleImages(thisArray);
          }}
          className="bg-red-700 rounded-lg border-none"
        >
          <Text className="text-white px-8 py-2">Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 justify-start bg-gray-200">
      <View className="h-[50px]" />
      <View className="bg-blue-700 w-full h-[50px] flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-transparent flex-row justify-start items-center pl-[15px] h-[50px] w-[100px]"
        >
          <FontAwesomeIcon icon="arrow-left" size={25} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-[20px] font-semibold">
          Project Details
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-transparent flex-row justify-start items-center pl-[15px] h-[50px] w-[100px]"
        >
          <FontAwesomeIcon icon="arrow-left" size={25} color="transparent" />
        </TouchableOpacity>
      </View>

      <View className="bg-white w-[95%] self-center rounded-md p-3 mb-5">
        <Text className="text-black font-bold text-[20px] mb-2">
          Project Name:{" "}
          <Text className="text-black text-[20px] font-normal">
            {thisdata.project_name}
          </Text>
        </Text>
        <Text className="text-black font-bold text-[20px] mb-2">
          Project Type:{" "}
          <Text className="text-black text-[20px] font-normal">
            {thisdata.project_type}
          </Text>
        </Text>
      </View>
      <Text className="ml-3 mb-3 text-black text-[20px] font-bold">
        Form List
      </Text>
      <View className="bg-white w-[95%] self-center rounded-md p-3">
        {/* {formList.bridgelist.length < 1 ? (
          <Text className="text-black font-semibold text-[20px]">
            No Form Created Yet!
          </Text>
        ) : (
          <Text className="text-black font-semibold text-[20px]"></Text>
        )} */}
        {/* <Text className="text-black">{JSON.stringify(viewFormList)}</Text> */}
        <FlatList
          data={viewFormList}
          ListEmptyComponent={() => (
            <Text className="text-black">No Submmited Form Yet</Text>
          )}
          renderItem={({ item, index }) => (
            <ViewFormRender item={item} index={index} />
          )}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{ elevation: 4 }}
        className="bg-blue-700 justify-center items-center self-center absolute bottom-4 right-4 rounded-[50px] h-[70px] w-[70px]"
      >
        <FontAwesomeIcon icon="plus" size={25} color={"white"} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View
          className="h-full flex-1 justify-center items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingVertical: !isCollapsed ? height / 10 : height / 10,
          }}
        >
          <View
            className="bg-white w-11/12 rounded-lg"
            style={{}}
            activeOpacity={1}
          >
            <View
              className="bg-blue-600 rounded-t-md w-full justify-center"
              style={{ height: width * 0.15 }}
            >
              <Text
                className="text-white text-[15px] text-left font-bold ml-3"
                style={{ width: "83%" }}
              >
                {thisdata.project_type === "Bridge"
                  ? "ROUTINE CONDITION INSPECTION - STRUCTURAL CONDITION CHECKLIST (BRIDGE)"
                  : "TOLL PLAZA CANOPY - INSPECTION CHECKLIST"}
              </Text>
              {/* <Text>{JSON.stringify(formList)}</Text> */}
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: width * 0.15,
                  width: width * 0.15,
                }}
                className="flex justify-center items-center rounded-tr-md p-4 bg-red-600"
              >
                <FontAwesomeIcon icon="xmark" color="white" size={30} />
              </TouchableOpacity>
            </View>
            {activeIndex === -1 ? (
              <Collapsible collapsed={isCollapsed}>
                <Text>{JSON.stringify(formInfo)}</Text>
                <View className="w-full p-3">
                  {thisdata.project_type === "Bridge" ? (
                    <View className="mb-2">
                      <Text className="text-black text-[18px] font-semibold">
                        SPAN No:
                        {/* {String(activeIndex)}{" "} 
                       {String(formList.bridgelist.length)} */}
                      </Text>
                      <TextInput
                        value={formInfo?.span_no}
                        onChangeText={(e) => captureFormInfo("span_no", e)}
                        className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                      />
                    </View>
                  ) : null}

                  <View className="mb-2">
                    <Text className="text-black text-[18px] font-semibold">
                      Route No:
                    </Text>
                    <TextInput
                      value={formInfo?.route_no}
                      onChangeText={(e) => captureFormInfo("route_no", e)}
                      className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                    />
                  </View>
                  <View className="mb-2">
                    <Text className="text-black text-[18px] font-semibold">
                      Struct No:
                    </Text>
                    <TextInput
                      value={formInfo?.struct_no}
                      onChangeText={(e) => captureFormInfo("struct_no", e)}
                      className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                    />
                  </View>
                  <View className="mb-2">
                    <Text className="text-black text-[18px] font-semibold">
                      Bridge Name:
                    </Text>
                    <TextInput
                      value={formInfo?.bridge_name}
                      onChangeText={(e) => captureFormInfo("bridge_name", e)}
                      className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                    />
                  </View>
                  <View className="mb-2">
                    <Text className="text-black text-[18px] font-semibold">
                      Name of Inspector:
                    </Text>
                    <TextInput
                      value={formInfo?.name_of_inspector}
                      onChangeText={(e) =>
                        captureFormInfo("name_of_inspector", e)
                      }
                      className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                    />
                  </View>
                  <View className="mb-2">
                    <Text className="text-black text-[18px] font-semibold">
                      Date:
                    </Text>
                    <TextInput
                      value={formInfo?.date}
                      onChangeText={(e) => captureFormInfo("date", e)}
                      className="bg-gray-200 h-[40px] w-full rounded-md pl-2"
                    />
                  </View>
                </View>
              </Collapsible>
            ) : activeIndex === formList?.bridgelist?.length - 1 ? (
              <View style={{ width: "100%", height: height * 0.75 }}>
                <Draw saveimage={receivedImage} />
              </View>
            ) : activeIndex === formList?.bridgelist?.length ? (
              <View>
                <Text className="text-black">
                  <FlatList
                    data={arraySampleImages}
                    renderItem={({ item, index }) => (
                      <RenderArraySampleImages item={item} index={index} />
                    )}
                    numColumns={3}
                    ListEmptyComponent={() => (
                      <Text className="text-black text-[16px] m-2">
                        You have not uploaded any drawing.
                      </Text>
                    )}
                  />
                </Text>
              </View>
            ) : null}
            {/* <TouchableOpacity
              onPress={() => {
                setIsCollapsed(!isCollapsed);
              }}
              className="p-2 w-full flex-row justify-center items-center"
            >
              <Text className="text-black text-[16px] font-semibold mr-3">
                {isCollapsed ? "Show" : "Hide"} Form Information
              </Text>
              <FontAwesomeIcon
                icon={isCollapsed ? "angle-down" : "angle-up"}
                color="black"
                size={16}
              />
            </TouchableOpacity> */}

            {/* main flatlist */}
            <FlatList
              ref={flatListRef}
              data={formList.bridgelist}
              renderItem={({ item, index }) => (
                <FormItems item={item} index={index} />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 15,
                marginTop: 10,
              }}
              extraData={activeIndex}
            />

            {activeIndex == 11 ? <View></View> : null}

            {/* 
              <Button
                title="Pick an image from camera-roll"
                onPress={pickImage}
                style={{ marginVertical: 30 }}
              />
              {image ? (
                <Image
                  source={{
                    uri: image,
                  }}
                  style={{
                    width: 200,
                    height: 150,
                    marginVertical: 30,
                  }}
                />
              ) : null}

              <Button title="Upload" onPress={uploadImage} /> 
            */}

            <View className="h-[80px] w-full bg-white border-t-2 pt-4 border-t-black rounded-b-md flex-row justify-around items-center">
              <TouchableOpacity
                onPress={() => minusActiveIndex(activeIndex)}
                className="bg-blue-600 self-center flex-row justify-center items-center w-4/12 mb-4 py-2 mx-2 rounded-full"
                disabled={disableButton}
              >
                <Text className="text-white text-[18px] font-semibold">
                  Previous
                </Text>
              </TouchableOpacity>
              {activeIndex !== formList?.bridgelist?.length ? (
                <TouchableOpacity
                  onPress={() => plusActiveIndex(activeIndex)}
                  className="bg-blue-600 self-center flex-row justify-center items-center w-4/12 mb-4 py-2 mx-2 rounded-full"
                  disabled={disableButton}
                >
                  <Text className="text-white text-[18px] font-semibold">
                    Next
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    submitForm();
                  }}
                  className="bg-green-600 self-center flex-row justify-center items-center w-4/12 mb-4 py-2 mx-2 rounded-full"
                >
                  <Text className="text-white text-[18px] font-semibold">
                    Submit Form
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={zoomModalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
          setZoomModalVisible(!modalVisible);
        }}
      >
        <View
          className="justify-center items-center"
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,1)" }}
        >
          <View
            className="justify-center items-center"
            style={{
              width: "100%",
              height: height,
            }}
          >
            <View
              className="bg-blue-300 justify-around rounded-md mb-4 px-3 absolute"
              style={{
                width: "90%",
                height: 40,
                top: 50,
                zIndex: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setZoomModalVisible(false);
                  setModalVisible(true);
                }}
                className="flex-row justify-start items-center h-full"
              >
                <FontAwesomeIcon icon="chevron-left" size={20} />
                <Text className="text-[20px]">Back</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: height, width: width }}>
              <View style={{ height: height * 0.13 }} />
              <RNImage
                source={{ uri: arraySampleImages[zoomIndex] }}
                style={{
                  height: "70%",
                  width: "100%",
                  marginBottom: 10,
                  transform: [{ scale: canvasScale }],
                  marginHorizontal: canvasX,
                  marginVertical: canvasY,
                }}
              />
            </View>
            <View
              className="bg-blue-300 mt-2 flex-row justify-around items-center py-2 rounded-lg absolute"
              style={{
                width: "90%",
                alignSelf: "center",
                bottom: 50,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => setCanvasScale((old) => old + 0.5)}
              >
                <FontAwesomeIcon icon={"magnifying-glass-plus"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (canvasScale !== 1) setCanvasScale((old) => old - 0.5);
                }}
              >
                <FontAwesomeIcon icon={"magnifying-glass-minus"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCanvasX((old) => old - 25);
                }}
              >
                <FontAwesomeIcon icon={"chevron-left"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCanvasX((old) => old + 25);
                }}
              >
                <FontAwesomeIcon icon={"chevron-right"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCanvasY((old) => old + 25);
                }}
              >
                <FontAwesomeIcon icon={"chevron-up"} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCanvasY((old) => old - 25);
                }}
              >
                <FontAwesomeIcon icon={"chevron-down"} size={25} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
