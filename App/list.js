import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Storage from 'react-native-storage';

import Detail from './detail'
import Publish from './publish'
import Register from './register'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
})

class Img extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let status = this.props.status === null || this.props.status === 0 ? 0 : 1
        return status === 0 ? <Image source={require('../img/like.png')} style={styles._like}/> :
            <Image source={require('../img/liked.png')} style={styles._like}/>
    }
}

class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.item.status,

            likeCount: this.props.item.like_count,
        }
    }

    render() {
        return (<TouchableOpacity onPress={() => this._onPressDetail()}>
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Text style={styles._content}>{this.props.item.content}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16}}>
                    <TouchableOpacity onPress={() => this._onPressLike(this.props.item, this.props.userid)}>
                        <View style={{flexDirection: 'row'}}>
                            <Img status={this.state.status}/>
                            <Text style={{marginRight: 16}}>{this.state.likeCount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>)
    }

    _onPressDetail() {
        this.props.navigation("Detail", {'postsId': this.props.item.id})
    }

    _onPressLike(item, userId) {
        let formData = new FormData()

        formData.append('user_id', userId)
        formData.append('posts_id', item.id)

        let url = this.state.status === 1 ? 'http://127.0.0.1:8080/posts/dislike' : 'http://127.0.0.1:8080/posts/like'

        fetch(url, {
            method: 'Post',
            headers: {
                'Content-Type': 'form-data'
            },
            body: formData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                alert(responseJson.data)
                if (responseJson.data === '成功') {

                    this.setState((item) => {

                        return {
                            status: responseJson.status,
                            likeCount: responseJson.status === 1 ? item.likeCount + 1 : item.likeCount - 1
                        }
                    })
                }
            })
            .catch(err => {
                alert("失败")
                console.log(err)
            })
    }
}

class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            status: null,
            userid: 0,
            refreshing: true,
            page: 1
        }

        storage.load({
            key: 'loginState'
        }).then(ret => {
            this.setState(() => {
                return {userid: ret.userid}
            })
        }).then(() => {

        })

        this.getList()
    }

    static navigationOptions = ({navigation}) => {
        const {navigate} = navigation

        let userId = 0

        storage.load({
            key: 'loginState'
        }).then(ret => {
            userId = ret.userid
        })

        function checkLogin() {
            if (userId === 0) {
                navigate("Register")
            }
            else {
                navigate("Publish")
            }
        }

        return {
            headerRight: (
                <TouchableOpacity onPress={() => checkLogin()}>
                    <Text style={{marginRight: 16, color: '#3399FF'}}>发表</Text>
                </TouchableOpacity>
            )
        }
    }

    getList() {
        return fetch('http://127.0.0.1:8080/posts/list?user=' + 33 + '&page=' + this.state.page, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                    this.setState(pre => {
                        if (pre.page === 1) {
                            return {
                                list: responseJson,
                                refreshing: false
                            }
                        } else {
                            //json 拼接
                            return {
                                list: pre.list + responseJson,
                                refreshing: false
                            }
                        }
                    })
                }
            )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.list}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({page: 1})
                        this.getList()
                    }}
                    onEndReachedThreshold={0}
                    onEndReached={(end) => {
                        this.setState(pre => {
                            return {page: pre.page + 1}
                        })
                        this.getList()
                    }}
                    renderItem={({item}) => this._item(item, this.state.userid)}/>
            </View>
        )
    }

    _item = (item, userid) => {
        const {navigate} = this.props.navigation

        return (
            <Item item={item} userid={userid} navigation={navigate}/>
        )
    }


    _onPressComment() {
        alert("comment")
    }
}

const
    Secret = StackNavigator({
        List: {screen: List},
        Detail: {screen: Detail},
        Register: {screen: Register},
        Publish: {screen: Publish}
    })

const
    App = () => (
        <Secret/>
    );


export default class ListScreen
    extends Component {
    render() {
        return <App/>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    _border: {
        height: 0.3,
        backgroundColor: '#666666'
    },

    _title: {
        margin: 16,
        fontSize: 16
    },

    _content: {
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
        fontSize: 12,
        color: '#666666'
    },

    _like: {
        width: 20,
        height: 20,
        marginRight: 16,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    _comment: {
        width: 20,
        height: 20,
        marginRight: 16
    }
});