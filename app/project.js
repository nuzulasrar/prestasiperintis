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

  const FormItems = ({ item, index }) => {
    let materialNames = [];
    let typeOfDamageNames = [];

    let thisstructure = JSON.parse(item.structure);

    // console.log(index + "--" + JSON.stringify(thisstructure));

    if (thisstructure.component.material) {
      materials = thisstructure.component.material.map((item2) => {
        if (item2.material_details) {
          material_details = item2.material_details.map((item3) => {
            if (item3.name) {
              return (
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
              );
            }
          });
          materialNames.push(material_details);
        }
        if (item2.type_of_damages) {
          damages_details = item2.type_of_damages.map((item3, index3) => {
            if (item3.name) {
              if (item3.severity_of_damage_list) {
                return (
                  <View className="mb-2 rounded-md">
                    <View className="w-full flex-row justify-start items-center mb-3">
                      <FontAwesomeIcon
                        icon="house-damage"
                        color="black"
                        size={20}
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-[18px] font-bold">
                        {index3 + 1}- {item3.name}
                      </Text>
                    </View>
                    <View className="mb-2 p-0 rounded-md justify-center items-end">
                      {item3.severity_of_damage_list.map(
                        (severityItem, severityIndex) => {
                          return (
                            <TouchableOpacity
                              style={{ elevation: 5, width: "90%" }}
                              className={`${
                                severityIndex == 0
                                  ? "bg-gray-100"
                                  : severityIndex == 1
                                  ? "bg-gray-100"
                                  : severityIndex == 2
                                  ? "bg-gray-100"
                                  : "bg-gray-100"
                              } p-3 mb-2 rounded-md flex-row`}
                            >
                              <Text
                                className={`${
                                  severityIndex == 1
                                    ? "text-black"
                                    : "text-black"
                                } font-bold leading-5 text-[16px]`}
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
                    </View>
                    <View className="mb-3">
                      <View className="mb-2">
                        <Text className="text-blue-600 text-[16px] mb-2 font-semibold">
                          Percentage Affected
                        </Text>
                        <TextInput className="bg-gray-100 rounded-md h-[35px]" />
                      </View>
                      <View className="mb-2">
                        <Text className="text-blue-600 text-[16px] mb-2 font-semibold">
                          Remarks
                        </Text>
                        <TextInput className="bg-gray-100 rounded-md h-[35px]" />
                      </View>
                      <View className="mb-2">
                        <Text className="text-blue-600 text-[16px] mb-2 font-semibold">
                          Rating of Damage
                        </Text>
                        <TextInput className="bg-gray-100 rounded-md h-[35px]" />
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
        {/* {materialNames}
        {typeOfDamageNames} */}
        {materialNames.map((thisItem, thisIndex) => {
          return (
            <View className="mb-3">
              {thisItem}
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
          style={{ backgroundColor: "rgba(0,0,0,0.4)", paddingVertical: 100 }}
        >
          <View
            className="bg-white w-11/12 rounded-lg"
            style={{}}
            activeOpacity={1}
          >
            <View className="bg-blue-600 h-[50px] rounded-t-md w-full justify-center">
              <Text className="text-white text-[22px] text-center font-bold">
                New {thisdata.project_type} Form
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
                  height: 50,
                  width: 50,
                }}
                className="flex justify-center items-center rounded-tr-md p-4 bg-red-600"
              >
                <FontAwesomeIcon icon="xmark" color="white" size={30} />
              </TouchableOpacity>
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

            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text className=""></Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
