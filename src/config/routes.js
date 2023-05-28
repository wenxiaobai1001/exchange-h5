export default [
    { path: '*', component: resolve=>(require(["../pages/index/index"],resolve)) },
    { path: '/', component: resolve=>(require(["../pages/index/index"],resolve)) },
    { path: '/index', component: resolve=>(require(["../pages/index/index"],resolve)) },
    { path: '/my', component: resolve=>(require(["../pages/uc/My"],resolve)) },
    { path: '/setUp', component: resolve=>(require(["../pages/uc/setUp"],resolve)) },
    { path: '/login', component: resolve=>(require(["../pages/uc/login"],resolve)) },
    { path: '/recharge', component: resolve=>(require(["../pages/recharge/Index"],resolve)) },
    { path: '/doRecharge', component: resolve=>(require(["../pages/recharge/Recharge"],resolve)) },
    { path: '/market', component: resolve=>(require(["../pages/market/index"],resolve)) },
    { path: '/login/returnUrl/:returnUrl', component: resolve=>(require(["../pages/uc/login"],resolve)) },
    { path: '/register', component: resolve=>(require(["../pages/uc/register"],resolve)) },
    { path: '/app', component: resolve=>(require(["../pages/uc/AppDownload"],resolve)) },
    { path: '/changePassword', component: resolve=>(require(["../pages/uc/set/changePassword"],resolve)) },
    { path: '/aboutUs', component: resolve=>(require(["../pages/uc/set/aboutUs"],resolve)) },
    { path: '/authentication', component: resolve=>(require(["../pages/uc/set/authentication"],resolve)) },
    { path: '/phoneAuthenication', component: resolve=>(require(["../pages/uc/set/phoneAuthenication"],resolve)) },
    { path: '/emailAuthenication', component: resolve=>(require(["../pages/uc/set/emailAuthenication"],resolve)) },
    { path: '/moneyPassword', component: resolve=>(require(["../pages/uc/set/moneyPassword"],resolve)) },
    { path: '/moneyPasswordFind', component: resolve=>(require(["../pages/uc/set/moneyPasswordFind"],resolve)) },
    { path: '/moneyPasswordUpdate', component: resolve=>(require(["../pages/uc/set/moneyPasswordUpdate"],resolve)) },
    { path: '/findPwd', component: resolve=>(require(["../pages/uc/findpwd"],resolve)) },
    { path: '/orderDetail', component: resolve=>(require(["../pages/exchange/OrderDetail"],resolve)) },
    { path: '/exchangeCoins/:type', component: resolve=>(require(["../components/exchange/ExchangeCoins"],resolve)) },
    { path: '/exchangeKline/:pair/:type', component: resolve=>(require(["../components/exchange/ExchangeKline"],resolve)), name: "ExchangeKlinePair"},
    { path: '/exchange', component: resolve=>(require(["../pages/exchange/exchange"],resolve)) },
    { path: '/exchange/:pair', component: resolve=>(require(["../pages/exchange/exchange"],resolve)), name: "ExchangePair"},
    { path: '/entrust/current', component: resolve=>(require(["../pages/exchange/EntrustCurrent"],resolve))},
    { path: '/entrust/history', component: resolve=>(require(["../pages/exchange/EntrustHistory"],resolve))}, 
    { path: '/swap', component: resolve=>(require(["../pages/swap/SwapIndex"],resolve)) },
    { path: '/swap/:pair', component: resolve=>(require(["../pages/swap/SwapIndex"],resolve)), name: "SwapPair"},
    { path: '/help', component: resolve=>(require(["../pages/cms/help"],resolve)) },
    { path: '/helplist', component: resolve=>(require(["../pages/cms/HelpList"],resolve)) },
    { path: '/helpdetail', component: resolve=>(require(["../pages/cms/HelpDetail"],resolve)) },
    { path: '/notice', component: resolve=>(require(["../pages/cms/Notice"],resolve)) },
    { path: '/invite', component: resolve=>(require(["../pages/invite/Invite"],resolve)) },
    { path: '/lab', component: resolve=>(require(["../pages/activity/Activity"],resolve)) },
    { path: '/ctc', component: resolve=>(require(["../pages/ctc/Ctc"],resolve)) },
    { path: '/cexchange', component: resolve=>(require(["../pages/cexchange/cexchange"],resolve)) },
    { path: '/option', component: resolve=>(require(["../pages/option/Option"],resolve)) },
    { path: '/news', component: resolve=>(require(["../pages/news/News"],resolve)) },
    { path: '/lab/detail/:id', component: resolve=>(require(["../pages/activity/ActivityDetail"],resolve)) },
    { path: '/announcement/:id', component: resolve=>(require(["../pages/cms/NoticeItem"],resolve)), name: "NoticeDetail" },
    { path: '/partner', component: resolve=>(require(["../pages/activity/Partner"],resolve)) },
    { path: '/bzb', component: resolve=>(require(["../pages/activity/Bzb"],resolve)) },
    { path: '/whitepaper', component: resolve=>(require(["../pages/cms/WhitePaper"],resolve)) },
    { path: '/envelope/:eno', component: resolve=>(require(["../pages/envelope/Envelope"],resolve)) },
    { path: '/seconds', component: resolve=>(require(["../pages/seconds/Seconds"],resolve)) },
    { path: '/language', component: resolve=>(require(["../pages/uc/set/language"],resolve)) },
    { path: '/uploadHeader', component: resolve=>(require(["../pages/uc/set/UploadHeader"],resolve)) },
    { path: '/seconds/:pair', component: resolve=>(require(["../pages/seconds/Seconds"],resolve)), name: "SecondsPair"},
    { path: '/moneyIndex', component: resolve=>(require(["../pages/money/Index"],resolve))},
    { path: '/swapAssets', component: resolve=>(require(["../pages/uc/SwapAssets"],resolve))},
    { path: '/secondsAssets', component: resolve=>(require(["../pages/uc/SecondsAssets"],resolve))},
    { path: '/myorders', component: resolve=>(require(["../pages/uc/InnovationOrders"],resolve))},
    { path: '/myminings', component: resolve=>(require(["../pages/uc/InnovationMinings"],resolve))},
    { path: '/mylocked', component: resolve=>(require(["../pages/uc/InnovationLocked"],resolve))},
    { path: '/exchangeRecordList', component: resolve=>(require(["../pages/uc/ExchangeRecordList"],resolve))},
    { path: '/rechargeRecordList', component: resolve=>(require(["../pages/uc/RechargeRecordList"],resolve))},
    { path: '/withdrawRecordList', component: resolve=>(require(["../pages/uc/WithdrawRecordList"],resolve))},
    { path: '/withdraw', component: resolve=>(require(["../pages/withdraw/Index"],resolve))},
    { path: '/doWithdraw', component: resolve=>(require(["../pages/withdraw/withdraw"],resolve))},
    { path: '/withdraw/address', component: resolve=>(require(["../pages/withdraw/WithdrawAddress"],resolve))},
    { path: '/withdraw/code', component: resolve=>(require(["../pages/withdraw/WithdrawCode"],resolve))},

    {
        path: '/identbusiness',
        component: resolve=>(require(["../pages/otc/IdentBusiness"],resolve))
    },
    {
        path: '/otc',
        component: resolve=>(require(["../pages/otc/Main"],resolve)),
        children: [{
                path: 'trade/*',
                component: resolve=>(require(["../pages/otc/Trade"],resolve))
            }
        ]
    },
    {
        path: '/otc/ad',
        component: resolve=>(require(["../components/otc/MyAd"],resolve))
    },
    {
        path: '/otc/ad/create',
        component: resolve=>(require(["../pages/otc/AdPublish"],resolve))
    },
    {
        path: '/otc/ad/update',
        component: resolve=>(require(["../pages/otc/AdPublish"],resolve))
    },
    {
        path: '/uc',
        component: resolve=>(require(["../pages/uc/MemberCenter"],resolve)),
        children: [{
                path: '',
                component: resolve=>(require(["../components/uc/Safe"],resolve))
            },
            {
                path: 'safe',
                component: resolve=>(require(["../components/uc/Safe"],resolve))
            },
            {
                path: 'account',
                component: resolve=>(require(["../components/uc/Account"],resolve))
            },
            {
                path: 'money',
                component: resolve=>(require(["../components/uc/MoneyIndex"],resolve))
            },
            {
                path: 'swapAssets',
                component: resolve=>(require(["../components/uc/SwapAssets"],resolve))
            },
            {
                path: 'record',
                component: resolve=>(require(["../components/uc/Record"],resolve))
            },
            // {
            //     path: 'recharge',
            //     component: resolve=>(require(["../components/uc/Recharge"],resolve))
            // },
            // {
            //     path: 'withdraw',
            //     component: resolve=>(require(["../components/uc/Withdraw"],resolve))
            // },
            // {
            //     path: 'withdraw/address',
            //     component: resolve=>(require(["../components/uc/WithdrawAddress"],resolve))
            // },
            // {
            //     path: 'withdraw/code',
            //     component: resolve=>(require(["../components/uc/WithdrawCode"],resolve))
            // },
            // {
            //     path: 'ad',
            //     component: resolve=>(require(["../components/otc/MyAd"],resolve))
            // },
            // {
            //     path: 'ad/create',
            //     component: resolve=>(require(["../pages/otc/AdPublish"],resolve))
            // },
            // {
            //     path: 'ad/update',
            //     component: resolve=>(require(["../pages/otc/AdPublish"],resolve))
            // },
            {
                path: 'order',
                component: resolve=>(require(["../components/uc/myorder"],resolve))
            },
            // {
            //     path: 'entrust/current',
            //     component: resolve=>(require(["../components/uc/EntrustCurrent"],resolve))
            // },
            // {
            //     path: 'entrust/history',
            //     component: resolve=>(require(["../components/uc/EntrustHistory"],resolve))
            // }, 
            {
                path: 'trade',
                component: resolve=>(require(["../components/uc/MinTrade"],resolve))
            },
            {
                path: 'invitingmining',
                component: resolve=>(require(["../components/uc/InvitingMin"],resolve))
            },
            {
                path: 'paydividends',
                component: resolve=>(require(["../components/uc/PayDividends"],resolve))
            },
            {
                path: 'promotion/mycards',
                component: resolve=>(require(["../components/uc/PromotionMyCards"],resolve))
            },
            {
                path: 'promotion/mypromotion',
                component: resolve=>(require(["../components/uc/MyPromotion"],resolve))
            },
            {
                path: 'innovation/myorders',
                component: resolve=>(require(["../components/uc/InnovationOrders"],resolve))
            },
            {
                path: 'innovation/myminings',
                component: resolve=>(require(["../components/uc/InnovationMinings"],resolve))
            },
            {
                path: 'innovation/mylocked',
                component: resolve=>(require(["../components/uc/InnovationLocked"],resolve))
            },
            {
                path: 'quickExchange',
                component: resolve=>(require(["../components/uc/QuickExchange"],resolve))
            },
            {
                path: 'apiManage',
                component: resolve=>(require(["../components/uc/apiManage"],resolve))
            },
            {
                path: 'secondsAssets',
                component: resolve=>(require(["../components/uc/SecondsAssets"],resolve))
            },
            {
                path: 'paymentEvidence',
                component: resolve=>(require(["../components/uc/PaymentEvidence"],resolve))
            }
        ]
    },
    {
        name: 'tradeInfo',
        path: '/otc/tradeInfo',
        component: resolve=>(require(["../pages/otc/TradeInfo"],resolve))
    },
    {
        path: '/checkuser',
        component: resolve=>(require(["../pages/otc/CheckUser"],resolve))
    },
    {
        path: '/chat',
        component: resolve=>(require(["../pages/otc/Chat"],resolve))
    },
    {
        path: '/about-us',
        component: resolve=>(require(["../pages/cms/AboutUs"],resolve))
    },

];
