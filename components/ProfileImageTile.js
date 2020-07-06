import React , {useState, useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { icons } from '../Styles';
import DB from '../api/DB_API';

export default ProfileImageTile = props => {

  const source = props.imageUrl ? {uri: props.imageUrl} : icons.profilePlaceholder;

  return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => props.onClick()} >
        <Image style={styles.profileImage}
          source={source}
        />
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: 10,
  },
  profileImage: {
    borderRadius: 100,
    aspectRatio: 1, 
    height: 70,
    backgroundColor: "#aeb8c3"
  },
});
