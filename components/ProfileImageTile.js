import React  from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { icons } from '../Styles';

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
    backgroundColor: "#aeb8c3",
    marginTop: 15, 
  },
});
