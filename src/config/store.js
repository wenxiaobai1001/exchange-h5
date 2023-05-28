import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        isShowAppDownload:'1',
        member: null,
        activeNav: '',
        lang: 'en_US',
        exchangeSkin:'night',
        loginTimes: null,
        isShowCustomerService:false,
        isShowPopUp:false,
        isShowKline:false,
        isShowKline: false,
    },
    mutations: {
        showAppDownload(state, status){
            state.isShowAppDownload = status;
        },
        showKline(state, status){
            state.isShowKline = status;
        },
        showCustomerService(state, status){
            state.isShowCustomerService = status;
        },
        showPopUp(state, status){
            state.isShowPopUp = status;
        },
        showKline(state, status){
            state.isShowKline = status;
        },
        navigate(state, nav) {
            state.activeNav = nav;
        },
        setMember(state, member) {
            state.member = member;
            localStorage.setItem('MEMBER', JSON.stringify(member));
        },
        recoveryMember(state) {
            state.member = JSON.parse(localStorage.getItem('MEMBER'));
        },
        setlang(state, lang) {
            state.lang = lang;
            console.log(">>>>>>>>>setlang",state, lang);
            localStorage.setItem('LANGUAGE', JSON.stringify(lang));
        },
        initLang(state) {
            if (localStorage.getItem('LANGUAGE') == null) {
                state.lang = "en_US";
            } else {
                state.lang = JSON.parse(localStorage.getItem('LANGUAGE'));
            }
            console.log(">>>>>>>>>state.lang",state.lang);
        },
        initLoginTimes(state){
            if(localStorage.getItem("LOGINTIMES") == null){
                state.loginTimes = 0;
            }else{
                state.loginTimes = JSON.parse(localStorage.getItem('LOGINTIMES'));
            }
        },
        setLoginTimes(state, times){
            state.loginTimes = times;
            localStorage.setItem('LOGINTIMES', JSON.stringify(times));
        },
        setSkin(state,skin){
            state.exchangeSkin=skin;
        }
    },
    getters: {
        member(state) {
            return state.member;
        },
        isLogin(state) {
            return state.member != null;
        },
        lang(state) {
            return state.lang;
        },
        loginTimes(state) {
            return state.loginTimes;
        }
    }
});
