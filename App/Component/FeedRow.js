import React from 'react';
import {View} from 'react-native';
import {FeedFooter} from './FeedFooter';
import {FeedSideBar} from './FeedSideBar';
import {VideoComponent} from './VideoComponent';

const FeedRow = ({item, isNext, isVisible, index, transitionAnimation}) => {

  return (
    <View>
      <VideoComponent item={item} isNext={isNext} isVisible={isVisible} />
      {/* <FeedSideBar item={item} animation={transitionAnimation(index)} /> */}
      {/* <FeedFooter item={item} animation={transitionAnimation(index)} /> */}
    </View>
  );
};

export {FeedRow};
