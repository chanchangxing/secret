/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import List from './App/list'

export default class secretreact extends Component {
    render() {
        return (
            <List/>
        );
    }
}


AppRegistry.registerComponent('secretreact', () => secretreact);
