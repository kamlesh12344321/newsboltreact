import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {AppContext} from '../Context';
import CommonStyle from '../Theme/CommonStyle';
import {width} from '../Utils/Constant';
import {VolumeButton} from './AppButton';

const styles = StyleSheet.create({
  videoView: {
    width,
    opacity: 1,
  },
  videoOuter: {
    width,
    ...CommonStyle.center,
  },
});

const VideoComponent = ({item, isVisible, isNext}) => {
  const {displayHeight} = useContext(AppContext);
  const {isMute} = useContext(AppContext);
  const videoRef = useRef(null);
  const {videoOuter, videoView} = styles;

  useEffect(() => {
    if (!isVisible && isNext && videoRef) {
      videoRef.current.seek(0);
    }
  }, [isVisible, isNext]);

  const videoError = error => {
    // Manage error here
  };

  return (
    <View style={[videoOuter, {height: displayHeight}]}>
      <Video
        ref={videoRef}
        fullscreenAutorotate={false}
        source={item.video_url && {uri: item.video_url}}
        poster={item?.videoPreviewUrl}
        posterResizeMode="cover"
        autoPlay={true}
        repeat={true}
        onError={videoError}
        resizeMode={'cover'}
        muted={(!isVisible && true) || isMute}
        style={[videoView, {height: displayHeight}]}
        playInBackground={false}
        paused={!isVisible}
        ignoreSilentSwitch={'ignore'}
        onEndReachedThreshold={0.5}
        seekColor={'#FFF'}
        controls={false}
        onEnd={() => {
          console.log('onEnd');
        }}

      />
      <VolumeButton />

     
    </View>
  );
};

export {VideoComponent};
