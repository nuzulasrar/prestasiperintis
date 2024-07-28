import {
  Canvas,
  Path,
  SkPath,
  Skia,
  TouchInfo,
  Image,
  useImage,
  useTouchHandler,
  useCanvasRef,
  ImageFormat,
} from "@shopify/react-native-skia";
import React, { useCallback, useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image as RNImage,
  ScrollView,
  PanResponder,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FlatList } from "react-native-gesture-handler";

import { Camera, CameraType, CameraReadyListener } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default function Draw({
  saveimage,
  takeImage,
  galleryImage,
  projectType,
}) {
  const { width, height } = useWindowDimensions();

  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedByCamera, setCapturedByCamera] = useState([]);

  useEffect(() => {
    console.log(permission);
    if (!permission?.granted) {
      Camera.requestCameraPermissionsAsync().then((e) => console.log(e));
    }
  }, [permission]);

  const takePicture = async () => {
    if (camera) {
      try {
        const options = { quality: 1, base64: true }; // Adjust options as needed
        const result = await camera.takePictureAsync(options);
        const uri = result.uri;
        console.log("Picture saved to cache:", uri);
        // You can now access the image data using the uri
        takeImage && takeImage(uri);
        // setEditorMode(5);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const [history, setHistory] = useState([]);
  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState(Colors[0]);

  const [imageHeightWidth, setImageHeightWidth] = useState(500);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const [strokeWidth, setStrokeWidth] = useState(strokes[0]);

  const undo = () => {
    if (history.length > 0) {
      setPaths(history[history.length - 1]); // Revert to the last saved paths
      setHistory(history.slice(0, history.length - 1)); // Remove the last saved paths from history
    }
  };

  const onDrawingStart = useCallback(
    (touchInfo) => {
      setHistory([...history, paths]);
      setPaths((currentPaths) => {
        const { x, y } = touchInfo;
        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        return [
          ...currentPaths,
          {
            path: newPath,
            color,
            strokeWidth,
          },
        ];
      });
      // console.log("start");
    },
    [color, strokeWidth, paths, history]
  );

  const onDrawingActive = useCallback((touchInfo) => {
    setPaths((currentPaths) => {
      const { x, y } = touchInfo;
      const currentPath = currentPaths[currentPaths.length - 1];
      const lastPoint = currentPath.path.getLastPt();
      const xMid = (lastPoint.x + x) / 2;
      const yMid = (lastPoint.y + y) / 2;

      currentPath.path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
      return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
    });
    // console.log("active");
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const [editorMode, setEditorMode] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const ATP2020 = [
    require("../assets/ATP2020/ALOR_SETAR_SELATAN-1.png"),
    require("../assets/ATP2020/ALOR_SETAR_UTARA-1.png"),
    require("../assets/ATP2020/HUTAN_KAMPUNG-1.png"),
    require("../assets/ATP2020/IPOH_UTARA-1.png"),
    require("../assets/ATP2020/IPOH_UTARA-2.png"),
    require("../assets/ATP2020/JURU-1.png"),
    require("../assets/ATP2020/KLIA-1.png"),
    require("../assets/ATP2020/KLIA-2.png"),
    require("../assets/ATP2020/LEMBAH_BERINGIN-1.png"),
    require("../assets/ATP2020/PEDAS_LINGGI-1.png"),
    require("../assets/ATP2020/PENANG_BRIDGE-1.png"),
    require("../assets/ATP2020/PENANG_BRIDGE-2.png"),
    require("../assets/ATP2020/PENDANG-1.png"),
    require("../assets/ATP2020/PERLING-1.png"),
    require("../assets/ATP2020/PUTRA_MAHKOTA-1.png"),
    require("../assets/ATP2020/SENAWANG-1.png"),
    require("../assets/ATP2020/SG_BULOH-1.png"),
    require("../assets/ATP2020/SG_DUA-1.png"),
    require("../assets/ATP2020/SG_DUA-2.png"),
    require("../assets/ATP2020/SKUDAI-1.png"),
    require("../assets/ATP2020/SKUDAI-2.png"),
    require("../assets/ATP2020/SUBANG-1.png"),
    require("../assets/ATP2020/SUBANG-2.png"),
    require("../assets/ATP2020/SUBANG-3.png"),
    require("../assets/ATP2020/TANGKAK-1.png"),
    require("../assets/ATP2020/TANJUNG_MALIM-1.png"),
    require("../assets/ATP2020/YONG_PENG_UTARA-1.png"),
  ];
  const BRIDGE_TYPICAL_DRAWING = [
    require("../assets/BRIDGE_TYPICAL_DRAWING/1_ABUTMENT1.jpg"),
    require("../assets/BRIDGE_TYPICAL_DRAWING/2_TYPICAL_MID_SECTION.jpg"),
    require("../assets/BRIDGE_TYPICAL_DRAWING/3_ABUTMENT2.jpg"),
    require("../assets/BRIDGE_TYPICAL_DRAWING/4_TYPICAL_PLAN_VIEW.jpg"),
    require("../assets/BRIDGE_TYPICAL_DRAWING/5_PLAIN_LAYOUT.jpg"),
  ];

  function Gallery1({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedImage(index);
          setEditorMode(3);
        }}
      >
        <RNImage
          source={item}
          style={{ width: width / 2 - 20, height: width / 2 - 20, margin: 5 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  const canvasRef = useCanvasRef();

  const [capturedImage, setCapturedImage] = useState();

  const image = useImage(
    projectType === "Toll"
      ? ATP2020[selectedImage]
      : BRIDGE_TYPICAL_DRAWING[selectedImage]
  );

  useEffect(() => {
    if (capturedImage) {
      saveimage && saveimage(capturedImage);
    }
  }, [capturedImage]);

  const [galleryImages, setGalleryImages] = useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("pickimage result", result);

    if (!result.canceled) {
      galleryImage && galleryImage(result.assets);
      // setGalleryImages(result.assets);
      // console.log(JSON.stringify(result));
    }
  };

  // useEffect(() => {
  //   if (galleryImages) {
  //     galleryImage && galleryImage(galleryImages);
  //   }
  // }, [galleryImages]);

  return (
    <View style={style.container} className="bg-gray-300">
      <View className="h-[10px]" />
      {editorMode === 1 ? (
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            onPress={() => {
              setEditorMode(2);
            }}
            className="flex-row justify-center items-center
          bg-blue-600 px-4 py-3 rounded-full mb-3
          "
          >
            <FontAwesomeIcon
              icon={"paintbrush"}
              color={"white"}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[20px]">
              Add new drawing on a sample image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditorMode(4);
            }}
            className="flex-row justify-center items-center
          bg-emerald-600 px-4 py-3 rounded-full mb-3
          "
          >
            <FontAwesomeIcon
              icon={"fa-camera"}
              color={"white"}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[20px]">
              Take Picture using Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // setEditorMode(4);
              pickImage();
            }}
            className="flex-row justify-center items-center
          bg-red-600 px-4 py-3 rounded-full mb-3
          "
          >
            <FontAwesomeIcon
              icon={"fa-images"}
              color={"white"}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[20px]">
              Pick a photo from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      ) : editorMode === 2 ? (
        <View className="flex-1 justify-center items-center">
          <View className="w-full flex-row justify-around items-center mb-2">
            <Text className="text-black text-[20px]">
              Pick one template image
            </Text>
            <TouchableOpacity
              onPress={() => setEditorMode(1)}
              className="bg-red-900 rounded-full px-5 py-2 flex-row justify-center items-center"
            >
              <FontAwesomeIcon icon="xmark" color="white" />
              <Text className="text-white text-[20px] ml-2">Cancel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            numColumns={2}
            data={projectType === "Toll" ? ATP2020 : BRIDGE_TYPICAL_DRAWING}
            renderItem={({ item, index }) => (
              <Gallery1 item={item} index={index} />
            )}
          />
        </View>
      ) : editorMode === 4 ? (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={type} ref={(ref) => setCamera(ref)}>
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  width: 50,
                  height: 50,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                  marginTop: 450,
                }}
                // onPress={toggleCameraType}
                onPress={takePicture}
              >
                <FontAwesomeIcon icon={faCamera} color="black" size={25} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : editorMode === 3 ? (
        <>
          <View className="flex-row justify-around items-center z-50">
            <Toolbar
              color={color}
              strokeWidth={strokeWidth}
              setColor={setColor}
              setStrokeWidth={setStrokeWidth}
              undo={undo}
            />
            <View className="flex-row">
              <TouchableOpacity
                className="self-center flex-row justify-center items-center rounded-l-lg bg-yellow-400 px-2 py-2"
                onPress={() => {
                  // setPaths([]);
                  setPaths(oldPaths);
                }}
              >
                <FontAwesomeIcon icon="arrows-rotate" size={14} color="black" />
                <Text className="text-black ml-2 text-[14px]">
                  Reset Drawing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditorMode(1)}
                className="bg-red-900  rounded-r-lg px-5 py-2 flex-row justify-center items-center"
              >
                <FontAwesomeIcon icon="xmark" color="white" />
                <Text className="text-white text-[14px] ml-2">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-[10px]" />
          <Canvas
            ref={canvasRef}
            onTouch={touchHandler}
            style={{
              height: "70%",
              width: "100%",
              backgroundColor: "transparent",
              transform: [{ scale: canvasScale }],
              marginHorizontal: canvasX,
              marginVertical: canvasY,
            }}
          >
            {image ? (
              <Image
                image={image}
                fit="contain"
                x={10}
                y={0}
                width={imageHeightWidth}
                height={imageHeightWidth}
              />
            ) : null}
            {paths.map((path, index) => (
              <Path
                key={index}
                path={path.path}
                color={path.color}
                style={"stroke"}
                strokeWidth={path.strokeWidth}
              />
            ))}
          </Canvas>
          <View
            className="bg-white mt-2 flex-row justify-around items-center py-2 rounded-lg absolute"
            style={{
              bottom: 40,
              width: "100%",
              left: 0,
              right: 0,
              alignSelf: "center",
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
            <TouchableOpacity
              className="bg-green-600 w-[100px] rounded-full border-none px-5 py-2 justify-center items-center self-center"
              onPress={() => {
                const skImg = canvasRef.current?.makeImageSnapshot();
                if (skImg) {
                  const base64 = skImg.encodeToBase64(ImageFormat.PNG, 100);
                  setCapturedImage("data:image/png;base64," + base64);
                }
              }}
            >
              <Text className="text-white">SAVE</Text>
            </TouchableOpacity>
          </View>
          {/* <View>
            {capturedImage ? (
              <RNImage
                source={{ uri: capturedImage }}
                style={{ width: 400, height: 300 }}
              />
            ) : null}
          </View> */}
        </>
      ) : editorMode === 5 ? (
        <View className="flex-1">
          <Text className="mb-4">Captured Image here</Text>
          <FlatList
            data={capturedByCamera}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity>
                  <RNImage
                    source={{ uri: item }}
                    style={{ width: 100, height: 100 }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const Colors = ["black", "red", "blue", "green", "yellow", "white"];

const strokes = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];

const Toolbar = ({ color, strokeWidth, setColor, setStrokeWidth, undo }) => {
  const [showStrokes, setShowStrokes] = useState(false);

  const handleStrokeWidthChange = (stroke) => {
    setStrokeWidth(stroke);
    setShowStrokes(false);
  };

  const handleChangeColor = (color) => {
    setColor(color);
  };

  return (
    <>
      {showStrokes && (
        <View style={[style.toolbar, style.strokeToolbar]}>
          {strokes.map((stroke) => (
            <Pressable
              onPress={() => handleStrokeWidthChange(stroke)}
              key={stroke}
            >
              <Text style={style.strokeOption}>{stroke}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={[style.toolbar]}>
        <Pressable
          style={style.currentStroke}
          onPress={() => setShowStrokes(!showStrokes)}
        >
          <Text>{strokeWidth}</Text>
        </Pressable>
        <View style={style.separator} />
        {Colors.map((item) => (
          <ColorButton
            isSelected={item === color}
            key={item}
            color={item}
            onPress={() => handleChangeColor(item)}
          />
        ))}
        <TouchableOpacity onPress={undo} style={style.undoButton}>
          <Text>Undo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ColorButton = ({ color, onPress, isSelected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        style.colorButton,
        { backgroundColor: color },
        isSelected && {
          borderWidth: 2,
          borderColor: "black",
        },
      ]}
    />
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  strokeOption: {
    fontSize: 18,
    backgroundColor: "#f7f7f7",
  },
  toolbar: {
    backgroundColor: "#ffffff",
    height: 45,
    // width: 275,
    borderRadius: 100,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  separator: {
    height: 30,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  currentStroke: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
  },
  strokeToolbar: {
    position: "absolute",
    top: 70,
    justifyContent: "space-between",
    zIndex: 100,
  },
  colorButton: {
    width: 25,
    height: 25,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  undoButton: {
    marginLeft: 10,
  },
});
