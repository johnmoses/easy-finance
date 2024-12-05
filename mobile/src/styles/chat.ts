import { Dimensions, StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#307ecc',
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 6,
  },
  contentContainer: {
    flex: 17,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  titleContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  lastMessageContainer: {
    flex: 1,
    paddingTop: 2,
  },
  notificationDotContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  topContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImageContainer: {
    flex: 3,
  },
  textContainer: {
    flex: 17,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  textContainer1: {
    flex: 9,
  },
  inputContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topContentData: {
    flexDirection: 'row-reverse',
    flex: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  flipContentContainer: {
    flexDirection: 'row-reverse',
    flex: 1,
    alignItems: 'center',
  },
  flipContentData: {
    flexDirection: 'row',
    flex: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  textStyle: {
    fontWeight: 'bold',
    width: 100,
  },
  userNameStyle: {
    fontWeight: 'bold',
    width: 100,
  },
  imageStyle: {
    // width: '90%',
    // height: '80%',
    width: windowWidth * 0.6,
    height: windowWidth * 0.4,
    // aspectRatio: 1 * 1,
    // padding: 2,
  },
  videoStyle: {
    // width: '90%',
    // height: '80%',
    width: windowWidth * 0.6,
    height: windowWidth * 0.4,
    // aspectRatio: 1 * 1,
    // padding: 2,
  },
  messageTextStyle: {
    fontSize: 15,
    paddingLeft: 5,
  },
  menu: {
    margin: 30,
  },
});
