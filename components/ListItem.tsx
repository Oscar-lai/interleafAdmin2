import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR} from '../theme/typography';
import AppText from './AppText';

interface IListItem {
  onPress: any;
  title: string;
  subtitle: string;
  icon?: boolean;
}

const ListItem: React.FC<IListItem> = function ({
  onPress,
  title,
  subtitle,
  icon,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={{fontSize: 20, marginBottom: 1}}>{title}</AppText>
          <AppText>{subtitle}</AppText>
        </View>
        {icon && <Icon color={MYCOLOR.whiteSmoke} name="chevron-right" size={50} />}
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
