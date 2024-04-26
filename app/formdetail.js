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
  Keyboard,
  Alert,
  StyleSheet,
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
  const { form } = useLocalSearchParams();
  const parsed = decodeURIComponent(form);
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
          Form Details - Edit Information
        </Text>
        <TouchableOpacity
          //   onPress={() => router.back()}
          className="bg-transparent flex-row justify-start items-center pl-[15px] h-[50px] w-[100px]"
        >
          <FontAwesomeIcon icon="arrow-left" size={25} color="transparent" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center- items-center">
        {/* <Text>{parsed}</Text> */}
        <FlatList
          data={JSON.parse(parsed)}
          renderItem={({ item, index }) => {
            return (
              <View>
                {/* <Text className="mb-8">{JSON.stringify(item)}</Text> */}
                <View className="bg-yellow-400 p-2 flex-row justify-start items-center mb-4">
                  <FontAwesomeIcon
                    icon="truck-loading"
                    color="black"
                    size={20}
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-black font-bold text-[20px]">
                    {item.component_details.name}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default Formdetail;

const styles = StyleSheet.create({});
