import React, {useState} from 'react';
import {
  Dimensions,
  ImageSourcePropType,
  ImageStyle,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ImageWithLoader } from './ImageWithLoader';

interface IProps {
    source: ImageSourcePropType;
    containerStyle?: ViewStyle;
    imageStyle?: ImageStyle;
}

const {height, width} = Dimensions.get('window');

export const ChatUserImage: React.FC<IProps> = ({source, containerStyle, imageStyle}: IProps) => {
  const [isModalsVisible, setModalVisible] = useState<boolean>(false);

  return (
    <View style={[containerStyle]}>
      {isModalsVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalsVisible}>
          <TouchableOpacity
            style={[styles.modalContainer]}
            activeOpacity={1.0}
            onPress={() => {
              setModalVisible(false);
            }}>
            <View>
              <ImageWithLoader
                source={source}
                style={styles.modalStyle}
                loaderStyle={styles.modalImageStyle}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : null}
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <ImageWithLoader
          source={source}
          style={imageStyle}
          loaderStyle={styles.imageStyle}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  modalImageStyle: {
    position: 'absolute',
    top: 105,
    left: 105,
  },
  imageStyle: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  modalStyle: {
    width: 250,
    height: 250,
    borderRadius: 0,
  },
});
