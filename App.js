import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    Linking,
    TouchableOpacity
} from 'react-native';
import axios from 'axios'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 1
    },
    contactsContainer: {
        flex: 14,
        padding: 10
    },
    mainTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        padding: 5
    },
    searchInput: {
        borderRadius: 3,
        borderColor: '#cecece',
        borderWidth: 1,
        height: 45,
        fontSize: 16
    },
    contact: {
        height: 70,
        flexDirection: 'row',
    },
    profilePic: {
        height: 60,
        width: 60,
        borderRadius: 50,
        marginRight: 10
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    name: {
        fontSize: 17,
    },
    number: {
        color: '#a7a7a7',
    },
    numberContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    iconContainer: {
        marginRight: 5,
        marginTop: 1,
    }
})

export default class extends Component {
    handleSearch = (text) => {
        const filteredContacts = this.state.contacts.filter(name => name.toLowerCase().indexOf(text.toLowerCase()) > -1)
        this.setState({
            contactsToDisplay: filteredContacts
        })
    }
    renderContacts = () => {
        if(this.state.request.status) {
            if(this.state.contactsToDisplay.length) {
                return (
                    <View style={styles.contactsContainer}>
                        <ScrollView>
                            {this.state.contactsToDisplay.sort().map((contact, index) => {
                                const cellphone = `${Math.floor(1000 + Math.random() * 9000)}00${index}`
                                return (
                                    <View style={styles.contact} key={index}>
                                        <View style={styles.justifyCenter}>
                                            <Image style={styles.profilePic} source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}/>
                                        </View>
                                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${cellphone}`)} style={styles.justifyCenter}>
                                            <Text style={styles.name}>{contact}</Text>
                                            <View style={styles.numberContainer}>
                                                <View style={styles.iconContainer}>
                                                    <Icon style={styles.number} name='call' size={16}/>
                                                </View>
                                                <Text style={styles.number}>{cellphone}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                )
            }
            else {
                return(
                    <View style={styles.contactsContainer}>
                        <Text>Sin coincidencias de busqueda</Text>
                    </View>
                )
            }
        }
        else {
            return (
                <View style={styles.contactsContainer}>
                    <Text>{this.state.request.text}</Text>
                </View>
            )
        }
    }
    state = {
        request: {
            status : false,
            text   : 'Cargando contactos...' 
        },
        contacts : [],
        contactsToDisplay: [],
        searchValue : ''
    }
    componentDidMount = () => {
        axios.get('https://api.fungenerators.com/name/generate?category=pirate&limit=20')
        .then((response) => {
            try {
                if(response.status === 200) {
                    if(response.data.contents.names.length) {
                        this.setState({
                            request: {
                                status: true,
                            },
                            contacts: response.data.contents.names,
                            contactsToDisplay: response.data.contents.names
                        })
                    }
                    else {
                        this.setState({
                            request: {
                                status : false,
                                text   : 'Sin contactos disponibles por el momento'
                            }
                        })
                    }
                }
            }
            catch(err) {
                console.log('Error al procesar la petición >>', err)
                this.setState({
                    request: {
                        status : false,
                        text   : 'Ocurrió un error al procesar la lista de contactos' 
                    }
                })
            }
        })
        .catch((response) => {
            console.log('Error en la petición >>', response)
            this.setState({
                request: {
                    status : false,
                    text   : 'Ocurrió un error al obtener la lista de contactos' 
                }
            })
        })
    } 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.mainTitle}>Contactos</Text>
                </View>
                <View style={{...styles.container, paddingLeft: 10, paddingRight: 10}}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar contactos"
                        onChangeText={text => this.handleSearch(text)}
                    />
                </View>
                {this.renderContacts()}
            </View>
        )
    }
}

