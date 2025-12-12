import { useDispatch, useSelector } from "react-redux";
import { View, Text, Image, Switch } from "react-native";
import { setDarkMode } from "../../store/userSlice";

export default function ProfileScreen() {
  const profile = useSelector((state: any) => state.user.profile);
  const dispatch = useDispatch();

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image
        source={{ uri: profile.avatarUrl || "https://via.placeholder.com/150" }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 22, fontWeight: "600" }}>{profile.name}</Text>
      <Text style={{ color: "gray" }}>{profile.email}</Text>
      <Text style={{ marginTop: 20 }}>Dark Mode</Text>
      <Switch
        value={profile.darkMode}
        onValueChange={() => {
          dispatch(setDarkMode(!profile.darkMode));
        }}
      />
    </View>
  );
}
