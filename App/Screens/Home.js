import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, Animated} from 'react-native';
import {FeedRow} from '../Component/FeedRow';
import {AppContext} from '../Context';
import CommonStyle from '../Theme/CommonStyle';
import {height, isIOS} from '../Utils/Constant';
import axios from 'axios';
import {BASE_URL} from '../config';
import {data} from '../Utils/data';

const Home = () => {
  const [videoData, setData] = useState([]);
  const [page, setPage] = useState(1);
  const {displayHeight, setDisplayHeight} = useContext(AppContext);
  const refFlatList = useRef();
  const [scrollY] = useState(new Animated.Value(0));
  const [scrollInfo, setScrollInfo] = useState({isViewable: true, index: 0});

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 80};
  const onViewableItemsChanged = useRef(viewableItems => {
    const info = {
      isViewable: viewableItems.changed[0].isViewable,
      index: viewableItems.changed[0].index,
    };
    setScrollInfo(info);
  });

  const transitionAnimation = index => {
    const rowHeight = displayHeight * index;
    return {
      opacity: scrollY.interpolate({
        inputRange: [
          rowHeight,
          rowHeight + displayHeight / 2,
          rowHeight + displayHeight,
        ],
        outputRange: [1, 0.2, 0],
        useNativeDriver: true,
        extrapolate: 'clamp',
      }),
    };
  };

  const getItemLayout = (item, index) => ({
    length: displayHeight,
    offset: displayHeight * index,
    index,
  });

  const onLayout = ({nativeEvent}) => {
    setDisplayHeight((!isIOS && nativeEvent.layout.height) || height);
  };

  const onEndReached = () => {
    setPage(page + 1)
    console.log("newPage", page)
    getMoreData(page);
  };

  const keyExtractor = (item, index) => {
    return `${item.id}`;
  };

  const getAPi = async page => {
    axios({
      method: 'GET',
      url: BASE_URL + '/videos?languages=1' + '&page=' + `${page}`+ '&perPage=2',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNSIsInRpbWUiOjE2OTU2MzY1NDZ9.VvG9GGCcrMDn7RDUK-uyUkMY14IAju8YxJ0oVoMGn_4',
      },
    })
      .then(res => setData(res.data.data))
      .then(res => console.log('res', res))
      .catch(err => console.log(err));
  };

  const getMoreData = async page => {
    console.log("page", page)
    axios({
      method: 'GET',
      url: BASE_URL + '/videos?languages=1' + '&page=' + `${page}` + '&perPage=2',
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNSIsInRpbWUiOjE2OTU2MzY1NDZ9.VvG9GGCcrMDn7RDUK-uyUkMY14IAju8YxJ0oVoMGn_4',
      },
    })
      .then(res => setData(videoData.concat(res.data.data)))
      .then(res => console.log('res', res))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getAPi(1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      getMoreData(page);
    }
  }, [page]);

  const renderItem = ({item, index}) => {
    const scrollIndex = scrollInfo?.index || 0;
    const isNext = index >= scrollIndex - 1 && index <= scrollIndex + 1;
    return (
      <FeedRow
        item={videoData[index]}
        isNext={isNext}
        index={index}
        transitionAnimation={transitionAnimation}
        visible={scrollInfo}
        isVisible={scrollIndex === index}
      />
    );
  };

  return (
    <View style={CommonStyle.flexContainer} onLayout={onLayout}>
      <Animated.FlatList
        data={videoData}
        style={{
          backgroundColor: 'black',
          width: '100%',
          height: '100%',
        }}
        pagingEnabled
        initialNumToRender={3}
        windowSize={20}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        ref={refFlatList}
        automaticallyAdjustContentInsets={true}
        onViewableItemsChanged={onViewableItemsChanged.current}
        maxToRenderPerBatch={2}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {
            useNativeDriver: false,
          },
        )}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
      />
    </View>
  );
};

export default Home;
