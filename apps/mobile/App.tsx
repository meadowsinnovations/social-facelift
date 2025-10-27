import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Social Facelift Mobile</Text>
      <Text style={styles.caption}>
        This is the Expo mobile client running as part of the Turborepo workspace.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  caption: {
    marginTop: 12,
    textAlign: 'center'
  }
});
