import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import {MYCOLOR} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';

interface TableProps {
  sandwich: any;
  ReadOnly: boolean;
  modelAns?: boolean;
}

const Table: React.FC<TableProps> = ({sandwich, ReadOnly, modelAns}) => {
  const titleRow = sandwich.bread['1'];
  const ansRow = sandwich.bread['2'];
  const ansRow2 = sandwich.bread['3'] ? sandwich.bread['3'] : null;

  const titleRowInputCount = titleRow.filter((x: string) => x == '').length;
  const ansRowInputCount = ansRow.filter((x: string) => x == '').length;

  let counter = -1;

  let upperCounter = -1;
  let upperCounter2 = -1;
  let lowCounter = titleRowInputCount - 1;
  let lowCounter2 = titleRowInputCount - 1;
  let lowerCounter = titleRowInputCount + ansRowInputCount - 1;
  let lowerCounter2 = titleRowInputCount + ansRowInputCount - 1;

  return (
    <ScrollView
      style={{
        marginTop: DeviceInfo.isTablet() ? 20 : 15,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <View style={styles.TableWrapper}>
        <View style={styles.TableRowContainer}>
          {titleRow.map((ansItem: any, index: number) => (
            <TableItem
              modelAns={modelAns ?? false}
              ReadOnly={ReadOnly}
              key={index}
              top
              index={index}
              ansItem={ansItem}
              otherAnsItem={ansRow[index]}
              otherAnsItem2={ansRow2 ? ansRow2[index] : null}
              otherFill={
                ansRow[index] === '' ? sandwich.fillings[++upperCounter] : null
              }
              otherFill2={
                ansRow2 && ansRow2[index] === ''
                  ? sandwich.fillings[++upperCounter2]
                  : null
              }
              fill={ansItem === '' ? sandwich.fillings[++counter] : {}}
            />
          ))}
        </View>
        <View style={styles.TableRowContainer}>
          {ansRow.map((ansItem: any, index: number) => (
            <TableItem
              modelAns={modelAns ?? false}
              ReadOnly={ReadOnly}
              key={index}
              top
              index={index}
              ansItem={ansItem}
              otherAnsItem={titleRow[index]}
              otherFill={
                titleRow[index] === '' ? sandwich.fillings[++lowCounter] : null
              }
              otherAnsItem2={ansRow2 ? ansRow2[index] : null}
              otherFill2={
                ansRow2 && ansRow2[index] === ''
                  ? sandwich.fillings[++lowCounter2]
                  : null
              }
              fill={ansItem === '' ? sandwich.fillings[++counter] : {}}
            />
          ))}
        </View>
        {ansRow2 && (
          <View style={styles.TableRowContainer}>
            {ansRow2.map((ansItem: any, index: number) => (
              <TableItem
                modelAns={modelAns ?? false}
                ReadOnly={ReadOnly}
                key={index}
                top
                index={index}
                ansItem={ansItem}
                otherAnsItem={titleRow[index]}
                otherFill={
                  titleRow[index] === ''
                    ? sandwich.fillings[++lowerCounter]
                    : null
                }
                fill={ansItem === '' ? sandwich.fillings[++counter] : {}}
                otherAnsItem2={ansRow[index]}
                otherFill2={
                  ansRow[index] === ''
                    ? sandwich.fillings[++lowerCounter2]
                    : null
                }
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Table;

interface ITableItem {
  fill: {
    food: string[];
    length: number;
    modelAns: string;
    type: string;
    ans?: string;
  };
  otherFill: {
    food: string[];
    length: number;
    modelAns: string;
    type: string;
    ans?: string;
  } | null;
  otherFill2: {
    food: string[];
    length: number;
    modelAns: string;
    type: string;
    ans?: string;
  } | null;
  index: number;
  top?: boolean;
  ansItem: string;
  otherAnsItem: string;
  otherAnsItem2: string;
  ReadOnly: boolean;
  modelAns: boolean;
}

const TableItem: React.FC<ITableItem> = ({
  fill,
  index,
  top,
  ansItem,
  otherFill,
  otherFill2,
  otherAnsItem2,
  otherAnsItem,
  ReadOnly,
  modelAns,
}) => {
  const [Ans, setAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );
  const mylength = fill.length ? fill.length : ansItem.length;
  const othersLength =
    otherFill === null ? otherAnsItem.length : otherFill.length;
  const othersLength2 =
    otherFill2 === null
      ? otherAnsItem2
        ? otherAnsItem2.length
        : 0
      : otherFill2.length;

  const lengthTemp = mylength > othersLength ? mylength : othersLength;

  const length = lengthTemp > othersLength2 ? lengthTemp : othersLength2;

  if (ansItem === '') {
    return (
      <TextInput
        style={[
          styles.TableItemInput,
          modelAns ? {color: MYCOLOR.lightRed} : {},
          {width: length * 18 + 6},
        ]}
        value={Ans}
        editable={!ReadOnly}
        onChange={(e: any) => {
          setAns(e.target.value);
          fill.ans = e.target.value;
        }}
      />
    );
  }

  return (
    <Text
      style={[
        styles.TableItemText,
        DeviceInfo.isTablet()
          ? {width: length * 35 + 10}
          : {width: length * 18 + 6},
      ]}
      key={index}>
      {ansItem}
    </Text>
  );
};

const styles = StyleSheet.create({
  TableWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: DeviceInfo.isTablet() ? 2 : 1,
    borderColor: MYCOLOR.whiteSmoke,
  },
  TableRowContainer: {
    flex: 1,
    margin: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  TableItemInput: {
    height: DeviceInfo.isTablet() ? 50 : 28,
    width: 1,
    lineHeight: DeviceInfo.isTablet() ? 50 : 28,
    color: '#F8F8F8',
    backgroundColor: 'transparent',
    borderWidth: DeviceInfo.isTablet() ? 2 : 1,
    borderColor: '#D2D2D2',
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    flexShrink: 0,
  },
  TableItemText: {
    height: DeviceInfo.isTablet() ? 50 : 28,
    lineHeight: DeviceInfo.isTablet() ? 50 : 28,
    textAlign: 'center',
    borderWidth: DeviceInfo.isTablet() ? 2 : 1,
    borderColor: '#D2D2D2',
    backgroundColor: '#F8F8F8',
    color: '#707070',
    flexShrink: 0,
    fontSize: DeviceInfo.isTablet() ? 26 : 14,
  },
});
