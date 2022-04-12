import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './config.json';
import React from "react";
import {View} from 'react-native';
const Icon = createIconSetFromFontello(fontelloConfig, 'vsafeicons');
const CustomIcon = (props:any) => {
    return(
        <View style={{padding:5}}>
        <Icon name={props.name} color={props.color} size={props.size} style={props.style}/>
        </View>
    )
}
export default CustomIcon;