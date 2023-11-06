import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Image,
  Modal,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import axios from "axios";

import { router, useLocalSearchParams } from "expo-router";

import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../configurations";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { getBridgeList } from "../fetches/getBridgeList";

export default function Page() {
  const { width, height } = useWindowDimensions();

  const [image, setImage] = useState(null);

  const { data } = useLocalSearchParams();

  const thisdata = JSON.parse(data);

  const [modalVisible, setModalVisible] = useState(false);

  const [formList, setFormList] = useState([]);

  const thisApiCall = async () => {
    let returnApiCall;

    if (thisdata.project_type === "Toll Plaza") {
      returnApiCall = await getBridgeList();
    } else if (thisdata.project_type === "Bridge") {
      returnApiCall = await getBridgeList();
    }

    setFormList(returnApiCall);
  };

  useEffect(() => {
    thisApiCall();
  }, []);

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

  const FormItems = ({ item, index }) => {
    let materialNames = [];
    let ratingOfMember = [];
    let typeOfDamageNames = [];

    let thisstructure = JSON.parse(item.structure);

    // console.log(index + "--" + JSON.stringify(thisstructure));

    if (thisstructure.component.material) {
      materials = thisstructure.component.material.map((item2, index2) => {
        if (item2.material_details) {
          material_details = item2.material_details.map((item3) => {
            if (item3.name) {
              return (
                <View className="w-full">
                  <TouchableOpacity
                    style={{ elevation: 5 }}
                    className="bg-blue-600 mb-2 p-2 rounded-md flex-row justify-start items-center"
                  >
                    <FontAwesomeIcon
                      icon="fa-regular fa-square"
                      color="white"
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-[16px] text-white font-semibold">
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
        {formList.length < 1 ? (
          <Text className="text-black font-semibold text-[20px]">
            No Form Created Yet!
          </Text>
        ) : (
          <Text className="text-black font-semibold text-[20px]"></Text>
        )}
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
          style={{ backgroundColor: "rgba(0,0,0,0.4)", paddingVertical: 150 }}
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
            <View className="w-full p-3">
              <View className="mb-2">
                <Text className="text-black text-[18px] font-semibold">
                  SPAN No:
                </Text>
                <TextInput className="bg-gray-200 h-[40px] w-full rounded-md" />
              </View>
            </View>
            <FlatList
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
            />
            {/* <Button
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

            <Button title="Upload" onPress={uploadImage} /> */}

            <View className="h-[80px] w-full bg-white border-t-2 pt-4 border-t-black rounded-b-md">
              <TouchableOpacity className="bg-blue-600 self-center flex-row justify-center items-center w-6/12 mb-4 py-2 mx-2 rounded-full">
                <Text className="text-white text-[18px] font-semibold">
                  Submit Form
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
