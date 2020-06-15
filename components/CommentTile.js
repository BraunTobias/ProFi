import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import {Ionicons} from '@expo/vector-icons';
import DB from '../api/DB_API';

export default CommentTile = props => {

  const userId = props.userId;
  const date = props.timestamp.toDate().toLocaleDateString('de-DE');
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImageUrl, setCurrentUserImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/teamfinder-be2e3.appspot.com/o/images%2Fempty.png?alt=media&token=454a1213-54e0-4402-a5e9-9cfa98901980");

  const colorStyle = {
    backgroundColor: props.backgroundColor
  }

  useEffect(() => {
    DB.getUserInfoById(userId, (name, imageUrl) => {
      setCurrentUserName(name);
      setCurrentUserImageUrl(imageUrl);
      console.log(name, imageUrl);
    });
  }, []);

  return (
    <View style={[styles.itemContainer, colorStyle]}>
      <TouchableOpacity onPress={() => props.onClick(userId)} >
        <Image style={styles.profileImage}
          source={{ uri: currentUserImageUrl}} 
        />
      </TouchableOpacity>
      <View style={{width: "80%", justifyContent: "center", alignItems: "flex-start", paddingStart: 15}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline"}}>            
            <Text style = {styles.title}> {currentUserName} </Text>
            <Text style = {styles.time}> {date} </Text>
          </View>
          <Text style = {styles.subtitle}> {props.subtitle} </Text>
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
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
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
