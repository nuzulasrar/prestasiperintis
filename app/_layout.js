import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
      screenOptions={{
        // headerStyle: {
        //     backgroundColor: '#000',
        // },
        // headerTintColor: '#fff',
        // headerTitleStyle: {
        //     fontWeight: 'bold',
        // },
        headerShown: false,
      }}
    >
      {/* Optionally configure static options outside the route. */}
      <Stack.Screen
        name="home"
        options={
          {
            // headerStyle: {
            //     backgroundColor: '#fff000',
            // },
          }
        }
      />
      <Stack.Screen
        name="about"
        options={{
          headerStyle: {
            backgroundColor: "red",
          },
        }}
      />
      <Stack.Screen name="form" />
    </Stack>
  );
}
