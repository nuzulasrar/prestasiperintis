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
import React, { useCallback, useState, useRef } from "react";
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

export default function Draw() {
  const { width, height } = useWindowDimensions();

  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState(Colors[0]);

  const [imageHeightWidth, setImageHeightWidth] = useState(500);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const [strokeWidth, setStrokeWidth] = useState(strokes[0]);

  const onDrawingStart = useCallback(
    (touchInfo) => {
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
    },
    [color, strokeWidth]
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
        />
      </TouchableOpacity>
    );
  }

  const canvasRef = useCanvasRef();

  const [capturedImage, setCapturedImage] = useState();

  const image = useImage(ATP2020[selectedImage]);

  const images = [
    {
      name: "ALOR_SETAR_SELATAN-1.png",
    },
    {
      name: "ALOR_SETAR_UTARA-1.png",
    },
  ];

  return (
    <View style={style.container} className="bg-gray-400">
      <View className="h-[10px]" />
      {editorMode === 1 ? (
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity
            onPress={() => {
              setEditorMode(2);
            }}
            className="flex-row justify-center items-center
          bg-blue-600 px-4 py-3 rounded-full
          "
          >
            <FontAwesomeIcon
              icon={"plus"}
              color={"white"}
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-[20px]">
              Add new drawing on a sample image
            </Text>
          </TouchableOpacity>
        </View>
      ) : editorMode === 2 ? (
        <View className="flex-1 justify-center items-center">
          <FlatList
            numColumns={2}
            data={ATP2020}
            renderItem={({ item, index }) => (
              <Gallery1 item={item} index={index} />
            )}
          />
        </View>
      ) : (
        <>
          <View className="flex-row justify-center items-center">
            <Toolbar
              color={color}
              strokeWidth={strokeWidth}
              setColor={setColor}
              setStrokeWidth={setStrokeWidth}
            />
            <TouchableOpacity
              className="self-center flex-row justify-center items-center m-3 rounded-full bg-yellow-400 px-5 py-2"
              onPress={() => {
                setPaths([]);
              }}
            >
              <FontAwesomeIcon icon="arrows-rotate" size={20} color="black" />
              <Text className="text-black ml-2 text-[20px]">Reset Drawing</Text>
            </TouchableOpacity>
          </View>

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
          <View>
            {capturedImage ? (
              <RNImage
                source={{ uri: capturedImage }}
                style={{ width: 400, height: 300 }}
              />
            ) : null}
          </View>
        </>
      )}
    </View>
  );
}

const Colors = ["black", "red", "blue", "green", "yellow", "white"];

const strokes = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const Toolbar = ({ color, strokeWidth, setColor, setStrokeWidth }) => {
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
    height: 50,
    width: 300,
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
    width: 30,
    height: 30,
    borderRadius: 100,
    marginHorizontal: 5,
  },
});
