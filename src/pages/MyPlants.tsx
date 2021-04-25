import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    Alert,
    Platform
} from 'react-native';
import { formatDistance, nextWednesday } from 'date-fns';

import { Header } from '../components/Header';
import { loadPlant, PlantProps, removePlant } from '../libs/storage';
import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWatered] = useState<string>()

    function handleRemove(plant: PlantProps) {
        Alert.alert(`Remover`, `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não ',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) =>
                            oldData.filter((item) => item.id != plant.id)
                        );
                    } catch (error) {
                        Alert.alert('Não foi possível remover');
                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStorageData() {
            const plantasStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantasStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de regar a  ${plantasStoraged[0].name} às ${nextTime} horas.`
            )
            setMyPlants(plantasStoraged);
            setLoading(false);
        }
        loadStorageData();
    }, []);

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => { handleRemove(item) }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={Platform.OS === 'ios' ? { flex: 1 } : {}}
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60,
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
});