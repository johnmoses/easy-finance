import { Dimensions, StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#307ecc',
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  titleContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    width: '98%',
  },
  buttomContainer: {
    padding: 10,
  },
  richTextContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 35,
  },
  input: {
    width: '20%',
  },
  wideInput: {
    width: '85%',
    marginLeft: '5%',
  },
  label: {
    width: '30%',
    textAlign: 'right',
    padding: 20,
  },
  shortLabel: {
    width: '20%',
    textAlign: 'right',
    padding: 20,
  },
  button: {
    backgroundColor: 'blue',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#cdcdcd',
    height: 40,
    width: '55%',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  buttonStyle: {
    fontSize: 30,
  },
  imageStyle: {
    width: windowWidth,
    height: windowWidth * 0.5
    // aspectRatio: 1 * 1.4,
  },
  videoStyle: {
    width: windowWidth,
    height: windowWidth * 0.5
  },
  titleStyle: {
    fontWeight: 'bold',
    width: 'auto',
    paddingBottom: 8,
  },
  largeImageStyle: {
    width: windowWidth,
    height: windowWidth * 0.5
  },
  largeVideoStyle: {
    width: windowWidth,
    height: windowWidth * 0.5
  },
  richTextEditorStyle: {
    width: '100%',
    height: windowWidth,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#ccaf9b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  richTextToolbarStyle: {
    width: '100%',
    backgroundColor: '#c6c3b3',
    borderColor: '#c6c3b3',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
  menu: {
    flexDirection: 'row',
    // width: '5%',
  },
  fab: {
    position: 'absolute',
    margin: 5,
    right: 0,
    bottom: 0,
  },
});
