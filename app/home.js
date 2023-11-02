import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Link, router } from "expo-router";

import axios from "axios";

import { useLocalSearchParams } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { API_URL } from "../configurations";

export default function Page() {
  const { id, name } = useLocalSearchParams();

  const { width } = useWindowDimensions();

  // const projects = [
  //     { id: 1, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  //     { id: 2, name: "Toll Plaza" },
  // ]

  const [projects, setProjects] = useState([]);

  const getProjectList = async () => {
    fetch(API_URL + "/api/project")
      .then((res) => res.json())
      .then((json) => {
        setProjects(json);
        // alert(JSON.stringify(json))
      })
      .catch((error) => {
        console.log(error);
        alert(JSON.stringify(error.message));
      });
  };

  useEffect(() => {
    getProjectList();
  }, []);

  const ProjectItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        // href={{
        //     pathname: "/project",
        //     params: { data: JSON.stringify(item) }
        // }}
        onPress={() => {
          router.push({
            pathname: "/project",
            params: { data: JSON.stringify(item) },
          });
        }}
        className="bg-white w-11/12 self-center px-3 py-5 mb-3 flex-row justify-between items-center rounded-[8px]"
      >
        <View className="">
          <Text className="text-black font-bold text-[16px] mb-2">
            Project Name: {item.project_name}
          </Text>
          <Text className="text-black text-[16px] mb-2 font-bold">
            {" "}
            Type: {item.project_type}
          </Text>
          <Text className="text-black text-[16px]">
            {" "}
            Year: {item.project_name}
          </Text>
          <Text className="text-black text-[16px]">
            {" "}
            Highway: {item.project_name}
          </Text>
          <Text className="text-black text-[16px]">
            {" "}
            Highway Code: {item.project_name}
          </Text>
        </View>
        <View className="">
          {/* <FontAwesomeIcon icon="chevron-right" size={25} /> */}
          <View className="bg-blue-700 px-4 py-[5px] rounded-full flex-row">
            <Text className="text-white text-[18px]">View</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // <Text>Blog post: {id + " " + name}</Text>

    <View className="flex-1 justify-center bg-gray-200">
      <View className="h-[50px]" />
      <View className="bg-blue-700 w-full h-[50px] flex-row justify-between items-center">
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

      <View className="w-11/12 self-center mb-5">
        {/* <Text className="text-black">{JSON.stringify(projects)}</Text> */}
        <View className="flex-row justify-between items-center w-full">
          <TextInput
            className="bg-white w-9/12 mt-6 mb-6 h-[50px] text-black pl-5 rounded-l-full"
            placeholder="Search Project"
            placeholderTextColor={"black"}
          />
          <TouchableOpacity className="bg-green-600 w-3/12 my-4 h-[50px] justify-center rounded-r-full">
            <Text className="text-white text-center font-semibold text-[17px]">
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <Text className="text-black uppercase font-bold text-[21px] ml-5 mb-4">List of Projects</Text> */}
      {/* <ScrollView className="w-11/12">

            </ScrollView> */}
      {/* <Text className="text-black">{JSON.stringify(projects)}</Text> */}
      <FlatList
        data={projects}
        renderItem={({ item, index }) => (
          <ProjectItems item={item} index={index} />
        )}
      />
    </View>
  );
}
