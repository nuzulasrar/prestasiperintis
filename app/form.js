import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import axios from "axios";

import { useLocalSearchParams } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../configurations";

export default function Page() {
  const [image, setImage] = useState(null);

  const { data } = useLocalSearchParams();

  const thisdata = JSON.parse(data);

  const [bridges, setBridges] = useState([]);

  const getBridgeList = async () => {
    try {
      fetch(API_URL + "/api/bridgelist")
        .then((res) => res.json())
        .then((json) => {
          setBridges(json);
          console.log(JSON.stringify(json.thisdamage));
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBridgeList();
  }, []);

  const FormItems = ({ item, index }) => {
    let materials = [];
    let componentNames = [];

    if (item.structure.component.material) {
      materials = item.structure.component.material.map((item2) => {
        if (item2.name) {
          let thiscomponentNames = item2.name.map((item3) => {
            return (
              <View className="ml-2 mb-2">
                <View className="flex-row items-center p-2 bg-emerald-400 rounded-lg mb-2">
                  <FontAwesomeIcon
                    icon="fa-regular fa-square"
                    color="black"
                    size={25}
                  />
                  <Text className="ml-2 text-[20px] font-semibold">
                    {item3}
                  </Text>
                </View>
                {item2.type_of_damage.map((item4) => {
                  let filteredData = bridges.thisdamage.filter(
                    (thisitem) => item4 == thisitem.code
                  );
                  return (
                    <View className="mb-2">
                      <View className="bg-sky-300 p-2 rounded-lg mb-2">
                        <Text className="ml-2 text-[20px] font-semibold">
                          Code: {filteredData[0].code} - {filteredData[0].name}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-bold text-[18px] mb-1">
                          Light
                        </Text>
                        <Text className="font-bold text-[18px] mb-1">
                          Medium
                        </Text>
                        <Text className="font-bold text-[18px] mb-1">
                          Severe
                        </Text>
                        <Text className="font-bold text-[18px] mb-1">
                          V.Severe
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          });

          componentNames.push(thiscomponentNames);
        }
      });
    }

    return (
      <View>
        <Text className="text-black font-bold text-[20px] mb-2">
          {item.structure.component.name}
        </Text>
        {componentNames}
      </View>
    );
  };

  // const Form = (thisdata) => {
  //     return (

  //         <View>
  //             {
  //                 thisdata.data.map((item) => {
  //                     return (
  //                         <View>
  //                             <Text className="text-black font-bold text-[20px] mb-2">
  //                                 {item.structure.component.name}
  //                                 {/* {typeof item.id} */}
  //                             </Text>
  //                             {/* {item.structure.material.map((item2) => {
  //                                 return (
  //                                     <Text className="text-black font-bold text-[20px] mb-2">
  //                                         {item2.name}
  //                                     </Text>
  //                                 )
  //                             })} */}
  //                         </View>
  //                     )
  //                 })
  //             }
  //         </View>
  //     )
  // }

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

    fetch(API_URL +"/api/upload", {
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
        <Text className="text-white text-[20px] font-semibold">Projects</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-transparent flex-row justify-start items-center pl-[15px] h-[50px] w-[100px]"
        >
          <FontAwesomeIcon icon="arrow-left" size={25} color="transparent" />
        </TouchableOpacity>
      </View>
      <View className="px-3 mb-4">
        <Text className="text-[20px] text-black font-semibold">
          Project Name: {thisdata.project_name}
          {/* {JSON.stringify(bridges)} */}
        </Text>
      </View>

      <View className="bg-white w-[95%] self-center rounded-xl p-3">
        <FlatList
          data={bridges.bridgelist}
          renderItem={({ item, index }) => (
            <FormItems item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
        />

        <Text className="text-black text-[20px] font-semibold">
          Upload Pictures
        </Text>

        <Button title="Pick an image from camera-roll" onPress={pickImage} />

        {image ? (
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: 200,
              height: 150,
            }}
          />
        ) : null}

        <Button title="Upload" onPress={uploadImage} />

        {/* <Text>{JSON.stringify(image)}</Text> */}
      </View>

      <TouchableOpacity className="bg-white justify-center items-center self-center absolute bottom-4 right-4 rounded-[50px] h-20 w-20">
        <FontAwesomeIcon icon="plus" size={20} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}
