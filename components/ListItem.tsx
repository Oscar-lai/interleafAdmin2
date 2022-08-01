import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR} from '../theme/typography';
import AppText from './AppText';
import DeviceInfo from 'react-native-device-info';

interface IListItem {
  onPress: any;
  title: string;
  subtitle: string;
  icon?: boolean;
  grey?: boolean;
}

const ListItem: React.FC<IListItem> = function ({
  onPress,
  title,
  subtitle,
  icon,
  grey,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText
            style={[
              {
                fontSize: DeviceInfo.isTablet() ? 28 : 20,
                marginBottom: 1,
              },
              grey ? {color: MYCOLOR.whiteSmoke} : {},
            ]}>
            {title}
          </AppText>
          <AppText style={grey ? {color: MYCOLOR.whiteSmoke} : {}}>
            {subtitle}
          </AppText>
        </View>
        {icon && (
          <Icon color={MYCOLOR.whiteSmoke} name="chevron-right" size={50} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    width: '100%',
    padding: '3%',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
});

export default ListItem;
