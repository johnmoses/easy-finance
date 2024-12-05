import React, {useState} from 'react';
import {ActivityIndicator, Image, ImageProps, ImageStyle} from 'react-native';

interface Props extends ImageProps {
  loaderStyle: ImageStyle;
}

export const ImageWithLoader: React.FC<Props> = (props: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  const {loaderStyle, ...restProps} = props;
  return (
    <>
      {loaded ? null : (
        <ActivityIndicator
          animating={true}
          size="small"
          style={loaderStyle}
        />
      )}
      <Image onLoad={() => setLoaded(true)} {...restProps} />
    </>
  );
};
