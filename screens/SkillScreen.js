/*This is an Example to Hide/Show View  Component in React Native on button Click*/
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Icon } from 'react-native';
import { Button } from 'react-native-elements';
import CheckboxList from "rn-checkbox-list";
import { Text, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const data = [
  { id: 1, name: 'HTML' },
  { id: 2, name: 'Java' },
  { id: 3, name: 'C ++' },
  { id: 4, name: 'JavaScript' },
  { id: 5, name: 'Python' },
  { id: 6, name: 'Unity (C#)' },
  { id: 7, name: 'CSS' },
  { id: 8, name: 'Android Programmierung' },
  { id: 9, name: 'IOS Programmierung' },
  { id: 10, name: 'FireBase' },
  { id: 11, name: 'SQL' }
];

export default class SkillScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      loader: true,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loader: false }), 500); 
  }

//   ShowIcons = () => {
//       return (
//         /* Fähigkeiten-Header */
//         <View style={{justifyContent: 'center', flexDirection: 'row', backgroundColor: 'white'}}>
//             {/* Programmierung */}
//                 <Icon 
//                     class="toggle"
//                     raised
//                     name={"ios-desktop"} 
//                     size={35} 
//                     type="ionicon"
//                     color={"tomato"} 
//                 />
//         </View>
//       )
//   }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  render() {
    return (
      <View style={{flexDirection: 'column'}}> 
        {/* Buttons */}
        <React.Fragment>
            <View style={{marginLeft: 10, marginRight: 10, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button 
                    title="Programmierung" 
                    onPress={this.ShowHideComponent}
                    icon={{name: 'cached', color: 'white'}}
                 />
                <Button title="Design" onPress={this.ShowHideComponent} color="tomato" />
                <Button title="Sozial" onPress={this.ShowHideComponent} color="tomato" />
                <Button title="Sonstiges" onPress={this.ShowHideComponent} color="tomato"/>
            </View>
        </React.Fragment>
        {/* Text unter den Buttons */}
        <React.Fragment>
            <View style={{marginLeft: 10, marginRight: 10, marginTop: 10, backgroundColor: 'tomato'}}>
                <Text style={{marginLeft: 5, fontSize: 28, fontWeight: 'bold', color: 'white' }}>Programmierung</Text>
            </View>
        </React.Fragment>
        {/*Here we will return the view when state is true 
        and will return false if state is false*/}
        <React.Fragment>
            <View style={{marginLeft: 10, marginRight: 10, marginBottom: 225, marginTop: 10, justifyContent: 'center', flexDirection: 'row', backgroundColor: 'white'}}>
                {this.state.show ? (
                <CheckboxList
                    // headerName="Programmierung"
                    theme="tomato"
                    listItems={this.state.loader ? [] : data}
                    onChange={(data) => console.log("My updated list :: ", data)}
                    onLoading={() => (
                    <View style={{ marginTop: 80, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="tomato" />
                        <Text style={{ marginTop: 20, fontSize: 20, color: 'tomato'}}>Lädt....</Text>
                    </View>
                    )}
                    listItemStyle={{ borderBottomColor: '#eee', borderBottomWidth: 1 }}
                />
                ) : null}
                </View>
        </React.Fragment>
        {/* <Button title="Programmierung" onPress={this.ShowHideComponent} />
        <Button title="Design" onPress={this.ShowHideComponent} />
        <Button title="Sozial" onPress={this.ShowHideComponent} />
        <Button title="Sonstiges" onPress={this.ShowHideComponent} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 10,
    },
    item: {
        marginTop: 24,
        padding: 30,
        backgroundColor: 'tomato',
        color: 'white',
        fontSize: 24,
        marginHorizontal: 10
    }
});

// export default SkillScreen;