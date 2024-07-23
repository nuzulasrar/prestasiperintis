import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Modal,
  useWindowDimensions,
  Keyboard,
  Alert,
  StyleSheet,
  Image,
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
import { uploadImage } from "../fetches/postUploadData";

import { getSubMiitedFormList } from "../fetches/getSubmittedFormList";

import Draw from "./draw";

const Formdetail = () => {
  const { width, height } = useWindowDimensions();
  const { form, properimages, id } = useLocalSearchParams();
  const parsed = decodeURIComponent(form);
  const parsedImages = JSON.parse(properimages);
  console.log(JSON.stringify(JSON.parse(parsed), 0, 2));

  const [formList, setFormList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setFormList(JSON.parse(parsed));
  }, []);

  useEffect(() => {
    // console.log("formList", formList);
  }, [formList]);

  const FormItems = ({ item, index }) => {
    if (index !== activeIndex) {
      return;
    }

    let materialNames = [];
    let ratingOfMember = [];
    let typeOfDamageNames = [];

    let thisstructure = JSON.parse(item.structure);

    // console.log(index + "--" + JSON.stringify(thisstructure));

    // return <Text className="text-black">asdasd</Text>;

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
      <View className="border-b-2" style={{ marginBottom: 200 }}>
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
            {thisstructure.component.component_details.name} {item.position}{" "}
            {index}
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

  const captureInput = (
    code,
    whichDetail,
    component,
    material,
    type_of_damages,
    material_rating
  ) => {
    //ambik yg lama
    const thisMaterial = [...formList];

    //parse structure
    let thisStructure = JSON.parse(thisMaterial[component].structure);

    console.log(JSON.stringify(thisStructure));

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

      //kalau confirm 4
      if (
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].remarks.includes("rating = 4")
      ) {
        //set rating of damage
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].severity_of_damage = 4;

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
      //kalau confirm 3
      else if (
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].remarks.includes("rating = 3")
      ) {
        //set rating of damage
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].severity_of_damage = 3;

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
      } else {
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
    }
    // pernah set
    else {
      if (
        thisStructure["component"].material[material].type_of_damages[
          type_of_damages
        ].remarks.includes("rating = 4")
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
      } else {
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
    thisMaterial[component].structure = JSON.stringify(thisStructure);

    // console.log(
    //   JSON.stringify(JSON.parse(thisMaterial.bridgelist[component].structure))
    // );

    // console.log(JSON.stringify(thisStructure));

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

  const updateForm = () => {
    // console.log("form: ", formList.bridgelist);
    var fd = new FormData();

    fd.append("form", JSON.stringify(formList));
    fd.append("id", JSON.stringify(id));

    fetch(API_URL + "/api/submitform", {
      method: "PUT",
      body: fd,
      // headers: {
      //   "Content-Type": "multipart/form-data; ",
      // },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("json", json);
      })
      .catch((error) => console.log("ERROR", error));
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
          Form Details - Edit Information {formList.length}
        </Text>
        <TouchableOpacity
          onPress={() => updateForm()}
          className="bg-transparent flex-row justify-start items-center pl-[15px] h-[50px] w-[100px]"
        >
          {/* <FontAwesomeIcon icon="arrow-left" size={25} color="transparent" /> */}
          <Text className="text-white">Update</Text>
        </TouchableOpacity>
      </View>
      <Text>ID: {id}</Text>
      {/* <Text>properimages: {properimages}</Text> */}
      <View className="flex-1 justify-center- items-center">
        {/* <Text>{JSON.stringify(formList[1].position)}</Text> */}
        {/* <View> */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={formList}
          renderItem={({ item, index }) => {
            let thisstructure = JSON.parse(item.structure);
            return (
              <View className="p-2">
                <TouchableOpacity
                  onPress={() => setActiveIndex(index)}
                  className="px-6 py-2 bg-yellow-400 rounded-full"
                >
                  <Text className="text-black font-bold text-[16px]">
                    {thisstructure.component.component_details.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          style={{ height: 90 }}
        />
        {/* </View> */}
        {activeIndex < formList.length && (
          <FlatList
            // ref={flatListRef}
            data={formList}
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
        )}
        {activeIndex === formList.length ? (
          <View className="" style={{ maxHeight: height / 1.5 }}>
            {/* <Text>asdasdasd</Text>
            <Text>{JSON.stringify(parsedImages)}</Text>
            <Text>{JSON.stringify(parsedImages[0])}</Text> */}
            {/* <Text>{JSON.stringify(parsedImages)}</Text> */}

            <FlatList
              data={parsedImages}
              renderItem={({ item, index }) => {
                // return <Text>{item}</Text>;
                return (
                  <View className="mb-8">
                    <Image
                      src={`https://inspection-dev.prestasiperintis.com/uploads/${item}`}
                      style={{ width: width * 0.75, height: width * 0.75 }}
                      resizeMode="contain"
                    />
                    <Text className="text-black text-center my-3">{item}</Text>
                    <View className="flex-row justify-center items-center">
                      <TouchableOpacity className="px-6 py-3 bg-yellow-400 rounded-3xl mx-3">
                        <Text className="text-black font-semibold">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="px-6 py-3 bg-red-600 rounded-3xl mx-3">
                        <Text className="text-white font-semibold">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : null}

        <View className="w-full flex-row justify-around items-center my-3">
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(activeIndex - 1);
            }}
            className="bg-blue-500 px-6 py-2 rounded-full"
          >
            <Text className="text-white font-bold text-[18px]">Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(activeIndex + 1);
            }}
            className="bg-green-500 px-6 py-2 rounded-full"
          >
            <Text className="text-white font-bold text-[18px]">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Formdetail;

const styles = StyleSheet.create({});
