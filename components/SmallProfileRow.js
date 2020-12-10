import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { icons, colors, boxes, texts } from '../Styles';
import AttributeImage from "./AttributeImage";

export default SmallProfileRow = props => {

    var data = props.data;
    var plusNumber = 0;
    if (data.length > 4) {
        plusNumber = data.length - 3;
        data = data.slice(0, 3);
    }
    return(
        <View style= { boxes.smallProfileRow }>
            <FlatList 
                style={{}}
                data={data}
                horizontal={true}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) =>  
                    <ProfileImage
                        marginRight={3}
                        imageUrl={item}
                        onPress={() => {}}
                    />
                }
                ListFooterComponent={() => 
                    <View>
                        { plusNumber > 0 &&
                        <Text style={[texts.commentTileHeader, {lineHeight: 24, marginRight: 7}]}>{"+" + plusNumber}</Text>
                        }
                    </View>
                }
            />
        </View>
    );
};