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
import React, { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image as RNImage,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function Page() {
  const [paths, setPaths] = useState([]);
  const [color, setColor] = useState(Colors[0]);

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

  const canvasRef = useCanvasRef();

  const image = useImage(require("../assets/ATP2020/ALOR_SETAR_SELATAN-1.png"));

  const [capturedImage, setCapturedImage] = useState();

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
      <View className="h-[50px]" />
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

      <View className="bg-sky-200 flex-row justify-center items-center w-full">
        <View>
          <Text className="text-black font-semibold" style={{ width: 100 }}>
            ALOR_SETAR_SELATAN-1.png
          </Text>
          <TouchableOpacity>
            <RNImage
              source={require("../assets/ATP2020/ALOR_SETAR_SELATAN-1.png")}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-black font-semibold" style={{ width: 100 }}>
            HUTAN_KAMPUNG-1.png
          </Text>
          <TouchableOpacity>
            <RNImage
              source={require("../assets/ATP2020/HUTAN_KAMPUNG-1.png")}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-black font-semibold" style={{ width: 100 }}>
            ALOR_SETAR_UTARA-1.png
          </Text>
          <TouchableOpacity>
            <RNImage
              source={require("../assets/ATP2020/ALOR_SETAR_UTARA-1.png")}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity>
          <Text className="text-black font-semibold">
            ALOR_SETAR_UTARA-1.png
          </Text>
          <RNImage
            source={require("../assets/ATP2020/ALOR_SETAR_UTARA-1.png")}
            style={{ width: 100, height: 100 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-black font-semibold">HUTAN_KAMPUNG-1.png</Text>
          <RNImage
            source={require("../assets/ATP2020/HUTAN_KAMPUNG-1.png")}
            style={{ width: 100, height: 100 }}
          />
        </TouchableOpacity> */}
      </View>

      <Canvas
        ref={canvasRef}
        onTouch={touchHandler}
        style={{ height: "30%", width: "100%", backgroundColor: "white" }}
      >
        {image ? <Image image={image} width={500} height={400} /> : null}
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
      <TouchableOpacity
        className="bg-green-400 w-[100px] rounded-full px-5 py-2 justify-center items-center self-center mt-4"
        onPress={() => {
          const skImg = canvasRef.current?.makeImageSnapshot();
          if (skImg) {
            const base64 = skImg.encodeToBase64(ImageFormat.PNG, 100);
            setCapturedImage("data:image/png;base64," + base64);
          }
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
      <View>
        {capturedImage ? (
          <RNImage
            source={{ uri: capturedImage }}
            style={{ width: 400, height: 300 }}
          />
        ) : null}
      </View>
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
