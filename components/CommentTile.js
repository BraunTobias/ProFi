import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { icons } from '../Styles';
import DB from '../api/DB_API';

export default CommentTile = props => {

  const userId = props.userId;
  const date = props.timestamp.toDate().toLocaleDateString('de-DE');
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState(icons.profilePlaceholder);

  const colorStyle = {
    backgroundColor: props.backgroundColor
  }

  useEffect(() => {
    DB.getUserInfoById(userId, (name, imageUrl) => {
      setCurrentUserName(name);
      if (imageUrl) setCurrentUserImage({ uri: imageUrl});
      console.log(name, imageUrl);
    });
  }, []);

  return (
    <View style={[styles.itemContainer, colorStyle]}>
      <TouchableOpacity onPress={() => props.onClick(userId)} >
        <Image style={styles.profileImage}
          source={currentUserImage} 
        />
      </TouchableOpacity>
      <View style={{width: "80%", justifyContent: "center", alignItems: "flex-start", paddingStart: 15}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline"}}>            
            <Text style = {styles.title}>{currentUserName}</Text>
            <Text style = {styles.time}>{date}</Text>
          </View>
          <Text style = {styles.subtitle}>{props.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingLeft: 15,
    padding: 10,
    backgroundColor: "white",
    width: "100%",
  },
  title: {
    fontSize: 22,
    color: "#222f56",
    fontFamily: 'Inter_700Bold',
    marginBottom: 5
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  profileImage: {
    borderRadius: 100,
    aspectRatio: 1, 
    height: 70
  },
  time: {
    fontSize: 16,
    color: "#aeb8c3"
  }
});
