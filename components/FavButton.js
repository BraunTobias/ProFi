import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { icons } from '../Styles';

export default FavButton = props => {
  
  return (
      <TouchableOpacity
        style={[styles.itemContainer, {backgroundColor: props.backgroundColor}]}
        onPress={props.onClick}
      >
        <Image 
          style= { { width: 33, height: 33, tintColor: props.iconColor} }
          source= { icons.fav }
          resizeMode= { "contain" }
        />
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 10,
    color: "white",
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});
