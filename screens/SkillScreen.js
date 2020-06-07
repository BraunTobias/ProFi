/*This is an Example to Hide/Show View  Component in React Native on button Click*/
import React, { Component } from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      show: true,
    };
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  render() {
    return (
      /* Fähigkeiten-Header */
      <View style={{justifyContent: 'center', flexDirection: 'row', backgroundColor: 'tomato'}}>
        
        {/*Here we will return the view when state is true 
        and will return false if state is false*/}
        {this.state.show ? (
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
            }}
            style={{ width: 100, height: 100 }}
          />
        ) : null}
        <Button title="Hide/Show Component" onPress={this.ShowHideComponent} />
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
});