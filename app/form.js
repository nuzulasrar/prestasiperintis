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

import { Link, router } from "expo-router";

import axios from "axios";

import { useLocalSearchParams } from "expo-router";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../configurations";

export default function Page() {
  const [image, setImage] = useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets);
      // console.log(JSON.stringify(result));
    }
  };

  const uploadImage = async () => {
    var fd = new FormData();

    image.forEach((item, index) => {
      fd.append(`files${index}`, {
        uri: item.uri,
        name: `${index}image.jpg`,
        type: "image/jpeg",
      });
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
          Project Name
        </Text>
      </View>

      <View className="bg-white w-[95%] self-center rounded-xl p-3">
        <Text className="text-black text-[20px] font-semibold">
          Upload Pictures
        </Text>

        <Button title="Pick an image from camera-roll" onPress={pickImage} />

        {image.length > 0
          ? image.map((item, index) => {
              return (
                <Image
                  source={{
                    uri: item.uri,
                  }}
                  style={{
                    width: 120,
                    height: 90,
                    marginBottom: 20,
                  }}
                />
              );
            })
          : null}

        <Button title="Upload" onPress={uploadImage} />

        <Text selectable>{JSON.stringify(image)}</Text>
      </View>

      <TouchableOpacity className="bg-white justify-center items-center self-center absolute bottom-4 right-4 rounded-[50px] h-20 w-20">
        <FontAwesomeIcon icon="plus" size={20} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}
