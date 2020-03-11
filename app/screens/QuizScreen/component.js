import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';
import StatusBar from '../../components/elements/StatusBar';
import Question from '../../components/elements/Question';
import IMAGES from '../../configs/images';
import { scale } from '../../utils/scaling';
import Button3 from '../../components/elements/Button3';
import Button1 from '../../components/elements/Button1';
import { COLOR_BASE_PRIMARY_PURPLE, COLOR_WHITE } from '../../styles';

export default class Questions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            questions: [],

            current: 0,
            correctScore: 5,
            totalScore: 50,

            results: {
                score: 0,
                correctAnswers: 0
            },
            completed: false
        };
    }

    fetchQuestions = async () => {
        await this.setState({ loading: true });
        const response = await fetch(`http://ec2-54-152-120-82.compute-1.amazonaws.com/api/examArray`);
        const questions = await response.json();

        const results = questions;

        results.forEach(item => {
            item.id = Math.floor(Math.random() * 10000);
        });

        await this.setState({ questions: results, loading: false });
    };

    reset = () => {
        this.setState(
            {
                questions: [],
                current: 0,
                results: {
                    score: 0,
                    correctAnswers: 0
                },
                completed: false
            },
            () => {
                this.fetchQuestions();
            }
        );
    };
    _backHome = () => {
        this.props.navigation.navigate('App');
    };

    _handlePembahasan = () => {
        this.props.navigation.navigate('Pembahasan');
    };
    submitAnswer = (index, answer) => {
        const question = this.state.questions[index];
        const isCorrect = question.correct_answer === answer;
        const results = { ...this.state.results };

        results.score = isCorrect ? results.score + 5 : results.score;
        results.correctAnswers = isCorrect ? results.correctAnswers + 1 : results.correctAnswers;

        this.setState({
            current: index + 1,
            results,
            completed: index === 9 ? true : false
        });
    };

    componentDidMount() {
        this.fetchQuestions();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar />
                <ScrollView>
                    {!!this.state.loading && (
                        <View style={styles.loadingQuestions}>
                            <ActivityIndicator size="large" color={COLOR_BASE_PRIMARY_PURPLE} />
                            <TouchableOpacity onPress={this._backHome}>
                                <Text style={styles.tunggu}>Kembali</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {!!this.state.questions.length > 0 && this.state.completed === false && (
                        <Question
                            onSelect={answer => {
                                this.submitAnswer(this.state.current, answer);
                            }}
                            question={this.state.questions[this.state.current]}
                            correctPosition={Math.floor(Math.random() * 3)}
                            current={this.state.current}
                        />
                    )}

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {this.state.completed === true && (
                            <View style={{ alignItems: 'center', marginTop: scale(20) }}>
                                <Text style={{ fontSize: 25, color: COLOR_WHITE, fontWeight: 'bold' }}>Hasil Quiz</Text>
                                <View style={styles.gambar}>
                                    <Image source={IMAGES.score} resizeMode="contain" style={styles.logo} />
                                </View>
                                <Text style={{ fontSize: 35, color: COLOR_WHITE, fontWeight: 'bold', marginTop: scale(20) }}>
                                    Selamat !
                </Text>
                                <Text style={{ fontSize: 20, color: COLOR_WHITE }}>Nilaimu : </Text>
                                <Text style={{ fontSize: 30, color: COLOR_WHITE, fontWeight: 'bold' }}>
                                    {this.state.results.correctAnswers} / 10{' '}
                                </Text>
                                <View style={styles.button}>
                                    <Button1 title="Coba Lagi" onPress={this.reset} />
                                </View>
                                <View style={styles.button}>
                                    <Button3 title="Halaman Menu" onPress={this._backHome} />
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: COLOR_BASE_PRIMARY_PURPLE
    },
    logo: {
        width: 120,
        height: 200,
        alignSelf: 'center',
        padding: scale(10)
    },
    loadingQuestions: {
        marginTop: '50%',
        borderWidth: 1,
        borderColor: COLOR_WHITE,
        backgroundColor: COLOR_WHITE,
        elevation: 7,
        width: 150,
        height: 100,
        borderRadius: scale(8),
        alignSelf: 'center'
    },
    tunggu: {
        fontFamily: 'Nunito Sans',
        fontSize: 15,
        marginTop: scale(30),
        color: COLOR_BASE_PRIMARY_PURPLE,
        fontWeight: 'bold',
        textAlign: 'center'

    },
    button: {
        alignItems: 'center',
        marginTop: scale(25)
    }
});
