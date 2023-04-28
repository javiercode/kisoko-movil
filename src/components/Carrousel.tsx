import React, { useState, useEffect, useRef } from 'react'
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import { Avatar, Button, Card, Dialog, IconButton, Paragraph, Portal, Text, Title } from 'react-native-paper'
import Carousel from 'react-native-reanimated-carousel';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { formatDateTime } from '../utils/GeneralUtils';
import { IGaleria } from '../utils/interfaces/ITarea';
import Color from '../utils/styles/Color';

const { width: PAGE_WIDTH } = Dimensions.get('window');


interface ICarrouselProps {
    imgList: IGaleria[],
    dropImage: boolean,
    updateGallery: (path: string) => void,
}

interface IToggleButton {
    status: 'checked' | 'unchecked' | undefined;
}



export const Carrousel: React.FC<ICarrouselProps> = ({ imgList, dropImage, updateGallery }: ICarrouselProps) => {
    const [confirm, setConfirm] = useState<boolean>(false);
    const selected = useRef<string>("");

    useEffect(() => {
        console.log("imgList photo",imgList)
    }, []);

    const openConfirm = (path: string) => {
        selected.current = path;
        setConfirm(true)
    }

    const deleteImg = () => {
        // const tempGaleriaList = imgList.filter(o => o.path !== selected.current);
        // galeriaRef.current = tempGaleriaList;

        updateGallery(selected.current)
        setConfirm(false)
    }

    return (
        
        <SafeAreaView style={styles.container}>
            <Carousel
                loop
                width={PAGE_WIDTH * 0.8}
                height={(PAGE_WIDTH * 0.8)}
                data={imgList.reverse()}
                mode={imgList.length > 1 ? "parallax" : undefined}
                renderItem={({ item, index }) => (
                    <Card>
                        <Card.Title title={(imgList.length - (index)) + " - " + (item.fecha)}
                            right={(props) => <IconButton icon="delete" color={Color.white} key={"head-card-title-icon"}
                                style={styles.avatarIcon} onPress={() => openConfirm(item.path)} disabled={!dropImage} />} />
                        {/* <Card.Cover source={ item.type=="local"? require(item.path) :{ uri: item.path }} style={{ height: PAGE_WIDTH, backgroundColor: Color.black }} resizeMode="stretch" /> */}
                        <Card.Cover source={ { uri: item.path }} style={{ height: PAGE_WIDTH, backgroundColor: Color.black }} resizeMode="stretch" />

                    </Card>
                )}
            />
            {/* <Portal> */}
                <Dialog visible={confirm} onDismiss={() => setConfirm(false)}>
                    <Dialog.Content>
                        <Paragraph>¿Esta seguro de eliminar esta foto?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setConfirm(false)}>Cancel</Button>
                        <Button onPress={() => deleteImg()}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
                {/* </Portal> */}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor: Colors.darker,
        paddingLeft: (PAGE_WIDTH * 0.1)
    },
    avatarIcon: {
        backgroundColor: Color.error,
    },
})
