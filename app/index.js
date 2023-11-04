import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";

import { Link, router } from "expo-router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons/faSquareCheck";
import { faTruckLoading } from "@fortawesome/free-solid-svg-icons/faTruckLoading";
import { faHouseDamage } from "@fortawesome/free-solid-svg-icons/faHouseDamage";

import NetInfo from "@react-native-community/netinfo";

library.add(
  fab,
  faPlus,
  faSquare,
  faArrowLeft,
  faChevronRight,
  faRightToBracket,
  faXmark,
  faArrowsRotate,
  faSquare,
  faSquareCheck,
  faTruckLoading,
  faHouseDamage
);

export default function Page() {
  const [online, setOnline] = useState(true);

  const unsubscribe = NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
      alert("offline");
    }

    // alert('Connection type ' + state.type);
    // alert('Is connected? ' + state.isConnected);
  });

  // useEffect(() => {

  //     if(!netinfoData.isConnected){

  //     }

  // }, [netinfoData])

  return (
    // <View>
    //     <Link href="/about" className="">About</Link>

    //     <Link href="/user/bacon">View user</Link>
    // </View>
    <View className="flex-1 justify-center items-center">
      {!online ? (
        <View>
          <Text className="bg-red-600">Offline</Text>
        </View>
      ) : null}
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 150, height: 150 }}
        className="mb-[50px]"
      />

      <Text className="mb-[50px] text-[20px] font-bold text-center mx-[50px]">
        Prestasi Perintis Plaza And Bridge Checklist
      </Text>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/home",
            params: { id: "bacon", name: "Ahmad" },
          })
        }
        className="p-2 bg-emerald-600 w-1/2 rounded-full justify-center items-center "
      >
        <Text className="text-white font-semibold text-[24px] text-center">
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/draw",
          })
        }
        className="p-2 bg-emerald-600 w-1/2 rounded-full justify-center items-center "
      >
        <Text className="text-white font-semibold text-[24px] text-center">
          Draw
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => router.push({
                pathname: "/about",
                params: { id: 'bacon', name: "Ahmad" }
            })} className="p-2 bg-emerald-600 w-1/2 rounded-full justify-center items-center text-white font-bold text-[24px] text-center">
                <Text className="text-white font-bold text-[24px] text-center">About</Text>
            </TouchableOpacity> */}
    </View>
  );
}
