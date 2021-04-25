import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Text,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { SvgFromUri } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';

import waterdrop from '../assets/waterdrop.png';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantProps, savePlant } from '../libs/storage';

interface Params {
    plant: PlantProps;
}

export function PlantSave() {
    const [selectedDateTime, setselectedDateTime] = useState(new Date());
    const [showDatePiker, setShowDatePiker] = useState(Platform.OS == 'ios');

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS === 'android') {
            setShowDatePiker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setselectedDateTime(new Date());
            return Alert.alert('Escolha uma hora no futuro!');
        }

        if (dateTime) {
            setselectedDateTime(dateTime);
        }
    }

    function handleOpenDateTimePikerForAndroid() {
        setShowDatePiker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });
            navigation.navigate('Confirmation', {
                title: 'Tudo Certo',
                subtitle: 'Fique tranquilo, que sempre vamos te lembrar de cuidar da sua plantinha com muito cuidado',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants',
            });
        } catch {
            Alert.alert('Não foi possível salvar');
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAboud}>
                        {plant.about}
                    </Text>
                </View>
                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>
                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                </Text>
                    {
                        showDatePiker && (
                            <DateTimePicker
                                value={selectedDateTime}
                                mode='time'
                                display='spinner'
                                onChange={handleChangeTime}
                            />
                        )
                    }
                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                style={styles.dateTimePikerButton}
                                onPress={handleOpenDateTimePikerForAndroid}
                            >
                                <Text style={styles.dateTimePikerText}>
                                    {`Mudar ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title="Cadastrar plantas"
                        onPress={handleSave}
                    />

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 38,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 14,
        color: colors.heading,
        marginTop: 15
    },
    plantAboud: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePikerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40
    },
    dateTimePikerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
});