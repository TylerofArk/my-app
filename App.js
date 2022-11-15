import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { NativeBaseProvider, Text, Heading, extendTheme, } from "native-base";


export default class App extends React.Component {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps,
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result),
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };


  render() {
    return (
			<NativeBaseProvider>
       <View style={styles.container}>
			  <SafeAreaView>
				  <Heading>Steppy</Heading>
				  <Text fontSize="2xl">The no frills pedometer</Text>
          <Text>Steps taken in the last 24 hours: {this.state.pastStepCount}</Text>
          <Text>Step count for this session: {this.state.currentStepCount}</Text>
			  </SafeAreaView>
       </View>
			</NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({ 
container: {
	flex: 1,
	backgroundColor: '#67e8f9',
	alignItems: 'center',
	justifyContent: 'center',
},
Heading: {
	margin: 500,
},
Text: {
	padding: 100,
}

}); 