import { Dimensions, StyleSheet } from "react-native";

const { fontScale } = Dimensions.get('window');
const getFontSize = (size: number) => size / fontScale;
const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '98%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: getFontSize(24),
  },
  subHeaderText: {
    fontSize: getFontSize(14),
  },
  errorText: {
    fontSize: getFontSize(12),
    color: 'red',
  },
  sectionContainer: {
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    marginVertical: 4,
    borderColor: '#dadae8',
  },
  button: {
    backgroundColor: 'blue',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#cdcdcd',
    height: 40,
    width: '60%',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: getFontSize(12),
  },
  switchAction: {
    paddingHorizontal: 4,
    color: 'blue',
  },
  imageStyle: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.5,
    margin: 5,
    // aspectRatio: 1 * 1.4,
  },
});
